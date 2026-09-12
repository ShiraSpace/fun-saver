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
