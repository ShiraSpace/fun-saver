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
npm run dev:mobile
```

Then open http://localhost:3000.

To see the seeded "daily interest" row exactly like the design mock, freeze the clock:

```bash
FUNSAVER_NOW=2026-01-01 npm run dev
```

---

## What's inside

| Layer          | Where                       | Notes                                                                                                  |
| -------------- | --------------------------- | ------------------------------------------------------------------------------------------------------ |
| UI             | `src/app`, `src/components` | Next.js 16 App Router, React 19, MUI + Emotion (RTL)                                                   |
| Business logic | `src/lib`                   | Framework-agnostic, unit-tested                                                                        |
| API routes     | `src/app/api`               | Thin — validate, call `src/lib`, return JSON                                                           |
| Persistence    | `src/db`                    | JSON file store by default; Neon Postgres when `DATABASE_URL` is set (see [Persistence](#persistence)) |
| Tests          | `*.test.ts(x)`, `e2e/`      | Jest + Puppeteer visual/e2e                                                                            |

---

## Common commands

| Command                   | What it does                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| `npm run dev`             | Start the dev server                                                                                   |
| `npm run dev:mobile`      | Dev server bound to `0.0.0.0`                                                                          |
| `npm test`                | Run unit tests — matches `*.test.ts` only, so the live-database suites never load                      |
| `npm run test:db`         | Run the `src/**/__tests__/*.e2e.ts` Postgres suites against the Neon `test` branch                      |
| `npm run test:e2e`        | Postgres suites, then the visual build, then the browser suites — needs `TEST_DATABASE_URL`             |
| `npm run lint`            | Lint and auto-fix                                                                                      |
| `npm run build`           | Production build                                                                                       |
| `npm run db:migrate`      | Apply `src/db/schema.sql` to the Neon `main` branch (uses `DATABASE_URL`)                              |
| `npm run db:migrate-dev`  | Apply the same schema to the Neon `dev` branch (uses `DEV_DATABASE_URL`)                               |
| `npm run db:migrate-test` | Apply the same schema to the Neon `test` branch (uses `TEST_DATABASE_URL`)                             |

---

## Key behaviours

- **Deposits** auto-split one amount **60% savings / 20% spending / 20% good deeds**.
- **Withdrawals** pick a single wallet and are **overdraft-protected**; a good-deeds withdrawal is framed as a donation.
- Money is stored as **integer agorot**; displayed rounded to the nearest half-shekel with a small `₪` glyph.
- Interest **compounds daily** on the savings wallet and is idempotent per day.

---

## Persistence

The app runs on a JSON file at `src/db/data.json` by default — zero setup, works on a fresh clone. Point it at a Neon Postgres branch by setting the appropriate env var in `.env.local`.

### `.env.local`

```env
# Optional. When set, the app uses Neon Postgres in production/next-start.
DATABASE_URL=

# Optional. When set and NODE_ENV=development (i.e. `next dev`), this wins
# over DATABASE_URL so local experiments stay off the production branch.
DEV_DATABASE_URL=

# Required by `npm run db:migrate-test`, `npm run test:db` and `npm run test:e2e`.
TEST_DATABASE_URL=
```

`.env.example` at the repo root has these keys ready to copy.

### Which store is used when

| Context                             | Store                                             |
| ----------------------------------- | ------------------------------------------------- |
| `FUNSAVER_DATA_PATH` set (e2e)      | JSON at the given path — always wins              |
| `NODE_ENV=development` (`next dev`) | Postgres via `DEV_DATABASE_URL` if set, else JSON |
| `next start` / Vercel               | Postgres via `DATABASE_URL` if set, else JSON     |
| Jest (`npm test`)                   | JSON (env not loaded)                             |
| `npm run test:db`                   | Postgres via `TEST_DATABASE_URL`                  |

### Applying the schema

`src/db/schema.sql` is the target schema. To apply it against any Neon branch:

```bash
npm run db:migrate          # → DATABASE_URL      (main / production)
npm run db:migrate-dev      # → DEV_DATABASE_URL  (local dev)
npm run db:migrate-test     # → TEST_DATABASE_URL (integration tests)
```

Each script runs the whole schema in a single Postgres transaction — a failure mid-way rolls the whole thing back rather than leaving half-applied DDL.

---

## Project docs

- [`AGENTS.md`](./AGENTS.md) — a warning that Next.js 16 has breaking changes vs. older docs.
- [`CLAUDE.md`](./CLAUDE.md) — workflow, code style, and TDD rules used when building this app.
- [`docs/HANDOFF.md`](./docs/HANDOFF.md) — full design decisions, rationale, and open questions.
