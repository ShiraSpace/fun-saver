# The Method page («השיטה»)

A parent-facing page explaining what we're trying to achieve, why money is
split into three wallets, and what the parent has to do. Static and read-only.

- Mockup: `mockups/method-page.html` — **variant E** is the one to build.
  A–D stay for reference; don't delete them without asking.
- Design: `docs/superpowers/specs/2026-09-14-method-page-design.md`
- Copy: `docs/copy/method-page.he.md` (shipping) · `.en.md` (parked, §2 backlog)
- Evidence behind every claim: `docs/research/jar-method.md`

## Where it stands (2026-09-22)

PRs 1–5 are merged: #64 (copy, route, menu link), #66 and #71 (the opener), #69
(section shell, evidence quote, section 1), #73 (the three wallets, the block
renderer, the talk bubble). **PR 6 is next.**

Worktree `~/Projects/technotronic/fun-saver-method-page`. Each PR branches off
`main` once the one before it has merged — the stack was rebased twice because
branches were cut from each other instead.

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

## Decisions (settled 2026-09-22, during PRs 3 and 4)

4. **Copy rendering lives in `Method/rich-text.tsx`.** `emphasize(body)` splits
   a string on `**` into `<strong>` runs; `paragraphs(body)` splits on `\n\n`.
   Not `src/lib` — that is framework-agnostic and `emphasize` returns JSX. Not a
   component folder — neither is a component. **Every string the page renders
   goes through `emphasize`**, titles and eyebrows included; three review rounds
   were spent on strings that skipped it. `MethodIntro.test.tsx` guards it with
   one assertion that no `**` survives into the rendered text.
5. **The client boundary is `Method.tsx`, not the styles files.** `/method`'s
   chain is `app/method/page.tsx` → `Method.tsx`, neither a client component, so
   the styled modules were the first thing a server module graph imported and
   each had to open the boundary itself. Marking the component opens it once and
   every `.styles.ts` under `Method/` stays plain. The page still server-renders.
6. **Style values are written inline in the `.styles.ts`**, not collected into a
   `*_STYLE` object — a single-use value named and re-imported one file over
   buys indirection and no reuse. **But anything the theme owns comes from the
   theme**: every colour from `theme.colors` / `theme.gradients`, every
   `font-size` from `theme.typography` (`label` 12 · `body` 15 · `heading` 18),
   and no `opacity` on a themed colour — that is a second, invisible colour
   decision on top of the token's. Spacing, radii and shadows stay literals; no
   scale exists for them.
7. **The opener keeps `gradients.actionButton` knowingly under AA.** White on it
   is 6.37:1 on sunshine but 2.57:1 on jungle and 2.54:1 on midnight, where
   12–15px prose needs 4.5:1. The mockup renders the purple block and the purple
   numbered pill in all three themes and that is the approved design, so it
   ships as drawn. The fix that keeps the design is a darker stop **per theme**
   for this surface — sunshine unchanged, jungle and midnight deep instead of
   mid — a token in `theme-tokens.ts` plus the three theme files. Raise it once,
   not every PR.
8. **Latin runs inside RTL carry `dir="ltr"` with `text-align: end`.**
   `EvidenceQuote`'s citation does; section 6 and the sources list will.

## Decisions (settled 2026-09-22, during PR 5)

9. **The page calls a wallet what the app calls it.** The deck said «הוצאות»
   where the app says «בזבוזים», and shipping both would have left the parent
   reading one word on the method page and another on the account screen. The
   page moved to the app's word, in the pot and in the prose.

   With the wording aligned, a pot label stopped being copy: `WALLET_NAME`,
   `WALLET_ICON` and `DEPOSIT_SPLIT` all live in `src/lib/constants.ts`, and
   `wallets.ts` carries only the order the three are drawn in. `WALLET_GRADIENT`
   moved to `src/theme/` for the same reason — `Method/` was reaching into
   `Account/` for it.

10. **Pot text ships under AA, and is raised with decision 7.** `textStrong` on
    the pot gradients measures 3.33:1 on jungle `potSavings`, 3.58 on jungle
    `potGood` and 3.88 on sunshine `potGood`; the pots' 12px and 18px text needs
    4.5. The mockup's own `#4A2A00` clears neither (3.89 jungle, 3.65 sunshine),
    so drawing it exactly does not fix it. What does is a `textOnPot` token per
    theme — jungle `#2B1800`, sunshine `#2B1235`, midnight `#ECF1F8` — and it
    goes in with the `actionButton` surface in one pass.

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
| `TalkBubble` | Lines with **variants** — spoken / struck-through / muted | 5× · built PR 5 |
| `ActionList` | Group label + items mapped over ticked/unticked state | 3× |
| `ExampleTable` | Rows from data, scroll container, tabular figures | 1× |
| `WalletTrio` | Three pots — name, icon and share per wallet | 1× · built PR 5 |
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

## PR 3 — the opener (done, #66 and #71)

`MethodIntro` + `GoalOutcome`. One `gradients.actionButton` block: eyebrow,
title, lead, three outcomes, divider, בקצרה. Always visible, never collapsed.

The goal title takes the page's `h1`; `Header` renders its title as a span, so
the page had none. Sections are `h2` under it.

`Intro` sets `text-align: start` — `Screen` centres text app-wide, so without it
every paragraph in the opener centres.

## PR 4 — section shell + evidence (done, #69)

`MethodSection` + `EvidenceQuote`; wires section 1 (למה לא קופה אחת).

Every section **closed by default**, including ההבטחה — it carries a
`הכי חשוב` chip on its summary row instead.

Three things PRs 5–8 inherit from it:

- **Sections get a component each** (`WhySection` is the first). Six inlined in
  `Method.tsx` passes the 40-line function cap by PR 6; `Method.tsx` stays a
  list of what the page is made of.
- **`MethodSection` styles body paragraphs through `> p`**, direct children
  only. Section components write plain `<p>` and `<p data-muted={block.muted}>`
  rather than importing styled parts, and the rule cannot reach into
  `EvidenceQuote`'s own paragraph and resize it. Read `muted` from the block —
  `wallets.ts`, `actions.ts` and `scripts.ts` all carry the flag.
- **The chevron is scoped `details[open] > summary &`.** A plain
  `details[open] &` is a descendant combinator, and PR 8 nests an accordion
  inside section 6.

Test ids take the section number — `section(2)`, `summary(2)`, `hint(2)` —
because six sections sharing one id leaves nothing able to target one.

## PR 5 — the three wallets (done, #73)

`WalletTrio` + `MethodBlocks` + `TalkBubble`; wires section 2.

`Donut` and `Legend` were checked and not reused. `Donut` takes static props but
is an unlabelled ring on its own, and `Legend` renders per-wallet balances the
page does not have. Variant E draws three flat pots, not a ring.

Four things PRs 6–8 inherit from it:

- **`MethodBlocks` renders a section's body.** It takes `readonly MethodBlock[]`
  and dispatches on `kind` — `text` through `paragraphs` + `emphasize`, `quote`
  to `EvidenceQuote`, `talk` to `TalkBubble` — honouring `muted`. A section
  component lists its blocks in order and renders nothing itself. It wraps each
  block in a `Fragment`, never a `<div>`, so `MethodSection`'s `> p` rule still
  reaches the paragraphs; the test pins that.
- **`TalkBubble` already exists**, all three tones. Section 2 carries a `talk`
  block, so it could not wait for PR 7. PR 7 wires section 5 and adds nothing.
- **A wallet's name, icon and share come from `src/lib/constants.ts`**
  (`WALLET_NAME`, `WALLET_ICON`, `DEPOSIT_SPLIT`), and its gradient from
  `src/theme/wallet-gradient.ts`. Section 4's example table repeats all three —
  read them, do not retype the deck's numbers.
- **Muted is a colour, not a size.** Every paragraph in a section body is
  `typography.body`; `data-muted` only changes the colour. The opener's small
  prose moved to prose size with it. What stays at `typography.label` is chrome:
  eyebrow pill, section numeral, hint chip, chevron, pot label, bubble label,
  citation.

## PR 6 — actions (next)

`ActionList` + `ExampleTable`; wires sections 3 and 4. Both section bodies go
through `MethodBlocks`; only the checklist and the table are hand-wired.

Values and tick states are **hardcoded** from the deck — none of the underlying
settings exist yet (backlog §6b). The rescue rule is body text, not a checkbox:
presenting it as a decision invites renegotiating it at the checkout, which is
exactly when it must not be negotiable.

## PR 7 — scripts

Wires section 5; `TalkBubble` shipped in PR 5. Outlined bubble with a tail, against
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
  table. Splitting it into "מה להחליט" and "הדוגמה שלנו" was drawn and rejected
  (mockup variant F, not kept): the example is one table and one line, which is
  a closing illustration rather than a section of its own, and an eighth summary
  row costs more scanning than the length it saves. The page stays at **six
  sections**. If it still reads long once built, move the table above the
  checklists rather than splitting.
- **e2e visual snapshots** — a new route adds a baseline, it doesn't change
  existing ones. Still not taken: every PR from 5 to 8 adds content to the same
  page, so one recording after PR 8 replaces five that would be re-recorded. It
  is also the only thing that can cover the chevron flip, which is CSS state and
  invisible to jsdom.
- **`/method` mounts no accounts or app-mode provider**, so the accounts and
  appearance sections of the burger menu render inert there. Own PR, unrelated
  to section content.
