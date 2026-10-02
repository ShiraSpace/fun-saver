# Child mode — design

> Status: **approved in brainstorming 2026-10-03**, spec awaiting review.
> Mockup: `mockups/child-mode.html`. Build screen **1 (savings hero)** and
> menus **2a** and **2b**. The "next feature" phone shows the saving goal and
> is **not** part of this design.
> Evidence: `docs/research/jar-method.md` §6. Roadmap: `docs/backlog.md` §6.

## Purpose

Feedback says the app has two audiences. The parent needs today's screens:
percentages, the balance chart, and transactions. A ~7-year-old needs a
simpler screen that answers three questions at a glance:

1. How much have I saved, and how much did it grow?
2. How much can I spend?
3. How much is there to give?

## Scope

**In:**
- A child view mode, saved on the account, that the parent turns on from the menu.
- A child home: savings first, then spending, then good deeds. Whole shekels,
  view only.
- A child menu: the child's picture and name, "הכסף שלי", the existing
  colours, and a switch back to parent mode.

**Out (deliberate):**
- **Saving goal.** It ships as its own feature, and its picture and progress
  bar go inside the savings card. The card is sized so they fit with no
  scrolling (checked in the mockup's "next feature" phone).
- **A parent gate.** Leaving child mode is a plain switch with no PIN. The
  research recommends a PIN; we decided against it for now. Add one if
  children keep switching back.
- **Child actions.** No deposits or withdrawals. The parent stays the bank.
- **A child login.** The mode is saved on the account, and the parent's
  login is still the only one.
- **Blocking parent routes.** `/transactions` and `/method` stay reachable by
  URL. The child menu just doesn't link to them.
- **Real-item comparisons** ("2 ice creams"). The evidence is thin.

## Research rules this design follows

| Rule | Source |
| --- | --- |
| Whole shekels, rounded down. No agorot. | Decimal money is taught at 8–9 (UK Year 4). Rounding down never shows money the child doesn't have. |
| Counts, no percentages, no rate, no chart | `jar-method.md` §6.1 |
| One screen, no scrolling | NN/g, children's usability |
| Targets ≥ 76px (≈2cm), icon plus word | NN/g physical development; Google Designed for Families |
| Not babyish: same theme and cards, just bigger and with less on screen | NN/g: 6-year-olds reject "baby" sites |

## How the view mode is stored

The mode is a column on the account, saved and read the way `theme_id` is.
There's no cookie: every page (`/`, `/transactions`, `/method`) already loads
the account rows on the server in `signedInAccounts()`, so the mode arrives in
the same `SELECT *` at no extra cost. The theme's cookie exists only because
the root layout paints colours before data loads, and view mode has no step
like that. Add a cookie only if something ever needs the mode before the data.

- **Type:** an enum-like constant, in the same shape as `APP_MODE`:

  ```ts
  export const APP_VIEW_MODE = {
    parent: 'parent',
    child: 'child',
  } as const;

  export type AppViewMode = (typeof APP_VIEW_MODE)[keyof typeof APP_VIEW_MODE];
  ```

  Every comparison, default and fallback in TypeScript uses
  `APP_VIEW_MODE.parent` or `APP_VIEW_MODE.child`, never a bare string. The
  only literal is the SQL column default, because SQL can't import it. Keep
  that default the same as `APP_VIEW_MODE.parent`. It follows the shape of `AppMode`
  (`src/components/AccountManagement/app-mode-context.ts`) but means
  something different: `AppMode` is viewing, creating or editing an account.
  The server, the store and the API all use `APP_VIEW_MODE`, so it lives in
  `src/lib/account/`, not in a component.
- **Database (persistent):** a new column on `accounts`,
  `view_mode TEXT NOT NULL DEFAULT 'parent'`. Add it to `schema.sql` with
  `ADD COLUMN IF NOT EXISTS` so a replay stays idempotent. It goes through
  the store the same way `theme_id` does.
- **API:** `PUT /api/accounts/[id]/view-mode` with `{ viewMode }`. It is
  thin (validate, call `src/lib`, return JSON), the same shape as
  `/api/accounts/[id]/theme`.
- **Server render:** `Account.viewMode` comes from the row, and
  `AccountSummary` extends `Account`, so `Home` and the menu read
  `currentAccount.viewMode` with no new prop. The first paint is already the
  right view, with no flash of the parent screen.
- **Switching:** the switch PUTs the new mode, then calls `router.refresh()`.
  If the save fails, it stays in the current view and shows an error, the
  same as `useAccountTheme`.
- **The mode belongs to the account.** Turning on child mode for Noa doesn't
  touch her sibling's account. The only login is the parent's, so the
  database can't tell devices apart. If the parent opens Noa's account on
  their own phone, they also see the child view and switch back from the
  child menu. In child mode the account picker is hidden, so the account
  can't change until the parent switches back.

## Child home (mockup 1)

`Home` renders a new child component instead of `Account` when the mode is
on. `Header` is reused unchanged: burger, child's name, avatar.

**Savings card (hero):**
- 🐷, "החיסכון שלך", and the balance in whole shekels as the largest number
  on screen.
- Two tiles under it:
  - **הפקדת ₪142**: what was put in.
  - **✨ הרוויח לבד +₪6**: interest earned since savings began.
- When the goal feature ships, both tiles count from the day the goal was set.

**Spending row:** 🛍️ "בזבוזים", "יש לך לבזבז", and the amount at 34px.

**Good deeds row:** 💛 "מעשים טובים", "לתת למישהו אחר", and the amount.

No `BalanceBreakdown` donut, no `PrimaryButton`, and no transaction drawer.
Nothing on the screen can be tapped except the menu.

### The numbers

All of these come from the existing `WalletSummary`, so no new queries are
needed.

| Shown | Computed |
| --- | --- |
| Wallet amount | `balance` in whole shekels, **rounded down** |
| ✨ earned | `interestEarned` in whole shekels, rounded down |
| הפקדת | savings amount minus earned. Never below 0; if it would be, earned becomes the whole savings amount. |

"הפקדת" is worked out by subtraction, so the two tiles always add up to the
big number. Rounding each tile down separately can come to ₪1 less than the
total. Example: ₪148.90 = ₪142.50 + ₪6.40, shown as ₪148 = ₪142 + ₪6.

Known caveat: `principal` is deposits minus withdrawals. The "no withdrawals
from savings before the goal" rule isn't enforced yet, so a parent's savings
withdrawal lowers "הפקדת". The goal feature enforces the rule.

`src/lib/money.ts` gets `floorToShekels(agorot)`, a round-down sibling of
`nearestHalfShekel` and `agorotToWholeShekels` (which rounds to nearest). The savings split is a pure function under
`src/lib/wallet/`.

**Right-to-left:** "+₪6" must render in an LTR island (`dir="ltr"` or
`<bdi>`). Otherwise it shows as "₪6+". The mockup caught this.

## Child menu (mockup 2a)

When the mode is on, `MenuContent` renders the child menu instead of the
parent one:
- The child's avatar (large) and name.
- **🏠 הכסף שלי**, a link to home, 76px tall.
- **🎨 צבעים**: the existing `AppearanceSection` with its three themes, which
  saves to the account as it does today.
- **👤 מצב הורה**: a small switch at the bottom that turns the mode off.

Not shown: `NavigationTabs`, user settings (sign out), account picker, edit
account, language.

## Parent menu (mockup 2b)

One new row in `MenuAccountSettings`, after the theme and language. The
block's note already says "נשמר על החשבון הזה בלבד" (saved on this account
only), which is exactly what the mode is: **🧒 מצב ילד**, "מסך פשוט ל<name>, רק לצפייה", and a
switch. Turning it on saves the mode, closes the menu and refreshes into
the child home.

## Naming (decided 2026-10-03)

Add these to `docs/glossary.md` in the same PR that introduces them:

| Concept | Hebrew UI | Code term | Not |
| --- | --- | --- | --- |
| Which screen the account is shown in | מצב ילד · מצב הורה | `AppViewMode` (`parent`, `child`), `APP_VIEW_MODE`, column `view_mode` | `AppMode`, which is viewing/creating/editing |
| Whole shekels, never more than there is | — | `floorToShekels` | rounding to nearest for a child |
| The savings tile "what was put in" | הפקדת | `principal` (existing term, UI label only changes) | `deposited`, which the glossary rejects |

## Errors and edge cases

- **No accounts:** child mode can't be turned on, because the switch lives in
  the account card. `EmptyState` renders as it does today.
- **An unknown `view_mode` value:** falls back to `APP_VIEW_MODE.parent`, the same way
  `resolveThemeId` falls back to the default theme.
- **No interest yet:** "✨ +₪0" is shown, so the layout never jumps.
- **A wallet under ₪1:** shows ₪0.
- **Save fails:** the view doesn't change, and the switch shows an error.

## Testing

- **Unit (`src/lib`):** `floorToShekels`, resolving an unknown view mode, and the savings split
  (including the rounding sum, zero interest, and "הפקדת" going negative).
- **API:** `view-mode` route, a valid mode, an invalid mode, and another
  user's account.
- **DB (`test:db`):** `view_mode` round-trips through the store, and defaults
  to `APP_VIEW_MODE.parent`.
- **Components:** the child home shows three amounts and nothing tappable;
  the child menu hides parent sections; the parent menu's switch saves the
  mode. Tests follow the house rules: one expect per `it`, `mock` prefix.
- **e2e:** an account stored in child mode opens straight into the child
  home, which proves the server reads it. Turn child mode on, reload and
  still be in child mode; there's no cookie, so only the database can
  explain that. Then turn it off from the child menu.
- **Child on a parent route by URL:** `/transactions` and `/method` load the
  account too, so their menu is the child menu.
- **Visual:** screenshots of the child home and child menu for the PR
  (`pr-screenshots` skill).
- **Type sizes come from `theme.typography`.** The savings number uses
  `display` (48) and the wallet amounts use `amount` (38), not the mockup's
  76/34. Add a token only if 48 reads too small on a device.
