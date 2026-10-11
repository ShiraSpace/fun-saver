# Every refresh runs the loader through one hook

One PR, one phase.

## Branch

`feat/refresh-loader` still sits on `b94a236`, which is missing #199 and its new
`router.refresh()` in `use-amount-entry.ts`. The branch was never pushed and has no commits
of its own, so before any code: `git fetch origin` and
`git checkout -B feat/refresh-loader origin/main` (`e8e506f` or later). Untracked files,
this plan among them, carry over.

## Why

After a save, the app refreshes the page's data from the server. Only deposits and
withdrawals show the header loader while that happens. Finishing an account edit and a
withdrawal turned down with a conflict refresh silently. Those refreshes should show the
loader, and every one should do it the same way.

## The primitive

`LoaderProvider` (`src/hooks/loader-context.tsx`) owns one transition. The loader shows
while that transition is pending or while any `useReportLoader` is reporting:

```tsx
export function LoaderProvider({ children }: LoaderProviderProps): JSX.Element {
  const [pendingLoaderCount, setPendingLoaderCount] = useState(0);
  const [isRunning, runWithLoader] = useTransition();
  const loader: Loader = {
    isLoaderShown: isRunning || pendingLoaderCount > 0,
    setPendingLoaderCount,
    runWithLoader,
  };
  ...
}

export function useRunWithLoader(): TransitionStartFunction {
  return useLoader().runWithLoader;
}
```

The transition lives in the provider, not in each caller. If it lived in the caller, the
loader would stop when that caller unmounts, even though the refresh is still on its way.
That happens when the drawer closes during a conflict refresh. The provider sits in
`app/layout.tsx` and never unmounts, so the loader stops only when the work is done.

Overlapping refreshes share the one flag safely. In React 19.2 each `startTransition`
call sets its own optimistic `isPending = true`, which is undone only when that call's
own work commits (`dispatchOptimisticSetState` in `startTransition`). So `isRunning` stays
true until the last overlapping refresh has rendered.

Every caller has the same shape:

```ts
const runWithLoader = useRunWithLoader();
runWithLoader(() => router.refresh());
```

`router.refresh()` in Next 16.2 calls `startTransition` and suspends on the new page data
(`app-router-instance.js`, `use-action-queue.js`). Run inside our transition, it keeps
`isRunning` true until the new data has rendered. `useRefreshBalances` already works this
way, so #200 has proved it.

## Which primitive, and when

- **`useRunWithLoader`** is for work we start that ends once new server data renders. Today
  that means every `router.refresh()`.
- **`useReportLoader`** is for a pending state that something already holds: Next.js holds
  it for links (`LinkLoaderReporter`), and our own state holds it for the view-mode switch
  (`isSwitching`).

## Callers

| Caller | Today | After |
|---|---|---|
| Deposit and withdrawal (`Account.tsx`) | its own `useRefreshBalances` hook | `runWithLoader(() => router.refresh())`. `use-refresh-balances.ts`, its test and `REFRESH_BALANCES_TEST_IDS` are deleted |
| A withdrawal turned down with a conflict (`use-amount-entry.ts`, new in #199) | `router.refresh()`, no loader | `runWithLoader(() => router.refresh())` |
| Theme save (`use-account-theme.ts`) | `router.refresh()`, no loader | unchanged: the theme is already applied on screen and the refresh lands too fast for the bar to be seen |
| Finishing an account edit or creating an account (`use-account-navigation.ts`, used by Home, Method and Transactions) | `router.refresh()`, no loader | `returnToViewing(); runWithLoader(() => router.refresh())` |
| Child/parent switch (`use-view-mode-switch.ts`) | `useReportLoader(isSwitching)` | unchanged, see below |
| Link navigation (`LinkLoaderReporter`) | `useReportLoader(useLinkStatus().pending)` | unchanged |
| First account created (`CreateAccount.tsx`, `router.push('/')`) | no loader | unchanged: that screen has no header, and the transition would end at the moment the new page and its header render, so the bar could never show |

**Why the switch stays on `useReportLoader`.** Moving it would make its sequence an async
transition. While an async transition is pending, React 19.2 puts every other
`startTransition` on the same lane and holds it back until the async work finishes
(`requestTransitionLane` returns `currentEntangledLane`). That includes a tapped link and a
refresh. The switch would also need two sources for one fact: `isSwitching` drives the knob
and the transition drives the loader. And it would remove no primitive, because
`useReportLoader` stays for links anyway. As it is, the switch already reports the state it
holds.

## Details that keep behaviour the same

- **Only the refresh goes inside the hook, not the save.** An update made after an `await`
  inside the transition is not part of it. A refresh started there would run in a
  transition of its own, and ours would end while the data was still loading. So the save
  is awaited first, and only then does the refresh run inside the hook, the way deposits
  work today. Every function passed to `runWithLoader` is synchronous.
- **Nothing passed to `runWithLoader` throws.** React 19 sends an error thrown inside a
  transition to the nearest error boundary. `router.refresh()` does not throw: when a
  refresh fails, Next.js falls back to a full page load. A save that can fail stays outside,
  with its own `requestState`.
- **The view mode returns to viewing right away.** In `finishEditing`, `returnToViewing()`
  stays outside the transition. Inside it, React would hold the mode change back until the
  refresh landed, and the edit form would stay on screen.

## Glossary

The row "The bar shown while work is pending" gains `useRunWithLoader`.

## Keeping every commit green

`useRunWithLoader` throws outside `LoaderProvider`. Two hook tests reach `useAmountEntry`
through a bare `renderHook` from `@testing-library/react`, with no provider:
`use-amount-entry.test.ts` and `use-withdrawal-form.test.ts`. Every other test that
reaches a changed hook already renders through `src/test-utils/render`.

In `src/test-utils/render.tsx`, the `AppProviders` wrapper is a closure inside `render`
today. It moves to module scope and takes the same `RenderOptions`. The cookie and pathname
setup moves into a shared helper that both functions call. Next to `render`, a `renderHook`
then uses the same wrapper, and the two files switch to it. That change touches only the
harness and adds no tests, so it lands in the production commit; without it, that commit
would fail `npx jest`. **Decision for the user:** approve it going into the production
commit.

## Tests (after the production code is committed)

Each test is watched failing against its own deliberate break (snapshot, break, run,
restore, `cmp`), per AGENTS.md.

**A held refresh is one shared helper.** The deleted `use-refresh-balances.test.tsx` holds
a refresh by making the mocked `router.refresh` set state that suspends on a promise. Four
files need that, so it moves to `src/test-utils/` as one helper, named after the e2e
`holdNextPage` / `release`: a component that goes in the tree and arms the mock, and a
`release()` that lets the refresh land. Account, conflict and `finishEditing` all use
it.

- **`useRunWithLoader`, in `src/hooks/__tests__/loader-context.test.tsx`.** The tests are
  generic and do not use the router. They check that:
  - the loader shows while an update inside the work is suspended (`use(promise)`, the way
    a refresh behaves), and stops once that update lands;
  - the loader stays shown after the component that started the work unmounts. Break: move
    the transition back into the caller;
  - the loader stays shown until the last of two overlapping pieces of work lands.
- **Account:** `Account.test.tsx` already checks that the refresh is asked for once. It
  gains the loader-shown and loader-stopped checks from the deleted test.
- **Conflict refresh, in `use-amount-entry.test.ts`** (where the 409 path is tested today),
  through the new `renderHook`, reading `useAmountEntry` and `useIsLoaderShown` together. A
  409 shows the loader until the refresh lands. Any other failure never starts it.
- **`finishEditing`, in a new `src/hooks/__tests__/use-account-navigation.test.tsx`:** the
  loader shows until the refresh lands. The mode is already back to viewing while it shows.
  Break: move `returnToViewing()` inside the transition.
- **In a real browser:** jest mocks the router, so it cannot prove the main claim, that the
  loader holds until the new data renders. `holdNextPage` catches a refresh: Next adds the
  `_rsc` query to every page-data fetch (`set-cache-busting-search-param.js`), and a refresh
  is not a prefetch. In `e2e/page-loading.e2e.ts`, a new `describe` of its own covers a
  deposit with the refresh held. It does not join the `journeys` loop, which waits for a
  title. It checks three things:
  - while the refresh is held, the old balance is still on screen and the line is on the
    header;
  - after release, the test waits for the new balance;
  - once the new balance shows, the line is gone.

## Screenshots

The loader appears in places it did not before, so the PR gets screenshots through the
`pr-screenshots` skill: finishing an edit and the conflict refresh. Each is
shot with the refresh held by `holdNextPage`, because a local refresh lands before a
screenshot can catch the bar.

## Decisions

- **Name:** `useRunWithLoader`, handing back `runWithLoader` ("run this work with the
  loader shown").
- **`HEADER_TEST_IDS.progress`:** the rename stays out of this PR.
