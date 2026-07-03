# Compact, swipe-to-close transaction drawer

## Why

The transaction drawer grows to ~full screen on short phones (nothing caps its
height) and can only be dismissed by tapping the scrim or the back button —
even though it shows a drag handle. Make it shorter and let the handle dismiss
it with a downward swipe.

## Decisions

- Swipe lives on the **Handle** only (the drag symbol) — no conflict with
  keypad taps or body scroll.
- Custom pointer events, **no new dependency**.
- Height: shrink the chunky elements + add a hard `max-height` cap with the body
  scrolling, rather than clipping content.

## Phase 1 — Shrink the drawer (CSS + constants, no swipe)

Production code only, then tests, then commit.

| Knob | Now → Proposed | File |
|---|---|---|
| Amount font | `48 → 38px` (new local `amountFontSize` constant, NOT the global `display` token) | `DepositAmount.tsx`, `WithdrawBody.tsx` |
| Keypad `keyPaddingY` | `9 → 6` | `AmountPad/constants.ts` |
| Keypad key font | `title:22 → 20` (local `keyFontSize`) | `AmountPad/constants.ts` + `AmountPad.tsx` |
| Keypad `gap` | `6 → 5` | `AmountPad/constants.ts` |
| `editPaddingY` | `7 → 6` | `AmountPad/constants.ts` |
| Mode `Pill` padding | `9 → 7` | `ModeToggle.tsx` |
| Sheet/Body `gap` | `10 → 8` | `TransactionDrawer.tsx` constants |
| Sheet padding | `10/18/18 → 8/16/14` | `TransactionDrawer.tsx` |
| **Sheet** | add `max-height: 85svh`; make `Body` scroll (`overflow-y: auto`), keep Handle + ModeToggle pinned | `TransactionDrawer.tsx` |

All hard-coded numbers go in the relevant `constants.ts`, per code standards.
Numbers are a starting point — tune in the browser.

### Phase 1 tests
- Existing drawer/body tests still green.
- (If warranted) a test asserting the sheet has a max-height cap — TBD, one at a time.

## Phase 2 — Swipe-to-close on the handle

Production code only, then tests, then commit.

- New co-located hook `use-swipe-to-close.ts` (mirrors `use-close-on-back.ts`,
  ~40 lines). Returns pointer handlers + current translateY.
  - `pointerdown` on handle → capture pointer, record start Y.
  - `pointermove` → `dy = max(0, currentY - startY)` → expose as translateY.
  - `pointerup` → if `dy > closeThreshold` (~100px) call `onClose()`, else reset
    to 0 with a snap-back transition.
- `TransactionDrawer` applies `transform: translateY(dy)` to the Sheet and wires
  handlers onto the Handle. Threshold + snap timing in drawer `constants.ts`.

### Phase 2 tests
- Drag past threshold → `onClose` called.
- Drag below threshold → `onClose` NOT called (snaps back).
- One test at a time.

## Out of scope
- No gesture library.
- No changes to scrim-click / back-button close paths.
- Total-balance-chip work (left untouched in the main checkout).
