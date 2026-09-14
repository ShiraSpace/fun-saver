# Backlog

Forward-looking ideas not yet scheduled. Add items freely; promote to `docs/plans/` when picked up.

## Product features

### Savings goal on the `savings` wallet

Let the user set a concrete goal on the savings wallet to make the "delayed gratification" mechanic tangible.

- **Data:** extend `Wallet` (or a `savings`-only sub-shape) with:
  - `goalAmount` — target in agorot (integer, same unit as `amount`).
  - `goalDescription` — short free text, e.g. `"bicycle"`, `"scooter"`.
  - `goalIcon` — emoji or icon id, using the same registry pattern as wallet `icon` / account `avatar`.
- **UI:** present the goal on the savings wallet card and in the account dashboard — target amount, description, icon, and progress toward the goal (e.g. progress bar). Requires design pass on the wallet card and possibly the drawer.
- **Related policy:** unlocks enforcement of the _"withdrawal only when goal reached"_ rule described in `docs/the-method.md` — currently unenforced in code. Consider whether the two should ship together or in sequence.

### Allow fractional amounts in the "new action" input

The deposit/withdrawal amount input currently accepts whole units only. Allow non-integer entries like `5.5` so the user can enter partial units without switching to agorot.

- **Storage:** amounts stay as integer agorot; the input parses `"5.5"` → `550` at submit time.
- **UI:** the numeric input should accept a decimal separator (both `.` and `,` — locale-dependent) with up to 2 decimal places.
- **Display:** amounts already rendered as major units should show the decimal when non-zero (e.g. `₪5.50`, but `₪5` when whole).
- **Validation:** reject more than 2 decimal places and negative values.

### Default wallet for withdrawals

When opening the withdraw action, preselect `spending` as the source wallet. Matches the Three Jars method — spending is the everyday jar, savings is protected by the goal rule, and goodDeeds is purpose-specific.

- **UI:** wallet selector defaults to `spending` on open; user can still change it.
- **Edge case:** if `spending` is missing or has 0 balance, fall back to the first wallet with a positive balance (or leave unselected — decide during design).

## Product policy — not yet enforced in code

- **Withdrawal-only-at-goal on `savings`** — see `docs/the-method.md`. Blocked on the savings-goal feature above.

## Open technical questions

- **`isActive` on `Account`** — currently always `true`. Confirm with another dev whether the field is load-bearing before removing (auto-memory: [[project-isactive-review]]).

## Revisit triggers from design decisions

- **Interest transaction granularity** — revisit if storage crosses ~250 MB, if we shorten the accrual period, or if we introduce a retention/archival policy. See `docs/design-decision/interest-transaction-granularity.md`.

---

# Roadmap — decided, not yet scheduled

Added 2026-09-14 alongside `docs/research/jar-method.md` and the method page.
These are committed intentions, not speculative ideas. Ordered by dependency.

## 1. Savings goal (confirmed — will be implemented)

Already specced above under "Savings goal on the `savings` wallet". Research
backing is in `docs/research/jar-method.md` §10. Additions to that spec that
come out of the research:

- **Progress must render as a bar/ring toward the target, never a bare
  balance** — Nunes & Drèze (2006): pre-filled progress nearly doubled goal
  completion (34% vs 19%).
- **Never show the bar at zero.** Seed it with whatever is already in the
  savings wallet when the goal is created (endowed progress effect).
- **Goal-lock on withdrawals** — the `withdrawal-only-at-goal` policy from
  `docs/the-method.md` ships with this. It is the commitment device (Laibson
  1997), not a restriction; copy should frame it as "a promise to yourself".
- **One goal at a time** at this age. Multiple concurrent goals is a later
  question, not a v1 requirement.

## 2. i18n + English copy

Today: `src/app/layout.tsx` hardcodes `lang="he" dir="rtl"`, and
`LanguageSection` is a **static stub** — it renders a HE/EN toggle that does
nothing (`src/components/Menu/LanguageSection/constants.ts`). Every user-facing
string is inline Hebrew.

Scope when picked up:

- Extract all strings into a message catalogue (`he`, `en`).
- Make `lang` / `dir` derive from the active locale — LTR must not break the
  RTL-first layouts (Emotion RTL cache is configured for RTL only today).
- Wire `LanguageSection` to actually switch locale and persist the choice.
- Number/currency formatting per locale (`₪` glyph placement differs in LTR).

**English copy is already written and parked** at
`docs/copy/method-page.en.md` so this task is wiring, not translating or
re-researching.

## 3. Configurable split presets

`DEPOSIT_SPLIT` is a module constant (`src/lib/constants.ts`) at 50/40/10.
There is **no evidence for any particular split** (research §1.4) — it is a
values choice, so it should be the family's.

- Move the split onto the account (per-child), defaulting to 50/40/10.
- Offer named presets rather than free-form sliders:
  - **מאוזן 50/40/10** (default)
  - **חוסך 40/50/10**
  - **נדיב 50/30/20**
  - **מתחילים 70/20/10** — for a first-time/younger child
- Validate: three integers summing to 100, none negative.
- Changing the split must **not** retroactively re-split past deposits.

## 4. Configurable, honest interest rate

`SAVINGS_MONTHLY_RATE = 0.15` — 15%/month, ≈435%/yr, doubling in ~5 months.
That is deliberate (a realistic rate is invisible to a 7-year-old) but it is
currently both hardcoded and unlabelled. See research §9.

- Make the rate **per account**, so it can be dialled down as the child ages.
- **Label it in the UI as the family's rate**, e.g. "הריבית של בנק המשפחה" —
  never present it as what a real bank pays.
- Consider a preset ladder tied to age (high and visible at 6–8, lower and
  more realistic at 12+).

## 5. Allowance schedule / standing order

The most load-bearing rule in the whole method is **pay on the same day, every
time** — Kidd, Palmeri & Aslin (2013): children whose adults broke promises
stopped waiting. Today every deposit is manual, so the app depends on the
parent remembering.

- A recurring allowance: amount + weekday, auto-deposited and auto-split.
- A reminder if it hasn't been paid.
- Surface a visible **streak** of on-time payments — aimed at the *parent*,
  not the child.

## 6. Parent/child roles

Currently one signed-in user per account tree. The method assumes two different
people with different powers: a parent who deposits and sets the rules, and a
child who views, spends and donates.

- Child view: no deposit, no settings, no rate; can withdraw from
  `spending`/`goodDeeds` and (once the goal is met) from `savings`.
- Parent view: everything.
- Blocked on deciding whether children get their own login or a device-level
  mode.

## 7. Method page itself

Parent-facing page explaining the rationale and the six rules to set. Copy is
in `docs/copy/method-page.he.md` (shipping, Hebrew) and
`docs/copy/method-page.en.md` (parked for i18n).

## Explicitly NOT doing

- **Transfers between wallets.** The partition *is* the intervention — Soman &
  Cheema (2011) found two sealed envelopes produced 72% more saving than one.
  `TransactionType` has no `transfer` member on purpose. If someone proposes
  adding one, point them at research §2.2.
- **Paying for chores inside the app.** Overjustification effect + Gneezy &
  Rustichini's "A Fine is a Price" — attaching money to family obligations
  crowds out the norm, and it doesn't come back. See research §7.3.
- **Punitive withdrawals** (a parent removing money as punishment). Directly
  destroys the reliability the method depends on.
