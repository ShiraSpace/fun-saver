# fun-saver

A playful, Hebrew-first money app for kids — because "just save it" doesn't teach anything, but watching your coins grow does.

## Why this exists

Most kids see money as a single number in a piggy bank. They can't see it grow, they can't feel the trade-off between spending now vs. saving for later, and giving usually happens outside their view. Grown-up banking apps aren't built for a seven-year-old, and paper-envelope systems don't compound.

**fun-saver splits every shekel into three wallets so the trade-off is visible every day:**

- 💰 **Savings** — earns real daily compounding interest, drawn as coins the kid can literally count.
- 🛒 **Spending** — the "yes, you can buy that" pot.
- 💛 **Good deeds** — tracks the running total of what the kid has donated, turning generosity into something they can be proud of.

Each family can have multiple accounts (one per child), each with its own theme so every kid gets their own little world.


<img width="350" height="682" alt="image" src="https://github.com/user-attachments/assets/e7904e24-7fcb-4470-9d78-fb96fe903d68" />
<img width="344" height="672" alt="image" src="https://github.com/user-attachments/assets/1c7edf24-4bf9-46de-85db-93f5cfcfbb24" />


## How it helps

- **Makes interest tangible.** A kid can see today's coins appear on the savings wallet, so "compound interest" stops being abstract.
- **Teaches the split by default.** Every deposit auto-splits 60/20/20, so saving and giving happen automatically instead of being an afterthought.
- **Protects them from mistakes.** Withdrawals are overdraft-protected — you can't spend money you don't have.
- **Celebrates giving.** The good-deeds wallet reframes withdrawals as donations and keeps a running total to be proud of.
- **Speaks their language.** Hebrew, RTL, mobile-first, and warm — not a beige banking form.

---

## Run it locally

```bash
git clone https://github.com/ShiraSpace/fun-saver.git
cd fun-saver
npm install
npm run dev
```

Then open http://localhost:3000.

To see the seeded "daily interest" row exactly like the design mock, freeze the clock:

```bash
FUNSAVER_NOW=2026-01-01 npm run dev
```

---

## What's inside

| Layer          | Where                       | Notes                                                |
| -------------- | --------------------------- | ---------------------------------------------------- |
| UI             | `src/app`, `src/components` | Next.js 16 App Router, React 19, MUI + Emotion (RTL) |
| Business logic | `src/lib`                   | Framework-agnostic, unit-tested                      |
| API routes     | `src/app/api`               | Thin — validate, call `src/lib`, return JSON         |
| Persistence    | `src/db`                    | JSON file store, seeded on first run                 |
| Tests          | `*.test.ts(x)`, `e2e/`      | Jest + Puppeteer visual/e2e                          |

---

## Common commands

| Command              | What it does                  |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start the dev server          |
| `npm run dev:mobile` | Dev server bound to `0.0.0.0` |
| `npm test`           | Run unit tests                |
| `npm run test:e2e`   | Run visual + e2e tests        |
| `npm run lint`       | Lint and auto-fix             |
| `npm run build`      | Production build              |

---

## Key behaviours

- **Deposits** auto-split one amount **60% savings / 20% spending / 20% good deeds**.
- **Withdrawals** pick a single wallet and are **overdraft-protected**; a good-deeds withdrawal is framed as a donation.
- Money is stored as **integer agorot**; displayed rounded to the nearest half-shekel with a small `₪` glyph.
- Interest **compounds daily** on the savings wallet and is idempotent per day.

---

## Project docs

- [`AGENTS.md`](./AGENTS.md) — a warning that Next.js 16 has breaking changes vs. older docs.
- [`CLAUDE.md`](./CLAUDE.md) — workflow, code style, and TDD rules used when building this app.
- [`docs/HANDOFF.md`](./docs/HANDOFF.md) — full design decisions, rationale, and open questions.
