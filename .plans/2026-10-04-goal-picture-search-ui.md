# GoalPictureSearch UI — plan (split out of PR 4b)

**Branch:** `feat/goal-picture-search-ui` (worktree `fun-saver-goal-picture-search-ui`, off `a47859a`).
**Spec:** `docs/superpowers/specs/2026-10-03-saving-goal-design.md` (Image search v1; New components, row `GoalPictureSearch`, frame 1b).
**Mockup:** `mockups/saving-goal.html`, frame 1b.

The search sheet, built on its own and not rendered anywhere. PR 4b puts it inside `SetGoal`.
Out of scope: API routes, `AccountSummary`, `MenuGoal`, `SetGoal`, and wiring it into any screen. Those
belong to PR 2 and PR 4b.

**Status:** built and tested on PR #189, revised after review (domain names, `useDeferredValue` in place of
the debounce, `chosenPicture` held as a `GoalPicture`). The sections below describe the code as it stands.

## Decisions (approved 2026-10-04)

1. **Typing stays responsive:** the input updates on every keystroke, and `matchingPictures` runs on
   `useDeferredValue(query)`, so React searches when it has time. This replaced an earlier 200 ms
   debounce hook (decided on #189). No dependency, no timer.
2. **Tile colour:** the existing `colors.softBg`. No new `ThemeColors` fields, because the celebration lane
   edits the theme files.
3. **Starting picture:** `picture: GoalPicture | null`. `null` means none chosen yet, and the sheet then
   starts with `DEFAULT_GOAL_PICTURE` (🎯) as the chosen picture. That constant goes in
   `src/lib/goal/constants.ts`, the spec's place for it, which did not have it yet.
4. **Copy:** the proposed Hebrew, to be reviewed at the code checkpoint.
5. **Closing:** ✕, a tap on the scrim, and Escape (`useEscapeKey`) call `onClose`. Phone Back, swipe-down,
   the grabber and a focus trap are left to 4b.
6. **בחירה** only calls `onChange`. `SetGoal` closes the sheet.
7. **Screenshots:** added to #189 at the user's request, shot from a throwaway, uncommitted page that mounts
   the sheet alone. PR 4b shoots it in place.
8. **Glossary:** this PR adds two rows: picture tile (`PictureTile`, `PictureTiles`, `FoundPictures`) and why
   no pictures show (`whyNoPictures`, `NoPicturesReason`).
9. **`useEscapeKey`** moves from `Menu/` to `src/hooks/`, since the sheet is its first user outside the menu.
   The sheet listens with `takesPrecedence`, so Escape closes only the sheet.

## What the sheet does

- It opens already searching for the goal name. Editing the text searches again, through `useDeferredValue`.
- The word list loads with `import()` the first time the sheet mounts and is indexed once with
  `indexPictureWords`. The index is kept in a module-level cache (`loadedPicturesByTerm` in
  `use-matching-pictures.ts`), so a sheet opened again starts with the pictures already found.
  `matchingPictures(searchedQuery, picturesByTerm)` is memoised on both.
- Picture tiles fill a 3-column grid (`FoundPictures`). It is as tall as it is wide (`aspect-ratio: 1`), so
  three rows of square tiles show and the rest scroll. The sheet is capped at `90dvh`.
- Tapping a tile chooses it, shown with a ✓. `chosenPicture` is a `GoalPicture` throughout; a tile compares
  on `.emoji` and hands back `{ kind: 'emoji', emoji }`. **בחירה** sends `chosenPicture` through `onChange`. A picture is always chosen (🎯 at first when `picture` is null), so **בחירה** is never
  disabled.
- Nothing in the sheet says "emoji".

### Why no pictures show (`whyNoPictures`, drawn by `NoPicturesReason` in place of the tiles)

| When | Shows | Copy |
|---|---|---|
| Word list loading (`REQUEST_STATE.pending`) | `NoPicturesReason` | `מחפשים תמונות…` |
| Load failed (`REQUEST_STATE.failed`) | `NoPicturesReason` in `alertText` | `אופס, התמונות לא נטענו. סגרו ונסו שוב.` |
| Loaded, query blank after trim | `NoPicturesReason` (nothing typed) | `כתבו מה רוצים לחפש` |
| Loaded, no match | `NoPicturesReason` naming the query | `לא מצאנו תמונה ל„{query}”. נסו מילה אחרת.` |
| Loaded, matches | `FoundPictures` | — |

## Files (as built)

Under `src/components/Goal/GoalPictureSearch/` unless a path says otherwise.

| File | Lines | Holds |
|---|---|---|
| `src/lib/goal/constants.ts` | +5 | `DEFAULT_GOAL_PICTURE` (🎯) |
| `docs/glossary.md` | +2 | the picture-tile and why-no-pictures rows |
| `src/hooks/use-escape-key.ts`, `src/hooks/constants.ts` | 39, 3 | moved from `Menu/`, with `ESCAPE_KEY` and `KEY_DOWN_EVENT` |
| `GoalPictureSearch.tsx` | 61 | the sheet: scrim, dialog, Escape |
| `GoalPictureSearch.styles.ts` | 33 | `Scrim`, `Sheet` |
| `use-goal-picture-search.ts` | 48 | the query, the deferred `searchedQuery`, `chosenPicture` (a `GoalPicture`), `confirmChoice` |
| `use-matching-pictures.ts` | 51 | loads and caches the index, matches; returns `{ foundEmoji, requestState }` |
| `constants.ts`, `index.ts` | 4, 2 | sheet test ids; named re-exports |
| `PictureTiles/PictureTiles.tsx` | 89 | `whyNoPictures({ foundEmoji, requestState, query })` and `FoundPictures` |
| `PictureTiles/PictureTiles.styles.ts` | 66 | `FoundPictures`, `PictureTile`, `NoPicturesReason` |
| `PictureTiles/constants.ts` | 13 | test ids and copy |
| `SheetHeading/` | 31 + 28 + 10 | the title and ✕ |
| `QueryField/` | 26 + 19 + 7 | the search box; hands the typed text up through `editQuery` |
| `ChooseButton/` | 21 + 7 | **בחירה** |

Every function is under 40 lines and every file under 200.

## Names

```ts
export interface GoalPictureSearchProps {
  goalName: string;
  picture: GoalPicture | null;
  onChange: (picture: GoalPicture) => void;
  onClose: () => void;
}
```

- `picture` and `onChange` pair as in `NameField` and `TransactionTypeToggle`. `onClose` matches
  `TransactionDrawer`.
- A tile tap is `chosenPicture` / `onChoosePicture`. **בחירה** is `ChooseButton`'s `onChoose`, and only it
  changes the goal's picture. `QueryField` hands the typed text up through `editQuery`.
- The hook returns `foundEmoji`, the emoji the search found, so it reads apart from `picture` (a `GoalPicture`)
  and does not shadow the lib's `matchingPictures`.

## Look

- Every colour comes from a theme token. The scrim uses `tints.shade`, the sheet `colors.surface` with
  `shadows.deep`, and the search box `colors.walletTrack`. The tiles use `colors.softBg`. The chosen tile's
  outline and ✓ badge use `colors.selectionRing`, with the tick in `textOnPrimary`.
- The scrim and sheet are both at `LAYERS.modalForeground`, above `SetGoal`'s overlay at `modal`.
- The sheet is `role="dialog"` with `aria-modal`, labelled by its title through `useId`. The ✕ has
  `aria-label="סגירה"`. The search box is `type="search"` and is not auto-focused.

## Tests (as built)

Each test was watched failing against its own deliberate break (the snapshot method from AGENTS.md).

| File | Tests |
|---|---|
| `PictureTiles.test.tsx` | one tile per matching picture, in order; only the chosen picture is pressed; tapping a tile chooses its `GoalPicture`; the reason shown while loading, when the list failed to load, with nothing typed, and for no match; the chosen ring is `selectionRing` on jungle-quest |
| `use-matching-pictures.loading.test.ts` | waiting for the word list before it has ever loaded |
| `use-matching-pictures.first-load.test.ts` | pictures arrive on the first load (own file, so the cache is empty) |
| `use-matching-pictures.test.ts` | no longer waiting once loaded; "האופניים" finds 🚲; a reopened sheet starts with the pictures |
| `use-matching-pictures.failed.test.ts` | a list that cannot load reports `failed` |
| `GoalPictureSearch.test.tsx` | opens searching for the goal name; is named by its title; typing searches again (waits with `findBy`, no timer); בחירה with no tap sends 🎯; a tap alone sends nothing; tap then בחירה sends that picture; ✕, a tap outside and Escape close, ✕ without changing the picture and Escape without closing the layer below; opened with a picture, it shows as chosen |
| `SheetHeading`, `QueryField`, `ChooseButton` tests | the title's id; ✕ closes; the query shows; typing reports the query; tapping בחירה chooses |
| `src/hooks/__tests__/use-escape-key.test.ts` | Escape calls `onEscape`; other keys, unmounted and not-listening are ignored; `takesPrecedence` keeps Escape from other listeners |
