# Tapping the piggy bank wiggles it

Child mode: tapping the piggy bank plays the same wiggle then breathe a landing coin gets.

## Reuse

- `wiggleThenBreathe` (`PiggyBank/piggy-bank-motion.ts`): reduced motion and `canAnimate()` already handled.
- `piggyBankElement` ref held by `useCoinsIntoThePiggyBank`.

## Changes (one PR)

1. `use-coins-into-the-piggy-bank.ts` returns `onPiggyBankTap`.
2. `PiggyBankAndCoins.tsx` passes it as `onClick` to `PiggyBank`.
3. `PiggyBank.tsx` takes an optional `onClick` onto `PiggyBankDrawing`; `cursor: pointer` in its styles.
4. Glossary: tapping the piggy bank → `onPiggyBankTap`.

## Tests

`PiggyBankAndCoins.test.tsx` with `captureAnimations` / `animationsOn`: a tap wiggles, then breathes.

## Skipped

- Ignoring taps during a running wiggle; add if overlap looks wrong on a phone.

## Progress

- [ ] Production code
- [ ] Tests
- [ ] PR with screenshots
