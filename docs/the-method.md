# The Three Jars Method (Save, Spend, Share)

## Core Principle

Instead of putting allowance into a single wallet, the money is divided into three transparent jars. This visual approach helps children understand the different purposes of money and teaches basic financial management.

> **In the app:** each account owns three `Wallet` entries (`src/lib/types.ts` — `WalletName = 'savings' | 'spending' | 'goodDeeds'`). Wallets are siblings, not a single balance — matching the "separate jars" mental model.

## 1. The Spend Jar (Immediate Satisfaction)

- **Purpose:** For everyday, small purchases (e.g., snacks, small accessories).
- **The Lesson:** Grants financial independence and teaches the natural consequences of spending — once the money is gone, it's gone. It cannot be replenished from the Save jar.

> **In the app:** represented as the `spending` wallet. Transfers between wallets are not exposed — the "can't refill from Save" rule is enforced by the absence of a cross-wallet transfer transaction type (`TransactionType = 'deposit' | 'withdrawal' | 'interest'`).

## 2. The Save Jar (Long-Term Goals & Yield)

- **Purpose:** For larger, more expensive items that require delayed gratification.
- **Withdrawal Rule:** Money can only be withdrawn once the predetermined goal is fully reached.
- **Teaching Interest/Yield:** Parents can act as the "bank" and add a fixed percentage (e.g., 10%) to the remaining balance at the end of each month. This demonstrates how saved money can generate a return over time.

> **In the app:** represented as the `savings` wallet. Yield is modeled by `Wallet.monthlyInterestRate` and accrued via the `interest` transaction type; `lastInterestDate` tracks the last accrual so interest is idempotent per period (see `src/lib/interest/`). The withdrawal-only-at-goal rule is a product policy, not yet enforced in code — worth flagging on the roadmap.

## 3. The Share Jar (Giving Back)

- **Purpose:** Cultivates empathy, generosity, and community awareness.
- **Usage:** Used for donating to charity, buying birthday gifts for friends, or treating a pet.

> **In the app:** represented as the `goodDeeds` wallet. Behaves like `spending` mechanically (deposit/withdrawal, no interest), but is surfaced separately in the UI to reinforce the distinct purpose.

## Suggested Allocation (Example)

| Jar   | Share |
| ----- | ----- |
| Spend | 50%   |
| Save  | 40%   |
| Share | 10%   |

> **In the app:** allocation percentages are not currently a configured input — deposits are made per-wallet. If auto-split on allowance is added later, these defaults are the natural starting point.
