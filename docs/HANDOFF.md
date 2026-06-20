# fun-saver — Developer Handoff

> Snapshot of every decision, dilemma, and piece of context that lives **only in
> chat history** and is not yet in committed code or in a committed spec file.
> Pair this with `CLAUDE.md`, `AGENTS.md`, and
> `docs/superpowers/specs/visual-palettes.md` to get the full picture.
>
> Last updated: 2026-06-20 · Source: prior `.claude/HANDOVER.md` + brainstorm
> transcript artifacts under `.superpowers/brainstorm/2021-1781720627/content/`.

---

## 0. TL;DR for someone walking in cold

- Product: a Hebrew/RTL mobile-first web app that helps parents teach kids
  about money via **three "pots"** (savings, spending, good deeds). Savings
  earns interest. Coins visualise the daily interest.
- Status: **no application code written yet**. Only an `app-skeleton`
  initial commit, plus design artifacts. We are mid-design-brainstorm —
  Section 1 of 6 done, awaiting approval.
- Stack as installed: **Next.js 16 (App Router) + React 19 + TypeScript +
  Tailwind v4 + Jest**. No MUI installed despite docs mentioning
  `theme.spacing(...)`. See [§8 — Open dilemmas](#8-open-dilemmas-flag-before-coding).
- Architecture chosen: **API-first** (`src/lib` → `src/app/api/*/route.ts`
  → React Query client). Not Server Actions.
- Next action when you sit down: re-present Section 1 (Domain Model + Store
  interface) to the user for approval, then advance through sections 2–6,
  write the spec, then run writing-plans.

---

## 1. Where we are in the process

The full pipeline:

1. **Brainstorm** (`superpowers:brainstorming` skill) — produce the design.
2. **Write spec** at `docs/superpowers/specs/2026-06-17-fun-saver-design.md`.
3. **Self-review** + user review of the spec.
4. **Implementation plan** via `superpowers:writing-plans` skill, output
   to `docs/plans/…`.
5. **Build**, TDD per CLAUDE.md, one feature at a time.

We are **mid-step 1**. The brainstorm was structured into **6 sections**:

| #   | Section                                 | Status                                                  |
| --- | --------------------------------------- | ------------------------------------------------------- |
| 1   | Domain Model + Store interface          | Presented in chat, **awaiting "looks right?" approval** |
| 2   | API surface (routes, schemas, errors)   | Not started                                             |
| 3   | Frontend architecture (RQ keys, routes) | Not started                                             |
| 4   | Interest math + display rules           | Partially decided (see §3)                              |
| 5   | Testing strategy (lib vs API vs UI)     | Not started                                             |
| 6   | Migration / persistence path            | Not started                                             |

Neither the spec file nor the implementation plan exists yet.

---

## 2. Locked-in product decisions (do NOT re-debate)

### 2.1 The "three pots" data model

Per child the app tracks three pots:

- `חיסכון` / savings
- `בזבוזים` / spending
- `מעשים טובים` / good_deeds

This shape was chosen after considering three alternatives that the user
saw side-by-side in `wallet-structure.html`:

- **A. Single balance with a "locked-in-savings" portion** — one number,
  with a marker for the part that earns interest. Rejected: too abstract
  for a child.
- **B. Two separate wallets (spending + savings)** — closest to what was
  chosen but extended to three.
- **C. Many named goal-pots (doll, bike, …)** — each accruing interest
  separately. Rejected: too complex for MVP.

The chosen model is essentially **B extended with a third "good deeds" pot**.

### 2.2 Multi-child

The product is per-child (mockup uses "החשבון של נועה" — Noa's account).
The user has more than one daughter, so multi-child support is in scope
for the data model, even if MVP renders one at a time.

### 2.3 Interest rules

- **Only `savings` accrues interest** in the MVP. `spending` and
  `good_deeds` have a rate of **0%**.
- The data model should **preserve the capability** for any pot to have
  a non-zero rate — keep the field on every pot, just default to 0. The
  brainstorm transcript was explicit:
  > "המודל שמר את היכולת אבל הברירת-מחדל היא 0%."
  > _The model preserved the capability but the default is 0%._
- Mockup iterations floated concrete rates of **15%/month** (savings),
  10%/month (good_deeds), 3%/month (spending). These were
  **illustrative**, not chosen — only the savings rate matters for MVP
  and its actual value is still open (see §4).
- **For `good_deeds` the UI shows "donated to date: X ₪"** computed from
  all outflows from that pot, instead of an interest rate. From the
  brainstorm transcript:
  > "במעשים טובים: במקום אחוז ריבית — 'תרמת עד היום: 12 ₪', מחושב מכל
  > ההוצאות מאותה קופה."

### 2.4 Storage precision

Store **exact numbers** (e.g. `80.4017`) for deposits, accrued interest,
and every operation. **Round only at display time.** From the transcript:

> "אחסון: מספרים מדויקים (למשל 80.4017) — לפקדונות, ריבית, וכל פעולה."

### 2.5 Money display

- All displayed amounts are rounded to the **nearest half-shekel**.
- `₪` symbol sits at the **lower-left** of the number (40% size, opacity
  0.65, `top:0.35em`, `direction:ltr` on the wrapper). See
  `visual-palettes.md` for exact CSS.
- "Principal vs interest" — there is a UI concept of showing the net
  deposits separately from the interest gains (transcript example:
  "₪75.00 = סך כל מה שנועה הפקידה לחיסכון בפועל" alongside
  "+₪5.40 = הסכום שצמח רק מהריבית"). Not yet placed in the IA, but the
  data must support it.

### 2.6 Coin visualisation (daily-interest row)

- **One coin design only** — silver radial gradient with centered `₪`.
  - Two forms: **full disc** and **D-shaped half** (path
    `M 50 4 A 46 46 0 0 1 50 96 L 50 4 Z`, darker strip on flat side).
  - **No "½" text drawn on the coin** — the shape carries the meaning.
- An earlier iteration explored **two coin colors** (silver 1₪ + gold ½₪)
  but this was **rejected** in favor of the single-design rule above.
- Display rule:
  1. Round the actual daily interest to the nearest half-shekel.
  2. Render `floor(amount)` full coins + 1 half coin if `amount % 1 === 0.5`.
  3. **If rounded value is 0, hide the daily row entirely** for that day.
  4. Up to **5–6 coins are drawn individually**. Beyond that, fall back
     to a compact notation like `[1 ₪ × 12]` next to a single coin. From
     the transcript:
     > "עד 5–6 מטבעות מציירים אחד-אחד. מעבר לזה (למשל ריבית יומית של
     > 12 ₪) נציג את הזרז: [1 ₪ × 12] או נקדם ל-'תצוגה מקוצרת'."

### 2.7 Visual identity

- Chosen palette: **"Sunshine Quest"** (Palette C in `visual-palettes.md`).
  - Primary CTA: `#6B2C8E` (purple pill on warm gradient background).
- Three visual directions were considered in `visual-style.html`:
  - A. "Playful Stickers" 🎈 — warm colors, emoji per pot, button shadows.
  - B. "Soft Pastel" 🌸 — softer, more grown-up palette.
  - C. "Game / Quest" 🎮 — RPG aesthetic, treasure/loot framing.
  - **Sunshine Quest** is essentially A refined with the warm gradient
    background sampled from `public/inspiration/Screenshot 2026-06-17 at 22.17.06.png`.
- Reference mockup: `docs/superpowers/specs/mockup-home-screen.html`
  — this is **v8 / final** of an iteration v3 → v8. Earlier versions live
  in `.superpowers/brainstorm/2021-1781720627/content/` and are **not
  authoritative** (interesting if you want to see the evolution).

### 2.8 Micro-interaction

The brainstorm noted a "small special detail":

> "פעימה עדינה של היתרה פעם ביום כשהריבית מתווספת (Fade + keyframes)"

A gentle once-a-day balance pulse when interest is added. Note this was
written assuming MUI's `Fade` — see [§8 dilemma](#8-open-dilemmas-flag-before-coding).

### 2.9 Language

- **Product UI is Hebrew (RTL)** — mockup uses `dir="rtl" lang="he"`.
- **Conversation with Claude is in English** — the user switched mid-session
  on 2026-06-17. Continue in English unless redirected.

---

## 3. Locked-in technical decisions

### 3.1 Architecture: API-first

- Business logic in `src/lib/` (framework-agnostic, unit-tested).
- Exposed via `src/app/api/*/route.ts` handlers — thin: validate input →
  call a `src/lib` function → return JSON.
- Client talks to those via **React Query** (TanStack Query).
- **NOT Server Actions.** This was an explicit fork and we picked API
  routes. Reopen the discussion before flipping it.

### 3.2 Persistence

- Persistence layer lives under `src/db/`.
- **Concrete backing store not yet chosen** — file-backed JSON vs SQLite
  vs something else is part of Section 6 (Migration / data path).
- Whatever is chosen must support: per-child records, per-pot balances at
  full precision, transaction log (for the "principal vs interest" split
  in §2.5), and idempotent daily-interest accrual.

### 3.3 Stack & conventions

- Installed: **Next.js 16.2.6**, **React 19.2.4**, TypeScript 5,
  **Tailwind v4**, Jest 30. See `package.json`.
- Code style (full rules in `CLAUDE.md`): single quotes, **named exports
  only**, **explicit return types on every function**, files ≤ 200 lines,
  hardcoded values extracted to dedicated constants files.
- Testing: Jest, one test file per component, `data-testid`,
  `render()` in `beforeEach`, shared mocks in `__mocks__/`.
- Per-feature workflow: Jest test → fail → minimal impl → pass → API
  route → UI + tests → review → commit. See CLAUDE.md.
- Project rule: **ask before invoking any superpowers skill** — don't
  auto-trigger.

### 3.4 Next.js 16 gotchas (per AGENTS.md)

- "This is NOT the Next.js you know" — APIs differ from training data.
  Read `node_modules/next/dist/docs/` before writing Next code.
- Any component using `useState`/`useEffect`/`onClick`/browser APIs needs
  `"use client"` at the top.
- Don't import Server Components into Client Components — pass server
  content as `children`.
- `fetch()` may be cached — pass `{cache: 'no-store'}` for fresh calls.

---

## 4. Open questions / things never answered

Carry these into the next session:

1. **Section 1 approval** — Domain Model + Store interface was presented
   but not signed off. Re-present it before moving on. The chat outline
   was: TypeScript interfaces for `Child`, `Pot`, `Transaction`, a
   `Store` interface, and how the three pots compose into a child.
2. **Section 2 — API surface**: needs endpoint list, request/response
   shapes (likely Zod), validation strategy, error envelope shape.
3. **Section 3 — Frontend architecture**: React Query key conventions
   and invalidation policy, route tree under `src/app/`, where local
   UI state lives, form handling library (if any).
4. **Section 4 — Interest math + display rules**:
   - Display rules are mostly settled (see §2.5–§2.6).
   - **Open**: the accrual formula and cadence. Daily simple interest?
     Continuous? What compounding basis? What's the actual MVP rate
     value (mockup said 15%/mo — placeholder)?
   - **Open**: idempotency. If the app hasn't been opened for a week,
     do we backfill daily accruals on the next open, or accrue on read?
5. **Section 5 — Testing strategy**: CLAUDE.md has _conventions_ but
   not _coverage targets_ — decide what's tested at the lib layer (all
   math), API layer (contract + errors), component layer (rendering +
   interactions), and what's intentionally not tested.
6. **Section 6 — Migration / data path**: pick the DB (file-JSON vs
   SQLite vs Postgres-via-something), define how schema migrations
   work, decide where the file lives in dev vs prod.
7. **Write the spec** to
   `docs/superpowers/specs/2026-06-17-fun-saver-design.md` after 1–6
   are settled, then self-review, then user review.
8. **Write the implementation plan** under `docs/plans/` after the
   spec is approved.

---

## 5. Workflow watch-outs

Operational gotchas that have bitten this repo:

- **`git push` to GitHub returned HTTP 400** on this repo. One-shot fix:
  ```bash
  git -c http.postBuffer=524288000 push
  ```
  Expect this to recur. **Don't change the global config** — use the
  one-shot.
- **`.superpowers/` is gitignored** by design. It's the scratch dir for
  the visual-companion brainstorming server. Anything there is
  throwaway unless explicitly promoted into `docs/`.
- The **visual-companion server auto-exits after 30 min idle**. Restart
  with `superpowers/brainstorming/scripts/start-server.sh` if the
  brainstorm HTML previews stop loading.
- The brainstorm state for this project is at
  `.superpowers/brainstorm/2021-1781720627/` — content + server state.
  If you want to resume the brainstorm with full visual context, point
  the brainstorming skill at this folder.

---

## 6. Files in this repo (what's already committed)

| File / dir                                       | Source of truth for                                             |
| ------------------------------------------------ | --------------------------------------------------------------- |
| `CLAUDE.md`                                      | Code style, architecture rules, TDD workflow, interview context |
| `AGENTS.md`                                      | Warning that Next.js 16 has breaking changes vs training data   |
| `package.json`                                   | Actual installed dependencies (Tailwind v4, no MUI)             |
| `docs/superpowers/specs/visual-palettes.md`      | Chosen palette, design tokens, currency + coin spec             |
| `docs/superpowers/specs/mockup-home-screen.html` | High-fi home-screen mockup (Sunshine Quest v8)                  |
| `public/inspiration/*.png`                       | Visual references the palette was derived from                  |
| `.claude/HANDOVER.md`                            | Prior session's terse end-of-day note (this doc supersedes it)  |
| **`docs/HANDOFF.md` (this file)**                | Decisions/dilemmas not captured anywhere else                   |

And uncommitted on disk:

| Path                                                     | What it contains                                                                                                             |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `.superpowers/brainstorm/2021-1781720627/content/*.html` | Mockup iterations v3 → v8, wallet-structure choice card, visual-style choice card, coin-scale exploration, MUI-style mockups |
| `.superpowers/brainstorm/2021-1781720627/state/*`        | Brainstorming companion server PID + log                                                                                     |
| `.plans/`                                                | Empty                                                                                                                        |
| `docs/plans/`                                            | Empty                                                                                                                        |

---

## 7. Glossary

| Term                     | Meaning                                                                           |
| ------------------------ | --------------------------------------------------------------------------------- |
| **Pot** (קופה)           | One of the three balances per child: savings, spending, good_deeds                |
| **Principal**            | Net deposits to a pot — what was put in, excluding interest accrued               |
| **Daily interest**       | The amount accrued today, rendered as silver coins in the home-screen "daily" row |
| **Sunshine Quest**       | The chosen visual palette (warm orange→pink gradient bg, purple CTA, white cards) |
| **Half-shekel rounding** | Display-only rounding rule: round to nearest 0.5 before drawing                   |

---

## 8. Open dilemmas — FLAG BEFORE CODING

Genuine forks where the chat assumed one thing and the repo says another,
or where a decision is implied but never confirmed.

### 8.1 Tailwind v4 (installed) vs MUI (assumed in design)

`package.json` ships **Tailwind v4** with no MUI installed. But the
brainstorm and `visual-palettes.md` assume MUI:

- `visual-palettes.md` references `theme.spacing(2)`, MUI's
  `@mui/icons-material`, and "Material Symbols (rounded variant)".
- Two of the brainstorm mockups are literally named `mui-mobile-mockup.html`.
- The "balance pulse" micro-interaction (§2.8) was specified as
  "Fade + keyframes של MUI".

**Decision needed**: install MUI and use it (matches design intent +
existing tokens) OR rewrite the visual spec in Tailwind v4 terms (matches
the skeleton). The user should pick before any component code is written.

### 8.2 The MVP savings interest rate value

Mockup said **15%/month** but it was a placeholder. Real MVP rate is
unset. Note: a kid-friendly app may want a deliberately high educational
rate, not a realistic one.

### 8.3 Interest accrual cadence

"Daily" is implied by the home screen, but neither the formula (simple vs
compound) nor the trigger (cron-like daily job vs accrue-on-read) is
decided. Picks must be idempotent — opening the app twice on the same day
must not double-accrue.

### 8.4 Wallet-structure model nuance

The chosen "three pots" shape isn't literally one of the three options the
user picked from in `wallet-structure.html`. It's option B (separate
wallets) extended with a third pot. Worth confirming the user is happy
that this extension preserves the spirit of their choice before locking
the schema.

### 8.5 Multi-child UX scope

Data model is per-child (mockup says "Noa's account"), and the user has
more than one daughter. **Open**: does MVP have a child-switcher UI, or
does it ship one-child-at-a-time with multi-child only at the data layer?

---

## 9. Suggested first move for the next developer

1. Read this file end-to-end.
2. Read `CLAUDE.md`, `AGENTS.md`, and `docs/superpowers/specs/visual-palettes.md`.
3. Open `docs/superpowers/specs/mockup-home-screen.html` in a browser to
   see the target UI.
4. **Surface the Tailwind-vs-MUI dilemma (§8.1) to the user before
   anything else** — it changes how every component is written.
5. Resume the brainstorm at Section 1 — present the Domain Model + Store
   interface, get approval, then advance through 2–6.
6. Write the spec, request review, then hand to the writing-plans skill.
7. Only then start writing code, TDD one feature at a time per CLAUDE.md.
