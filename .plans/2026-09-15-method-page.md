# The Method page («השיטה»)

A parent-facing page explaining what we're trying to achieve, why money is
split into three wallets, and what the parent has to do. Static and read-only.

- Mockup: `mockups/method-page.html` — **variant E** is the one to build.
  A–D stay for reference; don't delete them without asking.
- Design: `docs/superpowers/specs/2026-09-14-method-page-design.md`
- Copy: `docs/copy/method-page.he.md` (shipping) · `.en.md` (parked, §2 backlog)
- Evidence behind every claim: `docs/research/jar-method.md`

## Phase 0 — branch (done)

Worktree `~/Projects/technotronic/fun-saver-method-page` on `feat/method-page`
off `origin/main`. Each PR below branches from the previous one.

## Decisions (settled 2026-09-15)

1. **Base — merge PR #56 first.** It was docs-only and `CLEAN`, so the whole
   stack bases off `main` normally and `docs/copy/` is simply there. The
   alternative, stacking on the docs branch, would have forced a rebase of all
   eight PRs once #56 landed.
2. **Theme — read the selected-account cookie**, the same one `/` uses via
   `ThemeController` + `resolveThemeId`. Pinning a default was simpler and
   fully static, but the theme would visibly flip when opening the page from a
   jungle or midnight account, which reads as a bug. Costs one cookie read in
   the server component.
3. **Header — extend `Header` with a title-only mode** (`name` / `avatarId`
   become optional). One header component means the burger cannot drift
   between pages. A second header would have been zero-risk to `/` but leaves
   two things rendering a burger.

## Component rule

A component that does anything — composes, branches, or maps over data — gets
its **own folder and its own test**: `Component.tsx`, `Component.styles.ts`,
`constants.ts`, `Component.test.tsx`, `index.ts`.

A styled element and nothing else lives in a `.styles.ts` and gets **no test**
of its own — testing a styled `div` tests Emotion, not us.

### Gets a folder + test

| Component | Why it isn't trivial | Used |
| --- | --- | --- |
| `MethodIntro` | Composes goal, outcome list, divider, brief | 1× |
| `GoalOutcome` | Icon + text + **conditional** note | 3× |
| `MethodSection` | `<details>`; summary with number, title, optional hint, chevron | 6× |
| `EvidenceQuote` | Body + citation line | 4× |
| `TalkBubble` | Lines with **variants** — spoken / struck-through / muted | 5× |
| `ActionList` | Group label + items mapped over ticked/unticked state | 3× |
| `ExampleTable` | Rows from data, scroll container, tabular figures | 1× |
| `WalletTrio` | Three pots from data, or reuse `Donut`/`Legend` (decided in PR 5) | 1× |
| `SourceList` | 16 entries from an array, LTR runs inside RTL | 1× |

### Styles only, no test

Card surface, eyebrow pill, divider rule, chevron, muted paragraph, scroll
wrapper, layout containers.

## PR 1 — copy data (done)

`src/components/Method/copy/` — the 66 keys from the deck as typed data, split
by section (`goal.ts`, `why.ts`, `wallets.ts`, `promise.ts`, `actions.ts`,
`scripts.ts`, `limits.ts`, `sources.ts`) behind an `index.ts` barrel.

Split by section because 66 keys will not fit the 200-line cap in one file, and
compressing the text to fit is exactly the wrong fix. When i18n lands
(backlog §2), the catalogue absorbs this object wholesale.

Block shape carries its format so components don't guess:

```ts
type MethodBlock =
  | { kind: 'text'; body: string; muted?: boolean }
  | { kind: 'quote'; body: string; citation: string }
  | { kind: 'talk'; label: string; lines: readonly TalkLine[] };
```

**No test ships with this PR.** A suite over a static object walks literals and
runs no production code — it restates the data in a second place and fails only
when someone edits both. TypeScript already rejects a component reading a key
that is not there, and PRs 3 to 8 exercise every block for real when they render
it, which is where a wrong shape should surface.

No UI in this PR.

## PR 2 — route, header, menu link (done)

- `src/app/method/page.tsx` — server component, no data fetching beyond the
  theme cookie (decision 2). Renders `Screen` + header + title only.
- `Header` gains a title-only mode (decision 3).
- `MenuOverlay` gains a `next/link` entry alongside the existing sections;
  update `MenuOverlay.test.tsx`.
- `Header` takes a `title`, not a `name`, and `avatarId` is optional — a page
  title was never a name, and one required prop beats two optional ones.
- `Method.styles.ts` carries `'use client'`: emotion's `styled` evaluates
  `createContext`, which a server component's module graph cannot, so the build
  fails collecting `/method` without it.
- Known gap: `/method` mounts no accounts or app-mode provider, so the accounts
  and appearance sections of the menu render inert there.
- e2e: menu link navigates to `/method`.

## PR 3 — the opener

`MethodIntro` + `GoalOutcome`. One `gradients.actionButton` block: eyebrow,
title, lead, three outcomes, divider, בקצרה. Always visible, never collapsed.

## PR 4 — section shell + evidence

`MethodSection` + `EvidenceQuote`; wires section 1 (למה לא קופה אחת).

Every section **closed by default**, including ההבטחה — it carries a
`הכי חשוב` chip on its summary row instead.

## PR 5 — the three wallets

`WalletTrio`; wires section 2. First check whether `OverviewCard`'s `Donut` /
`Legend` take static props — reuse beats a new component.

## PR 6 — actions

`ActionList` + `ExampleTable`; wires sections 3 and 4.

Values and tick states are **hardcoded** from the deck — none of the underlying
settings exist yet (backlog §6b). The rescue rule is body text, not a checkbox:
presenting it as a decision invites renegotiating it at the checkout, which is
exactly when it must not be negotiable.

## PR 7 — scripts

`TalkBubble`; wires section 5. Outlined bubble with a tail, against
`EvidenceQuote`'s filled treatment — same rounded language, opposite fill, so
neither is mistaken for the other while scanning. The "don't say this" line is
struck through **inside the same bubble**, so both halves read as one exchange.

## PR 8 — limits and sources

`SourceList`; wires section 6 and the sources accordion.

Do not soften section 6. It says the effect sizes are modest, that allowance
alone teaches nothing, and that the parent should hand over physical cash at
this age — which partly argues against the product. That is deliberate.

## Notes / risks

- **No new theme tokens needed.** `theme-tokens.ts` already has `accentSoft`,
  `softBg`/`softBorder`/`softText`, `depositBg`, `alert`/`alertSoftBg`,
  `divider`, and `gradients.actionButton`.
- **First table in the app.** Section 4's example table needs its own
  `overflow-x` container so the page body never scrolls sideways on a phone.
- **LTR inside RTL.** Author names and URLs in the sources list are LTR runs in
  RTL paragraphs; wrap them so punctuation doesn't jump.
- **`<details>` over a JS accordion** — native, accessible, works unhydrated.
- **Section 3 closed by default** is a real risk: it's the rule the method rests
  on and a skimming parent may never open it. Mitigated by the chip; revisit if
  it goes unread.
- **Section 4 is long expanded** — six paragraphs, a quote, two checklists, a
  table. Fallback is splitting it into "מה להחליט" and "הדוגמה שלנו".
- **e2e visual snapshots** — a new route adds a baseline, it doesn't change
  existing ones.
