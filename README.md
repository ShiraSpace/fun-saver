# [App Name]

## How to run locally

1. Clone the repo
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open `http://localhost:3000`
> If the app requires API keys or secrets, copy `.env.example` to `.env.local` and fill in the values before running.

## Assumptions

- The account dashboard renders three wallets (savings hero + spending/good-deeds cards).
  Wallet figures are **derived from seeded transactions**; no interest-accrual engine yet
  (`todayInterest` comes from interest transactions dated `asOf`).
- The action drawer (`+ פעולה חדשה`) toggles between **deposit** (one amount auto-split 60/20/20
  across the pots) and **withdraw** (pick one pot, overdraft-protected; a good-deeds withdrawal is
  framed as a donation). Amounts are whole shekels; money is stored as integer agorot.
- A local `src/db/data.json` is seeded with one account + three wallets so `npm run dev`
  shows the dashboard. It is gitignored. To see the daily-interest coin row and "active since"
  exactly like the mock, run with the same clock as the seed:
  `FUNSAVER_NOW=2026-01-01 npm run dev`.

## What I'd improve with more time

- Seed the three default wallets when an account is created (currently owned by the
  create-account flow; the dashboard slice seeds wallets directly for now).
- Add the real daily-interest accrual engine so savings grows over time.
- Style the dashboard to full mock fidelity (driven by the visual E2E).