# Saving goal — design

> Status: **approved in brainstorming 2026-10-03, revised after review the same
> day**, not yet implemented.
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
- The goal screen, the home strip, the menu entry.
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
- **Hiding set and cancel from viewers.** The page does not know the signed-in
  user's role today; the menu's edit button is shown to viewers too and the
  server refuses them. Goals follow the same rule.

## Decisions

| Question | Decision |
|---|---|
| Where the goal shows on home | One line at the bottom of the savings `WalletCard` (mockup 4a). Not a separate card. |
| Progress text | Amounts only, `₪85 / ₪300` and `מתוך ₪300`. Never a percentage. |
| Progress bar at ₪0 | Drawn with a minimum visible sliver, never empty (endowed progress, backlog Roadmap § 1). |
| When the goal is reached | Celebration, savings unlocks, and the **next savings withdrawal of any size** ends the goal as `completed`. The drawer says so before the child confirms (5c). |
| Savings with no active goal | Unlocked, as today. The rule is "locked until the goal", so with no goal there is nothing to wait for. |
| A goal at or below what is already saved | Allowed. It shows as reached at once. |
| Lock copy | Framed as a promise, not a ban (backlog Roadmap § 1, Laibson 1997): `🔒 שומרים עד היעד` on the badge and the disabled drawer button, `🔒 החיסכון שמור ליעד „…”` in the drawer, and on `SetGoal` "מרגע שקובעים יעד, שומרים את קופת החיסכון עד שיש בה ₪…". Never `אי אפשר` / `נעול` in UI copy. |
| The lock icon | 🔒 only while savings is locked. Once reached there is no lock at all, not a 🔓. |
| Editable | No. Cancellable only, from the menu only, with a 2-second press-and-hold. |
| Picture source in v1 | Image search over a generated Hebrew emoji word list. |
| Storage | A `goals` table, one row per goal ever set, kept after it ends. |
| Endings | `completed` or `cancelled`. Reached-then-cancelled is `cancelled`. |
| Which withdrawal ended a goal | Not stored as a column. The goal's `ended_at` is set to that withdrawal's `created_at`, so the two match exactly. |

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
  outcome    TEXT CHECK (outcome IN ('completed', 'cancelled')),
  CHECK ((ended_at IS NULL) = (outcome IS NULL))
);

CREATE UNIQUE INDEX IF NOT EXISTS goals_one_active_per_account_idx
  ON goals(account_id) WHERE ended_at IS NULL;
```

- There is no `wallet_id`. A goal is always on the account's `savings` wallet,
  found by `walletName`; goals on other wallets are out of scope.
- `amount` is agorot, like every amount in the app.
- `picture` is `{ "kind": "emoji", "emoji": "🚲" }` in v1. Photos later become
  `{ "kind": "photo", "url": "…" }`, so goals saved in v1 keep working without
  a data migration. This is the only part of the design shaped for a later
  version.
- `started_at` and `ended_at` are ISO timestamps, stored as `TEXT` like
  `created_at` in `schema.sql`.
- The **active goal** is the account's row with no `ended_at`. The partial
  unique index makes a second active goal impossible, even from a double tap
  or two parents at once. The `CHECK` keeps `ended_at` and `outcome` set or
  unset together.
- Rows are never deleted while the account exists. A finished goal is history.
- **Reached is never stored.** It is `savings balance ≥ goal amount`, worked out
  each time, so it cannot disagree with the balance.
- The migration is the block above, appended to `src/db/schema.sql`, which is
  idempotent and safe to replay. It runs on the Neon `production` branch
  **before PR 2 deploys** — from PR 2 every savings withdrawal reads `goals`.

### Types

`src/lib/goal/types.ts`, with the outcomes as an `as const` map like
`TRANSACTION_TYPE`:

```ts
export const GOAL_OUTCOME = {
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

export type GoalOutcome = (typeof GOAL_OUTCOME)[keyof typeof GOAL_OUTCOME];

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
  outcome?: GoalOutcome;
}
```

The page receives each account's active goal alongside its wallets, as
`AccountSummary.goal?: Goal`.

## Rules

1. **One active goal per child, and only on savings.** Setting a goal while one
   is active is refused. All three stores enforce it the same way: Postgres by
   the unique index, the memory and JSON stores by checking before insert.
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
   matches nothing.
6. **Only an account editor** can set or cancel a goal, through the same
   `withAccountEditor` check that guards account edits today.
7. **The balance the lock uses** is the stored savings balance, the same one
   the overdraft check uses. The screen shows the same stored balance, settled
   on page load, and between page loads a savings balance only falls by a
   withdrawal, which ends a reached goal. So the screen never shows a goal as
   reached that the server would refuse.

A valid goal has:
- a name of 1–`MAX_GOAL_NAME_LENGTH` (30) characters after trimming;
- an amount of whole shekels from 1 to `MAX_GOAL_SHEKELS` (100,000), which
  keeps the agorot far below the `INTEGER` limit;
- a picture of exactly `{ kind: 'emoji', emoji }`, where `emoji` is at most 32
  UTF-16 units and matches `\p{Extended_Pictographic}`;
- no other fields.

## Server

### Logic — `src/lib/goal/`

- `goal-input.ts`: `validGoal(body)`, mirroring `validAccountEdits`.
- `goal-reached.ts`: `goalReached(goal, balance)`.
- `goals.ts`: `setGoal` and `cancelGoal`.
- `errors.ts`: `SavingsLockedError`, thrown like `OverdraftError`;
  `GoalAlreadyActiveError`; `GoalNotActiveError`.
- `constants.ts`: `MAX_GOAL_NAME_LENGTH`, `MAX_GOAL_SHEKELS`, `GOAL_OUTCOME`.

`addWithdrawal` in `src/lib/transaction/transactions.ts` gains the goal check
when the wallet's `name` is `savings`:

- active goal, not reached → throw `SavingsLockedError`;
- active goal, reached → `store.insertWithdrawalCompletingGoal(withdrawal,
  goal.id)`;
- no active goal → unchanged.

### Store

A `GoalRepository` beside the other repositories in `data-store.ts`, in all
three backends (`postgres-store`, `memory-store`, `json-file-store`):

- `insert(goal)` — throws `GoalAlreadyActiveError` when the account has one.
  Postgres maps the unique violation (`23505`) to it, the way
  `accountWriteError` maps account writes.
- `activeForAccount(accountId)`
- `end({ goalId, accountId, endedAt, outcome })` — returns whether a goal was
  ended (rule 5).

`DataStore` gains the matching methods, plus
`insertWithdrawalCompletingGoal(withdrawal, goalId)`:

- **Postgres:** one `sql.transaction([...])` holding the `INSERT` into
  `transactions` and the rule-5 `UPDATE` on `goals`, the way
  `insertAccountWithOwner` does today. Neon's HTTP transaction is a batch and
  cannot branch on a read, so every condition lives in the `WHERE` clause.
- **JSON file:** both changes inside one `FileSession.write`, saved once.
- **Memory:** both changes in one synchronous step.

`StoreContents` gains `goals`, and `FileSession`'s `emptyContents` gains
`goals: []`, so store files written before this feature read as having none.

### Loading the goal for the page

`settleAccountInterest` is the path home, `/transactions` and `/method` share,
and all three draw the menu that shows the goal. It reads the active goal in
parallel with the account's transactions (`Promise.all`) and puts it on the
`AccountSummary`. No extra round trip in sequence.

### API

Same shape as the sibling routes, behind `withAccountEditor`. New messages go
in `src/app/api/constants.ts`.

| Route | Does | Refuses |
|---|---|---|
| `POST /api/accounts/[id]/goal` | sets a goal, returns it | 400 invalid input; 409 a goal is already active |
| `DELETE /api/accounts/[id]/goal?goalId=…` | cancels that goal | 400 no `goalId`; 409 it is not this account's active goal |
| `POST /api/accounts/[id]/withdrawals` | unchanged, plus rule 2 | 400 `SavingsLockedError`, like `OverdraftError` |

`POST`, not `PUT`: setting is not idempotent, a repeat is refused. `DELETE`
carries the goal id the dialog showed, so a stale screen cannot cancel a goal
it never displayed (rule 5).

## Image search, v1

- **Source:** Unicode CLDR emoji annotations in Hebrew, `annotations/he` and
  `annotationsDerived/he` from a pinned CLDR release, Unicode-3.0 licence.
  Checked: אופניים → 🚲🚴🚵, שמלה → 👗, קורקינט → 🛴, גיטרה → 🎸,
  אוזניות → 🎧, כלב → 🐶🐕.
- **Generated, not installed.** `scripts/emoji-words.ts` reads the pinned
  release once and writes `src/lib/goal/emoji-words.he.json`, committed with
  the CLDR licence notice beside it. No runtime or package dependency, so the
  `~/.npmrc` lockfile trap does not apply.
- **Trimmed while generating:** skin-tone and other variants are dropped, so
  one bicycle does not fill the 3×3 grid five times; emoji newer than
  Emoji 14.0 are dropped, since older phones draw them as empty boxes and a
  goal picture is stored for good. Only each emoji and its Hebrew words are
  kept — about 1.3 MB raw, a fraction of that trimmed.
- **Loaded with `import()` when the sheet opens**, never with the app.
- **Search runs on the phone.** No server call. An emoji matches when one of
  its Hebrew words appears inside a typed word, so "האופניים" finds
  "אופניים". Results are ranked by how many typed words matched.
- The sheet opens already searching for the goal name. Editing the text
  searches again.
- Results are drawn as picture tiles, the same tiles Pixabay photos will fill
  later. Nothing in the sheet says "emoji".
- Without a chosen picture the goal shows 🎯.

## Screens

Mockup frame numbers in brackets.

### Opening and closing

`APP_MODE` gains `settingGoal` and `viewingGoal` beside `editingAccount`.
Closing either returns to home. After a goal is set or cancelled, the page
calls `router.refresh()`, the way the theme change does. A 409 also refreshes,
since it means the screen was stale.

### New components — `src/components/Goal/`

| Component | Frames | What it is |
|---|---|---|
| `SetGoal` | 1a | Name, picture, amount, the lock note, **קובעים יעד** and **ביטול**. Same title, ✕ and buttons as `AccountForm`, reusing its `CancelButton`. The button is disabled until there is a name and an amount. Upload and link are disabled with a בקרוב tag. |
| `GoalPictureSearch` | 1b | The search sheet: search box, 3×3 picture tiles, a ✓ on the chosen one, **בחירה**. |
| `GoalProgress` | 2, 2b | Picture, name, bar, `₪85 נחסכו` / `מתוך ₪300`, the "עוד ₪215 ומגיעים!" line, the `🔒 שומרים עד היעד` badge and **חזרה**. Reached: the `הגעת ליעד!` heading, gold glow, full bar, "כל הכבוד! אפשר לקנות את …", badge without a lock. |
| `GoalStrip` | 4a, 4b | One line at the bottom of the savings `WalletCard`. Tapping opens `viewingGoal`. Reached: green, `🎉 הגעת ליעד!`. |
| `Confetti` | 2b, 4b | Falls for about 10 seconds, then fades. Plays every time home or the goal screen opens while the goal is reached. Drawn above the cards, the celebrating savings card included, with `pointer-events: none`. Off under `prefers-reduced-motion`. |
| `MenuGoal` | 3a, 3b | In `AccountControls`, between `AccountPicker` and `EditAccountButton`. The goal row with a thin bar and `₪85 / ₪300`, with a small **ביטול היעד** link under it, or **🎯 קביעת יעד חיסכון +** when there is no goal. |
| `CancelGoal` | 3c | Dialog: picture, `לבטל את היעד „…”?`, how much was saved, that the money stays and savings unlocks. **משאירים את היעד** is the primary button and has focus. The red **לחיצה ארוכה לביטול היעד** fills over 2 seconds of holding and resets on release, `pointercancel` or leaving the button. Holding Space or Enter works the same. The button suppresses the long-press context menu and text selection (`contextmenu`, `user-select`, `-webkit-touch-callout`), and its label tells screen readers to hold for 2 seconds. |

### Changes to existing components

- **`WalletCard`, savings.** Active goal: 🔒 on the amount, and the `GoalStrip`
  under the interest stats. Reached, for the same 10 seconds as the confetti:
  a white-gold-pink-purple border travels around the card with a soft glow,
  🐷 and the goal picture wobble, a shine runs along the full bar. The card does
  not move or scale. Afterwards it keeps a plain gold outline until the goal
  ends. Motion is off under `prefers-reduced-motion`; the outline stays.
- **`WalletPicker` / `WithdrawalForm`.** Locked: savings is greyed with a 🔒
  and `עוד ₪215 ליעד` (5a). It is already never the default wallet
  (`feat/default-withdrawal-wallet`). Tapping it swaps the keypad for the goal,
  `🔒 החיסכון שמור ליעד „…”` and the bar, and disables the button as `🔒 שומרים עד היעד` (5b).
  `use-withdrawal-form` treats a locked savings wallet like an overdraft:
  `canSubmit` is false. Reached: savings looks like any wallet, and a green
  line reads `🎉 משיכה מהחיסכון תסיים את היעד „…”` (5c). A 400 from the
  server shows its message like an overdraft does.

All text goes in each component's `constants.ts`. Colours come from the theme:
the reached green is `gainText` / `gainSoftBg`. The confetti and border colours
become new theme values, one set per theme.

## Testing

- **Logic:** `validGoal` at every boundary (name 0/1/30/31 after trimming,
  amount 0/1/100,000/100,001 and non-whole, extra fields, a non-emoji
  picture); `goalReached` at `balance = amount − 1` and `= amount`; a locked
  withdrawal is refused; a reached withdrawal ends the goal as `completed` with
  `ended_at` equal to the withdrawal's `created_at`; spending and good-deeds
  withdrawals ignore the goal; deposits are unaffected; cancelling ends it as
  `cancelled`.
- **Stores (memory and JSON, `npm test`):** a second active goal is refused;
  `end` with another account's id or an ended goal ends nothing; an old store
  file without `goals` reads as none.
- **Database (`test:db`):** the index refuses a second active goal and it
  surfaces as `GoalAlreadyActiveError`; the `CHECK`s refuse `amount = 0` and
  an `outcome` without `ended_at`; `end` fills `ended_at` and `outcome`;
  withdraw-and-end with a withdrawal id that already exists leaves the goal
  active — neither write behind.
- **Routes:** another user's account is refused; a second goal gets 409;
  cancelling with a stale or foreign `goalId` gets 409; a locked withdrawal
  gets its message.
- **Components:** one test file per new component. For example, savings is
  greyed in the drawer, the strip opens the goal screen, letting go of the hold
  early does not cancel, `pointercancel` resets the hold.
- **Visual e2e:** set a goal → strip and 🔒 → reach it → celebration →
  withdraw → the goal is gone. A second run for cancelling.

## Delivery

Each PR merges on its own and leaves the app working.

1. **Goals storage and rules.** The table, `GoalRepository` in all three
   backends, `src/lib/goal`, the glossary additions, and the Method copy
   rename below. Nothing visible.
2. **API and the server lock.** Run the migration on Neon `production` first.
   The set and cancel routes, the withdrawal rules, the goal on
   `AccountSummary`. `docs/the-method.md` and the backlog's "not yet enforced"
   lines are updated. Nothing visible: no screen can set a goal yet.
3. **Showing a goal.** `GoalProgress`, `GoalStrip`, the menu row, the 🔒 on
   the savings card, the locked drawer states. Testable with seeded goals.
4. **Setting and cancelling.** `SetGoal`, `GoalPictureSearch` with the
   generated Hebrew word list, the "set a goal" menu entry, `CancelGoal`. Users
   can create goals from here on, and every lock screen already exists.
5. **Celebration.** `Confetti`, the travelling border, the wobble, the bar
   shine.

PRs 3–5 carry screenshots (`pr-screenshots` skill).

## Glossary additions

| Concept | Hebrew UI | Code term | Not |
|---|---|---|---|
| What a child saves toward | יעד · יעד חיסכון | `goal`, `Goal`, `goalReached` | target, objective, wish |
| The goal's picture | תמונה | `picture`, `GoalPicture` | image, icon, thumbnail |
| How a goal ended | — | `outcome`: `completed`, `cancelled`; values in `GOAL_OUTCOME` | status, result, done |
| Savings kept for a goal | שומרים עד היעד | `SavingsLockedError`, locked | frozen, blocked |

`goal` already names something else: the Method page's opening section,
`GOAL_COPY` in `src/components/Method/copy/goal.ts` and `METHOD_COPY.goal`.
PR 1 renames it to `PURPOSE_COPY` / `METHOD_COPY.purpose`, the file to
`copy/purpose.ts`, and the `method-goal-outcome*` test ids in `KeyPoint` to
`method-purpose-outcome*`, so `goal` means one thing.
