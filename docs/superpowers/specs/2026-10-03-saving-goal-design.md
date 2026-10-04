# Saving goal — design

> Status: **approved in brainstorming 2026-10-03, revised after three reviews the
> same day** (the second and third checked every claim against the code; the
> third also against CLDR 48.2.0 and `emoji-test.txt` 18.0), not yet
> implemented.
> Mockup: `mockups/saving-goal.html` — every screen and state below, with the
> confetti, border and hold-to-cancel animations live.
> Backlog: `docs/backlog.md` § "Savings goal on the `savings` wallet" and
> Roadmap § 1 (the research additions).
> Method: `docs/the-method.md` § 2 — "Money can only be withdrawn once the
> predetermined goal is fully reached", unenforced until this feature.
> Depends on: `feat/default-withdrawal-wallet` (savings is never the default
> withdrawal wallet). This feature lands after it.

## Purpose

Give a child something concrete to save for — a bike, a dress, a Barbie — and
make the Save jar's rule real: savings cannot be withdrawn until the goal is
reached. The goal stays in view on the home screen, celebrates when it is
reached, and ends when the child withdraws the money to buy it.

## Scope

**In (v1):**
- Set a goal: name, picture, amount.
- Pictures come from an image search whose results, in v1, are emoji drawn as
  picture tiles, searched by Hebrew words.
- The goal screen, the goal line on the savings card, the menu entry.
- Savings withdrawals locked until the goal is reached, on the server and in
  the drawer.
- A celebration when the goal is reached.
- Cancelling a goal from the menu, behind a hold-to-confirm dialog.
- Every goal kept as history.

**Out (deliberate):**
- **Upload from the phone, paste a link, Pixabay photos.** Upload and link are
  shown disabled with a בקרוב tag. All three need image storage and arrive
  together in a later version, in the same search sheet and picture tiles.
- **Editing a goal.** The only change is cancel, then set a new one.
- **Goals on spending or good deeds.**
- **More than one active goal per child.**
- **A history screen.** History is stored, not shown.
- **Child mode.** The goal is not shown in child mode (`ChildAccount`,
  `ChildMenuContent`), and the child-mode spec's goal lines (the picture in
  the child savings card, tiles counted from the goal's start, its withdrawal
  note) are left as they are. A separate feature after this one brings the
  goal to child mode. Every screen below is the parent view.
- **Hiding set and cancel from viewers.** The page does not know the signed-in
  user's role today; the menu's edit button is shown to viewers too and the
  server refuses them. Goals follow the same rule.
- **Locking savings with no goal.** Method § 2 ties the lock to a goal; with
  none, savings stays open as today, so families who never set one see no
  change.
- **Overdraft as `409`.** An overdraft refusal also only reaches a stale
  drawer, but it stays `400` as today.

## Decisions

| Question | Decision |
|---|---|
| Where the goal shows on home | One line at the bottom of the savings `WalletCard` (mockup 4a), `GoalProgress`. Not a separate card. |
| Progress text | Amounts only, `₪85 / ₪300` and `מתוך ₪300`. Never a percentage. The saved amount, and the `עוד ₪…` still to go, use `MONEY_ROUNDING.floorToShekels`, so ₪299.50 shows `₪299 / ₪300` while savings is still locked; the goal amount is whole shekels, so the floored balance reaches it exactly when `goalReached` does. |
| Progress bar at ₪0 | Drawn with a minimum visible sliver, never empty (endowed progress, backlog Roadmap § 1). |
| When the goal is reached | Celebration, savings unlocks, and the **next savings withdrawal of any size** ends the goal as `completed`. The drawer says so before the child confirms (5c). A smaller withdrawal cannot leave the goal active: savings would fall below it and lock again with the money already spent. |
| Savings with no active goal | Unlocked, as today. The rule is "locked until the goal", so with no goal there is nothing to wait for. |
| A goal at or below what is already saved | Allowed. It shows as reached at once and locks nothing, so `SetGoal` shows the reached line instead of the lock note once the amount is at or below the savings balance. |
| Lock copy | Framed as a promise, not a ban (backlog Roadmap § 1, Laibson 1997): `🔒 שומרים עד היעד` on the badge and the disabled drawer button, `🔒 החיסכון שמור ליעד „…”` in the drawer, and on `SetGoal` "מרגע שקובעים יעד, שומרים את קופת החיסכון עד שיש בה ₪…". Never `אי אפשר` / `נעול` in UI copy. |
| The lock icon | 🔒 only while savings is locked. Once reached there is no lock at all, not a 🔓. |
| Editable | No. Cancellable only, from the menu only, with a 2-second press-and-hold. |
| Picture source in v1 | Image search over a generated Hebrew emoji word list. |
| Storage | A `goals` table, one row per goal ever set, kept after it ends. |
| Endings | `completed` or `cancelled`, in the column `ending`. Reached-then-cancelled is `cancelled`. |
| Which withdrawal ended a goal | Not stored as a column. The goal's `ended_at` is set to that withdrawal's `created_at`, so the two match exactly. |
| No picture chosen | `SetGoal` sends 🎯, so every stored goal has a picture and `picture` stays `NOT NULL`. |
| A refused savings withdrawal | `409`: it conflicts with the goal's current state, which the screen did not show. Every `409` in this feature tells the client to refresh. |
| How often the celebration plays | Every time home or the goal screen opens while the goal is reached, and when an account switch remounts the cards; `router.refresh()` does not replay it. After the 10 seconds the card keeps a gold outline. |

## Data

### `goals` table

```sql
CREATE TABLE IF NOT EXISTS goals (
  id         TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  amount     INTEGER NOT NULL CHECK (amount > 0),
  picture    JSONB NOT NULL,
  started_at TEXT NOT NULL,
  ended_at   TEXT,
  ending     TEXT CHECK (ending IN ('completed', 'cancelled')),
  CHECK ((ended_at IS NULL) = (ending IS NULL))
);

CREATE UNIQUE INDEX IF NOT EXISTS goals_one_active_per_account_idx
  ON goals(account_id) WHERE ended_at IS NULL;
```

- There is no `wallet_id`. A goal is always on the account's `savings` wallet,
  found by `walletName`; goals on other wallets are out of scope.
- `amount` is agorot, like every amount in the app. Its upper limit lives only
  in `assertValidGoalRequest`, like `transactions.amount`, so the two cannot
  drift.
- `picture` is `{ "kind": "emoji", "emoji": "🚲" }` in v1. Photos later become
  `{ "kind": "photo", "url": "…" }`, so goals saved in v1 keep working without
  a data migration. This is the only part of the design shaped for a later
  version.
- `started_at` and `ended_at` are ISO timestamps, stored as `TEXT` like
  `created_at` in `schema.sql`. `started_at` is `new Date().toISOString()`,
  the clock a transaction's `created_at` uses, so a goal's start and end
  compare on one clock.
- The **active goal** is the account's row with no `ended_at`. The partial
  unique index makes a second active goal impossible, even from a double tap
  or two parents at once, and it serves the `getActive` lookup, so no other
  index is needed. The `CHECK` keeps `ended_at` and `ending` set or unset
  together.
- Rows are never deleted while the account exists. A finished goal is history.
  The app never deletes accounts; the cascade matches every other child table
  and serves the `test:db` cleanup.
- **Reached is never stored.** It is `savings balance ≥ goal amount`, worked out
  each time, so it cannot disagree with the balance.

### Migration

The block above is appended to `src/db/schema.sql`, which is idempotent and
safe to replay. `run-migration.ts` splits the file on `;`, so the block holds
no `;` inside a statement.

- **Neon `test` and `dev`, during PR 1** (`npm run db:migrate-test`,
  `db:migrate-dev`), since PR 1's `test:db` suite needs the table. If the DDL
  changes after it first ran there, drop the table on that branch by hand
  before re-migrating: replay never alters an existing table.
- **Neon `production`, after PR 1 merges and before PR 2 is pushed**
  (`npm run db:migrate`, after confirming `DATABASE_URL` points at the
  `production` branch, which holds real data). Nothing runs migrations
  automatically — there is no CI and the Vercel build is only `next build` —
  and Vercel deployments, previews included, use `DATABASE_URL`. From PR 2
  every page load and every savings withdrawal reads `goals`, so PR 2's first
  preview would fail without it. The table is additive, so creating it early
  is harmless. The replay also adds child mode's `accounts.view_mode` if
  production does not have it yet; check before running.

### Types

The endings are an `as const` map in `src/lib/goal/constants.ts`, the way
`TRANSACTION_TYPE` lives in `src/lib/transaction/constants.ts`:

```ts
export const GOAL_ENDING = {
  completed: 'completed',
  cancelled: 'cancelled',
} as const;
```

and the types in `src/lib/goal/types.ts`:

```ts
export type GoalEnding = (typeof GOAL_ENDING)[keyof typeof GOAL_ENDING];

export interface GoalPicture {
  kind: 'emoji';
  emoji: string;
}

export interface Goal {
  id: string;
  accountId: string;
  name: string;
  amount: number;
  picture: GoalPicture;
  startedAt: string;
  endedAt?: string;
  ending?: GoalEnding;
}
```

The page receives each account's active goal alongside its wallets, as
`AccountSummary.goal?: Goal`.

## Rules

1. **One active goal per child, and only on savings.** Setting a goal while one
   is active is refused. All three stores enforce it the same way: Postgres by
   the unique index, the memory and JSON stores by checking before insert
   (the JSON store's per-process write queue makes check-then-insert atomic,
   as it does for `DuplicateAccountError`).
2. **While the goal is not reached, savings cannot be withdrawn from.** The
   server refuses it, not just the screen, so a stale page or a direct API call
   cannot get past the lock. Deposits into savings are unaffected.
3. **Once the goal is reached, any savings withdrawal ends it** as `completed`,
   in the same database transaction that records the withdrawal. If they were
   separate and the second write failed, the money would be gone, the goal
   would remain, and savings would lock again below a goal the child already
   spent.
4. **Cancelling ends the goal** as `cancelled` and unlocks savings. The money
   stays in the wallet.
5. **Ending a goal names the goal.** Both endings update
   `WHERE id = $goalId AND account_id = $accountId AND ended_at IS NULL`, never
   "the account's active goal". A goal set by another parent between the read
   and the write is never ended by mistake, and a goal id from another account
   matches nothing. A completing withdrawal and a cancel of the same goal race
   on that `WHERE`; the first wins, and the other either records the
   withdrawal against a goal already `cancelled` or gets `409`.
6. **Only an account editor** can set or cancel a goal, through the same
   `withAccountEditor` check (`src/app/api/with-account-access.ts`) that
   guards account edits and withdrawals today.
7. **The balance the lock uses** is the one the overdraft check uses: the sum
   of the wallet's stored transactions (`balance(listTransactionsByWallet)`).
   Withdrawals do not settle interest; page loads do, and store what they
   show. Between page loads a savings balance only rises (a deposit, or
   interest settled by another page load) or falls by a withdrawal, and while
   a goal is active the only withdrawal possible is one that ends it. So for
   the goal a page shows, the page never shows it reached while the server
   finds it unreached; a stale page may show it locked after it was reached,
   until the next load. A different goal set since the page loaded is caught
   by the server and answered with `409` and a refresh.
8. **The checks run in the overdraft check's order.** Amount, then unknown
   wallet, then overdraft, then the goal. A reached goal with a withdrawal
   larger than the balance is refused as an overdraft and stays active.
9. **The lock has the overdraft check's read-then-write gap, deliberately.**
   A goal set in the same instant as a savings withdrawal can miss it; the
   result is a goal showing less progress, never lost money or a stuck lock.
   Closing the gap means a conditional `INSERT … WHERE NOT EXISTS` for the
   lock and the overdraft together — worth it only if the app outgrows family
   scale.

A valid goal request body is `{ name, amount, picture }`, with `amount` in
shekels like the withdrawal body. `setGoal` takes the raw body and first calls
`assertValidGoalRequest(body)`, which narrows it to `GoalRequest` or throws
`ValidationError`, the way `assertPositiveAmount` guards a deposit; it then
stores the name trimmed and the amount in agorot through `shekelsToAgorot`.
A valid body has:
- a name of 1–`MAX_GOAL_NAME_LENGTH` (30) characters after trimming, stored
  trimmed;
- an amount of whole shekels from 1 to `MAX_GOAL_SHEKELS` (100,000), which
  keeps the agorot far below the `INTEGER` limit;
- a picture of exactly `{ kind: 'emoji', emoji }`, where `emoji` is at most 32
  UTF-16 units and is exactly one fully-qualified emoji:
  `new RegExp('^\\p{RGI_Emoji}$', 'v')`. `\p{Extended_Pictographic}` is not
  used: it refuses flags and keycaps and, unanchored, accepts `🚲abc`. The `v`
  flag needs `new RegExp`, because `tsconfig` targets ES2017; Node 20.9+
  (Next 16's minimum) runs it;
- no other fields.

`goal-request-validator.ts` is server-only. Safari 16.4 and Chrome 111, inside Next 16's
supported browsers, have no `v` flag, and a module-level `new RegExp(…, 'v')`
throws on import there. So no client component imports
`goal-request-validator.ts`;
`SetGoal` takes its limits from `constants.ts`.

## Server

### Logic — `src/lib/goal/`

- `goal-request-validator.ts`: `assertValidGoalRequest(body)` and
  `isValidPictureEmoji(emoji)`, the picture check the word-list script reuses.
- `goal-reached.ts`: `goalReached(goal, balance)`.
- `goals.ts`: `setGoal` and `cancelGoal`.
- `savings-withdrawal.ts`: the goal branch of a savings withdrawal (below).
- `picture-search.ts`: `indexPictureWords(pictureWords)`, built once when the
  word list loads, and `matchingPictures(query, picturesByTerm)` over that
  index on every keystroke.
- `errors.ts`: `SavingsLockedError`, thrown like `OverdraftError`;
  `GoalAlreadyActiveError`; `GoalNotActiveError`.
- `constants.ts`: `MAX_GOAL_NAME_LENGTH`, `MAX_GOAL_SHEKELS`, `GOAL_ENDING`,
  `DEFAULT_GOAL_PICTURE` (🎯).

`addWithdrawal` in `src/lib/transaction/transactions.ts` gains the goal check
when the wallet is the account's savings wallet
(`walletNamed(wallets, WALLET_NAMES.savings)`), after the overdraft check
(rule 8):

- active goal, not reached → throw `SavingsLockedError`;
- active goal, reached → `store.insertWithdrawalCompletingGoal(withdrawal,
  goal.id)`;
- no active goal → unchanged.

For savings, the wallet's transactions and the active goal are read together
(`Promise.all`), so the lock adds no round trip in sequence. `addWithdrawal`
counts 28 of 40 lines today; the parallel read and a three-way branch would
take it to the limit, so the goal branch is its own function in
`savings-withdrawal.ts`.

### Store

A `GoalRepository` beside the other repositories in `data-store.ts`, in all
three backends (`postgres-store`, `memory-store`, `json-file-store`):

- `insert(goal)` — throws `GoalAlreadyActiveError` when the account has one.
  Postgres maps the unique violation (`23505`) to it in a `goalWriteError`
  beside `accountWriteError` in `postgres-store/errors.ts`.
- `getActive(accountId)`
- `end({ goalId, accountId, endedAt, ending })` — returns the ended goal, or
  `undefined` when none matched (rule 5).
- `insertWithdrawalCompleting(withdrawal, goalId)` — the one write that
  spans two tables, owned by the goal repository the way
  `insertAccountWithOwner` is owned by `AccountUserRepository`. It does not
  map `23505`: there it can only be a failed withdrawal insert, never a second
  active goal, so it rethrows.

`DataStore` gains `insertGoal`, `getActiveGoal`, `endGoal` and
`insertWithdrawalCompletingGoal`, delegated by `RepositoryStore`
(`src/db/repository-store.ts`), whose constructor takes the goal repository as
a fifth argument. `rows.ts` gains `GoalRow` and `goalFromRow`: `GoalRow` types
`ended_at` and `ending` as `string | null` and `picture` as `unknown` (like
`wallets`); `goalFromRow` reads `null` as `undefined` with `?? undefined` and
casts `picture` to `GoalPicture`. No row has had a nullable column before, so
`rows.test.ts` covers both an active and an ended goal.

The cross-table write per backend:

- **Postgres:** one `sql.transaction([...])` holding the `INSERT` into
  `transactions` and the rule-5 `UPDATE` on `goals`, the way
  `insertAccountWithOwner` does today. `PostgresTransactions` exposes an
  `insertStatement`, as `PostgresAccounts` does, so the insert is not written
  twice. Neon's HTTP transaction is a batch and cannot branch on a read, so
  every condition lives in the `WHERE` clause. An `UPDATE` that matches no
  row (the goal was cancelled in between) still records the withdrawal; savings
  is unlocked then anyway.
- **JSON file:** both changes inside one `FileSession.write`, saved once.
- **Memory:** `MemoryGoals` is built with the `MemoryTransactions` instance,
  the way `MemoryAccountUsers` is built with accounts and users. It ends the
  goal first (if still active), then awaits `transactions.insert([withdrawal])`,
  whose push runs before its first `await`, so nothing can interleave.

`StoreContents` in `data-store.ts` gains `goals`, and `FileSession`'s
`emptyContents` gains `goals: []`, so store files written before this feature
read as having none. `writeInitialStore` in `e2e/driver/use-driver.ts` builds
a full `StoreContents`, so it passes `goals: initialStore.goals ?? []`
through in the same PR — without it `tsc` fails, and with it the visual and
browser suites can seed goals.

### Loading the goal for the page

`settleAccountInterest` builds every `AccountSummary`: home and `/method`
reach it through `summarizeAccounts`, `/transactions` through
`settleInterest`, and all three draw the menu that shows the goal. It reads
the active goal in parallel with the account's transactions (`Promise.all`)
and puts it on the `AccountSummary`. No extra round trip in sequence; one
query per account, run in parallel, like the transactions read beside it. If
the read takes `settleAccountInterest` past 40 lines, the two reads move into
a `readAccountRecords` helper.

### API

Same shape as the sibling routes, behind `withAccountEditor`. New messages go
in `API_ERRORS` in `src/app/api/constants.ts` (`invalidGoal`,
`goalAlreadyActive`, `goalNotActive`, `savingsLocked`), and routes answer
with them (`conflict(API_ERRORS.savingsLocked)`), not with `error.message`,
since `src/lib` does not import from `src/app/api`. Nothing returns `409`
today, so `src/app/api/responses.ts` gains `conflict(error)` beside
`badRequest`.

| Route | Does | Refuses |
|---|---|---|
| `POST /api/accounts/[id]/goals` | sets a goal, returns it with `201`, like `POST /api/accounts` | 400 invalid input (`ValidationError`, as the deposit route maps it); 409 a goal is already active |
| `DELETE /api/accounts/[id]/goals/[goalId]` | cancels that goal, returns it as JSON (`200`) | 409 it is not this account's active goal |
| `POST /api/accounts/[id]/withdrawals` | unchanged, plus rule 2 | 409 `SavingsLockedError`, in the same `catch` that maps `OverdraftError` |

`POST`, not `PUT`: setting is not idempotent, a repeat is refused. The goal id
is in the cancel route's path, so a stale screen cannot cancel a goal it never
displayed (rule 5). `withAccountAccess` passes the route's awaited params to
its handler as a third argument (the `AccountHandler` type gains it, so
`withAccountEditor` and `withAccountUser` both pass it through), and the
cancel route reads `goalId` there.
`409`, not `404`, for a goal that is not active: the conditional `UPDATE`
cannot tell an unknown id from an ended one, the client does the same in both
cases, and a `404` would reveal whether a foreign id exists.

On the client, `fetchJson` (`src/lib/fetch-json.ts`) accepts
`method: 'DELETE'` with `body` optional (none is sent). Every route here
returns JSON, so it still parses the response. A failure throws
`RequestFailedError` (in `fetch-json.ts`), which carries `status`, so a caller
can tell a `409` (refresh) from any other failure (the existing error alert).
Its callers today are `use-add-transaction`, `use-update-account`,
`use-create-account` and `use-account-theme`; only the first changes.

## Image search, v1

- **Source:** Unicode CLDR emoji annotations in Hebrew from the pinned
  `cldr-json` release 48.2.0 — `cldr-annotations-full/annotations/he` and
  `cldr-annotations-derived-full/annotationsDerived/he` — plus
  `emoji-test.txt` from `https://www.unicode.org/Public/<version>.0.0/emoji/`.
  Unicode License v3. Checked (each finds these among others): אופניים →
  🚲🚴🚵, שמלה → 👗, קורקינט → 🛴, גיטרה → 🎸, אוזניות → 🎧, כלב → 🐶🐕.
- **Generated, not installed.** `scripts/emoji-words.ts` (run with
  `npx tsx scripts/emoji-words.ts`; `tsx` is already a devDependency) fetches
  the pinned files once and writes `src/lib/goal/emoji-words.he.json`,
  committed with the licence in `src/lib/goal/emoji-words.LICENSE` and listed
  in `.prettierignore`, and run again with `npm run emoji-words`. The URLs,
  the version floor and the byte limit live in the script's constants file.
  No runtime or package dependency, so the `~/.npmrc` lockfile trap does not
  apply. `tsconfig` includes `**/*.ts`, so the script is type-checked and
  linted like the app.
- **Fully-qualified emoji only.** CLDR keys leave out U+FE0F (`✈`, `🏎`, `❤`),
  and `assertValidGoalRequest` refuses those. The script keys every emoji by its
  `fully-qualified` line in `emoji-test.txt`, matches a CLDR key after removing
  U+FE0F from both, and writes the fully-qualified string. It fails if any
  emoji it writes does not pass `isValidPictureEmoji`.
- **Trimmed while generating:** a sequence is dropped if it holds a skin-tone
  modifier (U+1F3FB–1F3FF), a hair component (U+1F9B0–1F9B3) or ♀/♂
  (U+2640/2642, which also drops the standalone ♀️ and ♂️), so one bicycle
  does not fill the grid five times. (Those are
  separate `fully-qualified` lines in `emoji-test.txt`, so filtering on status
  alone removes nothing.) Emoji newer than **Emoji 13.0** are dropped, read
  from each line's `E<n>`: Android 11, the oldest Android current Chrome
  supports besides 10, draws all of them, and a goal picture is stored for
  good; 14.0 would add only 🛝 🪩 🪬. Only each emoji and its Hebrew words are
  kept. The script fails if the output exceeds **150 KB** raw (measured: about
  140 KB, about 30 KB gzipped on the wire).
- **Loaded with `import()` when the sheet opens**, never with the app.
- **Search runs on the phone.** No server call. Before matching, both sides
  drop niqqud (U+0591–U+05C7, except the maqaf U+05BE), and `'` / `’` become
  `׳` (ג׳ויסטיק). Each annotation is split into words on spaces, `-` and the
  maqaf `־`, and the whole phrase is kept too, so "יום הולדת" finds 🎂 and
  "דו-גלגלי", "דו־גלגלי" and "דו גלגלי" search alike. A typed word is tried as typed first; only if it
  matches no word in the list is it tried again with one, then two, leading
  prefix letters (`ה ו ב ל מ ש כ`) removed, and only while at least 2 letters
  remain, stopping at the first step that matches. So "האופניים" finds
  "אופניים", while "כלב" stays 🐶 and never becomes "לב" ❤. The price:
  "ולאופניים" stops at "לאופניים", a word of 🚳 ("אין כניסה לאופניים"), and
  finds only 🚳; merging every step's results would instead let "הכלב" find ❤. Plain "appears inside" is not used: short
  words like "יד" would match inside "תלמידה". Results are ranked by how many
  typed words matched, plus one when the whole typed phrase matched, with ties
  in the word list's order (so "כלב" shows 🦴 first, since "כלב" is one of
  its words); the grid shows the first 9 and scrolls for the rest.
  Plurals (`כלבים`) do not match in v1.
- The sheet opens already searching for the goal name. Editing the text
  searches again.
- Results are drawn as picture tiles, the same tiles Pixabay photos will fill
  later. Nothing in the sheet says "emoji".
- Without a chosen picture, `SetGoal` sends 🎯 (see Decisions).

## Screens

Mockup frame numbers in brackets.

### Opening and closing

`APP_MODE` gains `settingGoal`, `viewingGoal` and `cancellingGoal` beside
`editingAccount`. The menu closes before it opens any of them (as
`startEditingAccount` does), so the cancel dialog needs its own mode too;
mockup 3c draws the menu behind the dialog only for context.
`AccountManagement` draws their overlays, and home, `/transactions` and
`/method` all render it, so the goal screens open over whichever page the
menu was on, and closing returns to that page in `viewing` mode. The menu's
goal row opens `viewingGoal`; the goal line on the savings card opens it on
home. Adding three overlays takes `AccountManagement` and
`useAccountNavigation` past the 40-line limit, so the goal overlays move into
their own component.

Each goal overlay reads the goal from `currentAccount.goal`, the way
`editingAccount` is derived from `currentAccount`. If a refresh leaves no goal,
or one with a different id, `viewingGoal` and `cancellingGoal` return to
`viewing`.

After a goal is set or cancelled, the page calls `router.refresh()`, the way
`finishEditing` does. On a `409`, `SetGoal` and `CancelGoal` close to
`viewing` and refresh, since it means the screen was stale. Both track the
request as a `requestState` (`REQUEST_STATE` idle · pending · failed), the way
`useAccountForm` does: while it is `pending` the submit, ✕, ביטול and the
cancel hold are disabled, so a double tap cannot send a second request; any
failure other than `409` sets `failed` and keeps the overlay open with a save
error.

### New components

Each in its own folder with `.tsx`, `.styles.ts`, `.test.tsx`, `constants.ts`
and `index.ts`. `MenuGoal` lives in `src/components/Menu/MenuGoal/` beside
`EditAccountButton`; `GoalProgress` in
`src/components/Account/WalletCard/GoalProgress/` beside `InterestStats`; the
rest in `src/components/Goal/<Name>/`.

| Component | Frames | What it is |
|---|---|---|
| `SetGoal` | 1a | Name, picture, amount, the lock note, **קובעים יעד** and **ביטול**. Same ✕ and title as `AccountForm`, reusing its `CancelButton` (the ✕, passed `disabled` while saving) and `FormTitle` (`AccountForm/index.ts` exports both; today it exports only `AccountForm`). **קובעים יעד** is a `PrimaryButton`, disabled until there is a name and an amount, and while the request is pending; **ביטול** is a new text button. Both ✕ and ביטול close without saving. Upload and link are disabled with a בקרוב tag. With the amount at or below the savings balance, the lock note gives way to the reached line. |
| `GoalPictureSearch` | 1b | The search sheet: search box, picture tiles in a 3×3 grid that scrolls, a ✓ on the chosen one, **בחירה**. |
| `ViewGoal` | 2, 2b | Picture, name, bar, `₪85 נחסכו` / `מתוך ₪300`, the "עוד ₪215 ומגיעים!" line, the `🔒 שומרים עד היעד` badge and **חזרה**. Reached: the `הגעת ליעד!` heading, gold glow, full bar, "כל הכבוד! אפשר לקנות את …", badge without a lock. |
| `GoalProgress` | 4a, 4b | One line at the bottom of the savings `WalletCard`. Tapping opens `viewingGoal`. Reached: green, `🎉 הגעת ליעד!`. |
| `Celebration` | 2b, 4b | Confetti that falls for about 10 seconds, then fades; plays as the Decisions table says. Drawn above the cards, the celebrating savings card included, on a `LAYERS` value below `modal`, with `pointer-events: none` and `aria-hidden`. Not mounted when `motionIsReduced()`. |
| `MenuGoal` | 3a, 3b | In `AccountControls`, right under `AccountPicker` and above `ViewModeSwitch` (🧒 מצב ילד); in the parent menu only, not in `ChildMenuContent`. The goal row with a thin bar and `₪85 / ₪300`, with a small **ביטול היעד** link under it, or **🎯 קביעת יעד חיסכון +** when there is no goal. Reads the goal from `useAccounts().currentAccount.goal`. |
| `CancelGoal` | 3c | Dialog: picture, `לבטל את היעד „…”?`, how much was saved, that the money stays and savings unlocks. `role="alertdialog"`, `aria-modal`, labelled by its title, focus kept inside; **Escape** keeps the goal (`useEscapeKey`, which moves from `Menu/` to `src/hooks/` now that a component outside the menu uses it). Focus returns to the menu toggle on close. **משאירים את היעד** is the primary button and has focus. The red **לחיצה ארוכה לביטול היעד** fills over 2 seconds of holding and resets on release, `pointercancel` or leaving the button; it has no `onClick` and sets `touch-action: none`, so a small finger move is not a scroll. Space or Enter holds the same way: the hold starts on the first `keydown` (ignoring `event.repeat`) and stops on `keyup` or `blur`. It suppresses the long-press context menu and text selection (`contextmenu`, `user-select`, `-webkit-touch-callout`), and its label tells screen readers to hold for 2 seconds (VoiceOver and TalkBack pass double-tap-and-hold through). The fill still runs under `prefers-reduced-motion`: it is progress, not decoration. |

### Changes to existing components

- **`WalletCard`, savings.** `Account` passes `account.goal` to `WalletList`,
  which renders `GoalProgress` beside `SavingsInterestStats` as the savings
  card's children and passes `WalletCard` the locked and reached state as
  props. Active goal: 🔒 on the amount, and `GoalProgress` under the interest
  stats. Reached, while `Celebration` plays: a white-gold-pink-purple border
  travels around the card with a soft glow, 🐷 and the goal picture wobble, a
  shine runs along the full bar. The card does not move or scale. Afterwards it
  keeps a plain gold outline until the goal ends. Motion is off under
  `prefers-reduced-motion`; the outline stays.
- **`WalletPicker` / `WithdrawalForm`.** `useWithdrawalForm` takes the
  account's `goal`. Locked: savings is greyed with a 🔒 and `עוד ₪215 ליעד`
  (5a). It is already never the default wallet
  (`feat/default-withdrawal-wallet`). Picking it shows a `LockedSavings` panel
  — the goal, `🔒 החיסכון שמור ליעד „…”` and the bar — instead of
  `AmountKeypad`, keeps the `PrimaryButton` disabled with `withdrawalCopy`'s
  locked label `🔒 שומרים עד היעד`, and hides `WithdrawalAlert` (5b). The
  keypad and submit are one component today (`AmountKeypadWithSubmit`), so it
  takes a prop to draw the panel in place of the keypad; `LockedSavings` is
  its own component, which keeps `WithdrawalForm` under 40 lines.
  `use-withdrawal-form` treats a locked savings wallet like an overdraft:
  `canSubmit` is false. Reached: savings looks like any wallet, and a green
  line reads `🎉 משיכה מהחיסכון תסיים את היעד „…”` (5c).
- **`useAmountEntry`.** The drawer never shows a server message (they are
  English, and `fetchJson` never reads the error body). On a `409` it calls
  `router.refresh()` and returns `requestState` to `idle` instead of `failed`:
  the refreshed account shows savings as locked, and the lock panel is the
  message. Any other failure sets `failed` and shows `WithdrawalAlert` as
  today.

All text goes in each component's `constants.ts`. Colours come from the theme:
the reached green is `gainText` / `gainSoftBg`. The confetti, border and gold
colours are new `ThemeColors` fields in `theme-tokens.ts`, set in each of the
three theme files (`sunshine-quest`, `jungle-quest`, `midnight-blue`); the
gold outline may reuse `star`. `no-color-leaks.test.ts` keeps literals out of
components.

## Testing

Where each test lives, so `jest`'s `testMatch` (`**/__tests__/**` and
`src/components/**`) and the npm scripts pick it up:

| What | Where | Run by |
|---|---|---|
| Logic | `src/lib/goal/__tests__/*.test.ts` | `npm test` |
| Memory and JSON stores | `src/db/{memory,json-file}-store/__tests__/goals.test.ts` | `npm test` |
| Rows | `src/db/__tests__/rows.test.ts` | `npm test` |
| Postgres | `src/db/postgres-store/__tests__/goals.e2e.ts` | `npm run test:db` |
| Routes | `src/app/api/accounts/[id]/goals/__tests__/route.test.ts` | `npm test` |
| Components | beside each component | `npm test` |
| Browser | `e2e/goal.visual.ts`, `e2e/cancel-goal.visual.ts`, driver methods on `AppDriver` | `npm run test:e2e` |

Fixtures `createMockGoal` / `mockGoal` go in `src/test-utils/mocks/goal.mocks.ts`,
beside `account.mocks.ts`. `test-database.ts` gains `goalId(suffix)`; its
cleanup needs no `goals` line, since deleting the run's accounts cascades.

- **Logic:** `assertValidGoalRequest` at every boundary (name 0/1/30/31 after trimming,
  amount 0/1/100,000/100,001 and non-whole, extra fields, a picture that is
  text, two emoji or `🚲abc`, a flag that is accepted, `❤` without U+FE0F
  refused and `❤️` accepted); every emoji in `emoji-words.he.json` passes
  `isValidPictureEmoji`; `goalReached` at `balance = amount − 1` and `= amount`; a
  locked withdrawal is refused; a reached withdrawal ends the goal as
  `completed` with `ended_at` equal to the withdrawal's `created_at`; a
  reached withdrawal larger than the balance is refused as an overdraft and
  the goal stays active; spending and good-deeds withdrawals ignore the goal;
  savings with no goal withdraws as today; deposits are unaffected; cancelling
  ends it as `cancelled`. Picture search: "האופניים" finds 🚲, "כלב" finds 🐶
  and no ❤, "יום הולדת" finds 🎂, "יד" does not match inside "תלמידה".
- **Stores (memory and JSON):** a second active goal is refused;
  `end` with another account's id or an ended goal ends nothing; withdraw-and-
  end on a goal already cancelled records the withdrawal and leaves the goal
  `cancelled`; an old store file without `goals` reads as none.
- **Database (`test:db`):** the index refuses a second active goal and it
  surfaces as `GoalAlreadyActiveError`; the `CHECK`s refuse `amount = 0` and
  an `ending` without `ended_at`; `end` fills `ended_at` and `ending`;
  withdraw-and-end whose `INSERT` is forced to fail (a withdrawal id already
  inserted through `transactionId()`; ids are UUIDs in production, so this only
  simulates a failed write) rejects with the database error, not
  `GoalAlreadyActiveError`, and leaves the goal active — neither write behind.
- **Routes:** another user's account is refused; a second goal gets 409;
  cancelling with a stale or foreign `goalId` gets 409; a locked withdrawal
  gets 409. `fetchJson` sends `DELETE` with no body and its failure carries
  the status.
- **Components:** one test file per new component. For example, savings is
  greyed in the drawer, a `409` refreshes without the error alert, the goal
  line opens the goal screen, letting go of the hold early does not cancel,
  `pointercancel` resets the hold, a repeated `keydown` does not restart it,
  Escape keeps the goal, and home plays the celebration on every open while the goal is reached.
- **Visual e2e:** set a goal → goal line and 🔒 → reach it → celebration →
  withdraw → the goal is gone. A second run for cancelling.

## Delivery

Each PR merges on its own and leaves the app working.

0. **Method copy rename.** The `goal` → `purpose` rename below. Nothing
   visible; lands first so `goal` is free.
1. **Goals storage and rules.** The table (migrated on Neon `test` and
   `dev`), `GoalRepository` in all three backends, `StoreContents.goals` with
   `writeInitialStore` passing it through, `src/lib/goal` without the picture
   search, and the glossary additions. Nothing visible. **After it merges,
   migrate Neon `production`** (see Migration).
2. **API and the server lock.** Check `goals` exists in production before
   pushing. The set and cancel routes, the route params in
   `withAccountAccess`, the
   withdrawal rules, the goal on `AccountSummary`, `fetchJson`'s `DELETE` and
   status. `docs/the-method.md` and the backlog are updated: the "not yet
   enforced" line becomes "The withdrawal-only-at-goal rule is enforced on the
   server (`SavingsLockedError`) while a goal is active. With no active goal,
   savings is open, so families without a goal keep today's behaviour.", and
   the backlog's "Savings goal" data sketch (fields on `Wallet`) points here
   instead. Nothing visible: no screen can set a goal yet, and with no goal
   nothing locks.
3. **Showing a goal.** `ViewGoal`, `GoalProgress`, `MenuGoal`'s goal row, the
   🔒 on the savings card, the locked drawer states and the `409` refresh.
   Tested and screenshotted by seeding `goals: [mockGoal]` through the e2e
   driver; to see it locally, use a JSON store (`FUNSAVER_DATA_PATH`) holding
   a goal. There is no seed script for Neon `dev`.
4. **Setting and cancelling.** `SetGoal`, `GoalPictureSearch` with
   `picture-search.ts` and the generated Hebrew word list, the "set a goal"
   menu entry, `CancelGoal`. Users can create goals from here on, and every
   lock screen already exists.
5. **Celebration.** `Celebration`, the travelling border, the wobble, the bar
   shine.

PRs 3–5 carry screenshots (`pr-screenshots` skill).

## Glossary additions

| Concept | Hebrew UI | Code term | Not |
|---|---|---|---|
| What a child saves toward | יעד · יעד חיסכון | `goal`, `Goal`, `goalReached` | target, objective, wish |
| The goal's picture | תמונה | `picture`, `GoalPicture` | image, icon, thumbnail |
| How a goal ended | — | `ending`: `completed`, `cancelled`; values in `GOAL_ENDING`; type `GoalEnding` | status, result, outcome, done |
| Savings kept for a goal | שומרים עד היעד | `SavingsLockedError`, locked | frozen, blocked |
| A goal reached, shown | הגעת ליעד! | `Celebration` | confetti, party |

`goal` already names something else: the Method page's opening section,
`GOAL_COPY` in `src/components/Method/copy/goal.ts` and `METHOD_COPY.goal`.
PR 0 renames it to `PURPOSE_COPY` / `METHOD_COPY.purpose` and the file to
`copy/purpose.ts` (it also holds `BRIEF_COPY`, so `copy/index.ts` changes
too). `KEY_POINT_TEST_IDS` become
`{ point: 'method-key-point', note: 'method-key-point-note' }`, after the
component, since `KeyPoint` draws both the purpose's outcomes and the
promise's rules; `KeyPoint.test.tsx`'s `describe('a goal outcome')` becomes
`'a key point'`. `outcome` keeps its Method meaning, which is why a goal's
end is its `ending`.
