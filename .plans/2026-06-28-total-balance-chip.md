# Total balance chip (ribbon)

Show the sum of all wallet balances as a small chip in the header ribbon,
between the title and the avatar.

Mockup: `docs/superpowers/specs/mockup-total-balance.html` (chip style B + label).
Total = savings + spending + goodDeeds, in agorot, rendered as ₪.

## Phase 0 — branch (done)

Worktree `~/Projects/technotronic/fun-saver-total-balance` on `feat/total-balance-chip`
off `origin/main`. Mockup + plan carried over; node_modules symlinked.

## Phase 1 — logic

`src/lib/derivations.ts`: add

```ts
export function totalBalance(wallets: Pick<WalletWithDerived, 'balance'>[]): number {
  return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
}
```

Pure, sums already-derived balances. Unit-tested in `src/lib/__tests__/derivations.test.ts`.

## Phase 2 — promote Money to shared

Move `src/components/Account/Money/` → `src/components/Money/` (Money.tsx, Money.test.tsx,
constants.ts) and add `index.ts` named re-export. Update the 5 consumers on this branch to
import from `@/components/Money`:

- `WalletCard`, `WalletHero/HeroAmount`, `WalletHero/HeroBreakdown`,
  `TransactionDrawer/DepositSplit`, `TransactionDrawer/DepositAmount`.

Caveat: `feat/withdraw-action` imports `Money` via the old `../../Money/Money` path — the
second of the two branches to merge will need a one-line import fixup.

## Phase 3 — TotalChip component

`src/components/Header/TotalChip/` — `TotalChip.tsx`, `constants.ts`, `index.ts`, test.

- Props: `totalBalance: number` (agorot).
- Renders stacked label `סך הכל` above `<Money amountAgorot={totalBalance} />`.
- Styling tokens (tinted bg `#F3E9FA`, border `#D9BEEA`, text `#6B2C8E`) → map to theme
  tokens where they exist, otherwise add to `TotalChip/constants.ts`.

## Phase 4 — wire into Header + Account

- `Header`: add `totalBalance: number` prop; render `<TotalChip>` between `<Title>` and
  `<HeaderAvatar>`. Update `Header.test.tsx` render call (only existing caller besides Account).
- `Account.tsx`: `const total = totalBalance(wallets);` pass `totalBalance={total}` to `<Header>`.

## Notes / risks

- Ribbon becomes a 4-item flex row → long account names ellipsis sooner. Acceptable per
  mockup; chip is `flex-shrink:0`, title shrinks.
- e2e visual snapshots (`e2e/dashboard.visual.ts`) will change → update baselines.
