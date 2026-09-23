# The Method page («השיטה»)

A parent-facing page explaining what we're trying to achieve, why money is
split into three wallets, and what the parent has to do. Static and read-only.

- Mockup: `mockups/method-page.html` — **variant E** is the one to build.
  A–D stay for reference; don't delete them without asking.
- Design: `docs/superpowers/specs/2026-09-14-method-page-design.md`
- Copy: `docs/copy/method-page.he.md` (shipping) · `.en.md` (parked, §2 backlog)
- Evidence behind every claim: `docs/research/jar-method.md`

## Where it stands (2026-09-23)

PRs 1–8 are merged: #64 (copy, route, menu link), #66 and #71 (the opener), #69
(section shell, evidence quote, section 1), #73 (the three wallets, the block
renderer, the talk bubble), #82 (the actions, sections 3 and 4), #84 (the
scripts, section 5), #89 (limits, the sources and the citation numbers).
**The page is done.**

`main` moved under the page while PRs 7 and 8 were open: #79 gave `Method`
`accounts` and `initialAccount` props, and #85, #86 and #90 continued the menu
and login work. #89 branched off `main` as it stood, not off #84.

Both follow-ups are now resolved or specced. The `/method` browser suite landed
as #92. **The AA contrast pass — decisions 7 and 10 — grew past this page once
every text-on-colour pair was measured, and has its own plan:
`.plans/2026-09-23-aa-contrast-pass.md`.** It is decided and drawn, not yet
written.

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
7. **The opener keeps `gradients.actionButton` knowingly under AA.**
   *(Specced out in `.plans/2026-09-23-aa-contrast-pass.md`. The measured
   numbers below held; what changed is the reach — the same gradient sits under
   every button in the app, and its drop shadow has to move with it.)* White on it
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

10. **Pot text ships under AA, and is raised with decision 7.**
    *(Specced out in `.plans/2026-09-23-aa-contrast-pass.md`, where it turned
    out to be the smallest part: outside `WalletTrio` the pot gradients carry an
    emoji and no text.)* `textStrong` on
    the pot gradients measures 3.33:1 on jungle `potSavings`, 3.58 on jungle
    `potGood` and 3.88 on sunshine `potGood`; the pots' 12px and 18px text needs
    4.5. The mockup's own `#4A2A00` clears neither (3.89 jungle, 3.65 sunshine),
    so drawing it exactly does not fix it. What does is a `textOnPot` token per
    theme — jungle `#2B1800`, sunshine `#2B1235`, midnight `#ECF1F8` — and it
    goes in with the `actionButton` surface in one pass.

## Decisions (settled 2026-09-22, during PR 6)

11. **Section 4 stays one section, and decision 11 as #78 merged it is
    reversed.** That version split it into «מה להחליט» and «הדוגמה שלנו» and took
    the page to seven sections. The split was drawn as mockup variant F and
    rejected: the example is one table and one line, a closing illustration
    rather than a section of its own, and an eighth summary row costs more
    scanning than the length it saves. The page stays at **six sections**,
    `ACTIONS_COPY.communicate` keeps pointing at «סעיף 5», and nothing in
    `docs/copy/method-page.he.md` renumbers.

    The length it was splitting to fix is met instead by **putting the example
    under «איך מחלקים?»**, the paragraph it illustrates, rather than after the
    checklists — so the thing the parent has to act on is last, not buried under
    a table they scroll past.

12. **A section body writes no paragraph markup of its own.** Anything muted —
    the note under the example included — is a `{ kind: 'text', muted: true }`
    block through `MethodBlocks`, never a hand-written `<p data-muted>`. One
    place emits a body paragraph, so one rule styles it and the `\n\n` splitting
    comes free.

13. **The example table's rows name a wallet, not a label.** `example.table.rows`
    carry `{ wallet, amounts }`, and `ExampleWalletSplitRow` composes
    «🛍️ בזבוזים 50%» from `WALLET_ICON`, `WALLET_NAME` and `DEPOSIT_SPLIT`.
    «באפליקציה: 50% / 40% / 10%» in the `decide` checklist reads the same split
    rather than repeating it — it says *באפליקציה*, so it has to be the app's
    number and not a typed one.

    **The split is the app's default, and that is temporary.** Once a family can
    set its own, both of those read the selected account's split — the same
    cookie-scoped account the theme already comes from (decision 2) — and the
    page stops being static in that one respect. The shekel amounts go with it:
    they are a fixed illustration of ₪30 a week today, and the weekly total they
    rest on exists only inside the caption text, so nothing catches them
    disagreeing with a percentage that moved. Both halves move together when
    custom split lands; do not part-fix it by hardcoding the share back.

## Decisions (settled 2026-09-22, during PR 7)

14. **A heading inside a section body is a `MethodBlock`.** Section 5 needed
    four `{ heading, talk }` pairs on the page, and the three shapes it could
    have taken were a component per script, a `<h3>` written by the section, or
    a fourth block kind. The first two both lose: `MethodSection` styles body
    prose through `> p` — direct children — so any wrapper element puts the
    heading and its bubble out of that rule's reach, and a component that only
    returns a Fragment is a component that does nothing. So the heading goes
    the way decision 12 already sends a muted note: `{ kind: 'heading'; body }`
    through `MethodBlocks`, rendered as a plain `<h3>`, styled once by
    `MethodSection`'s `Body > h3`. A section body stays one `MethodBlocks` over
    an ordered list, in every section.

    It is an `<h3>` and not the mockup's `<p><b>` because the page runs `h1`
    for the goal and `h2` per section, and these four are labels inside one of
    them. Same pixels, real outline.

15. **Section numbers live in one map.** `SECTION_NUMBER` in
    `Method/constants.ts` replaces the five per-section `constants.ts` files,
    each of which held a single number that meant nothing without the other
    four open beside it. `Method.test.tsx` asserts the rendered order against
    `Object.values(SECTION_NUMBER)` rather than importing five constants to
    retype the same list, and PR 8 adds `limits: 6` to the map instead of a
    sixth file.

16. **`MethodSection`'s body carries a test id.** A test that checks what a
    section renders has to hold the element the `> p` and `> h3` rules hang
    off. Reaching it structurally (`:scope > div`) pins `MethodSection`'s
    internals and returns `null` — not a clear failure — once they move.

17. **Section 5's bubbles carry no label, and `TalkBubble`'s label is
    optional.** Mockup E draws «🗣️ מה אומרים לילד» on all four, but in a section
    whose `h2` is «מה אומרים לילד», between an `h3` that names the moment and
    the words themselves, it says what the two lines around it just said. The
    label still earns its place in section 2, where it marks a script inside a
    section about something else — so it stays a prop, and section 5 simply
    does not pass one. Knowingly drawn differently from the mockup.

18. **Section 5's copy is an ordered `moments` array**, not four named keys.
    Each entry is `{ heading, talk }` and the section renders
    `moments.flatMap((moment) => [moment.heading, moment.talk])`, so "one
    heading and one bubble per moment" holds by construction rather than by a
    list kept in step by hand. Its test asserts the alternation and the count,
    not a restatement of the array.

## Decisions (settled 2026-09-22, during PR 8)

19. **An accordion carries one identity, and shows it when it is a number.**
    «המקורות» is a `<details>` with a summary, a hint chip and a chevron and no
    number — it is not one of the six steps. A component of its own, sharing
    the chrome through a `*-parts.ts`, was the obvious shape and loses: a
    second component composing the same summary row is exactly the drift
    decision 3 refused for `Header`.

    `MethodSection` takes a single `id: MethodSectionId` and draws the pill
    when `typeof id === 'number'`. Two shapes were built before it and thrown
    away: an `id` beside a `number`, where the six numbered sections passed the
    same value twice and a mismatch would have drawn one numeral while every
    test id said another — with every test still green, because each queried by
    the id it was handed; then a union of the two, which closed that hole but
    bought a discriminated type, an undestructured `props` and a narrowing line
    to describe one prop. **One value cannot disagree with itself**, which is
    what both of those were paying to prevent.

    `MethodSectionId` is `number | typeof SOURCES_SECTION_ID`. `number | string`
    collapses to `string | number`, and `id="sorces"` then compiles and renders
    an accordion no test can find.

20. **A source's `url` is the citation link.** The mockup renders no links, but
    it also elides twelve of the sixteen entries, and its own `.srcs a` rule is
    the drawn intent. A list of studies a parent cannot open is decoration. The
    citation carries the link, `dir="ltr"` and `target="_blank"`; the url is
    never printed as text — sixteen of them is a wall of Latin in an RTL page.

21. **A claim carries the number of the study behind it.** Every source has an
    `id`, `SourceId` is derived from the list rather than retyped, and a `text`
    or `quote` block names the sources behind it. The number is the entry's
    position in `SOURCES_COPY.list`, which is the number the `<ol>` draws beside
    it — one ordering, so the two cannot disagree. Eleven blocks carry one.

    **Four sources are deliberately unmarked** — 4 (the marshmallow
    replication), 13 (74% of Israeli parents), 14 (חיסכון לכל ילד) and 16 (the
    CFPB age window). The page never states what they back; they came from the
    research doc. «כל מספר בעמוד הזה מגיע ממקום» promises page → source, not
    source → page, so the list being wider than the page keeps it true. Do not
    close the gap by inventing copy for them.

22. **The marker is a named symbol, not a link.** A linked marker with `id`s on
    the entries was drawn and rejected: `<details>` auto-opening on fragment
    navigation is not universal, and older browsers scroll to a shut accordion
    and show nothing. What the plain superscript still owed was a name — a bare
    digit merges into the sentence for a screen reader, indistinguishable from
    the 72%, 37 and 85% the copy itself carries. It reads «מקור 8» / «מקורות 10
    ו-12», through `role="img"` + `aria-label` the way `ActionList` names its
    tick, because `superscript` is a naming-prohibited role and a bare label on
    it may never be exposed.

23. **The «הרחבה מלאה» pointer is gone.** `SOURCES_COPY.more` named
    `docs/research/jar-method.md`, which Next never serves — `public/` holds
    only `avatars/` and `inspiration/`. It had never reached a browser before
    this PR, so nothing had caught it. Publishing the dossier was the
    alternative and is a new route plus 945 lines of English engineering prose
    in front of a Hebrew-reading parent. The line went, and
    `docs/copy/method-page.he.md` lost `method.sources.more` with it so the
    shipping copy and the page still say the same thing.

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
| `MethodSection` | `<details>`; summary with title, optional number, optional hint, chevron | 7× |
| `EvidenceQuote` | Body + citation line | 4× |
| `TalkBubble` | Lines with **variants** — spoken / struck-through / muted | 5× · built PR 5 |
| `ActionList` | Group label + items mapped over ticked/unticked state | 3× · built PR 6 |
| `ExampleWalletSplitTable` | Caption, header row, scroll container, tabular figures | 1× · built PR 6 |
| `ExampleWalletSplitRow` | One wallet's share and its amount per period | 3× · built PR 6 |
| `WalletTrio` | Three pots — name, icon and share per wallet | 1× · built PR 5 |
| `SourceList` | 16 entries from an array, LTR runs inside RTL | 1× · built PR 8 |
| `SourceMarker` | Ids to the numbers the list draws, one symbol, named aloud | 11× · built PR 8 |

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
- The gap this left — `/method` mounting no accounts or app-mode provider, so
  the accounts and appearance sections of the menu rendered inert there — was
  closed by the menu redesign's #79, which gave `Method` `accounts` and
  `initialAccount` props and wrapped it in `AccountManagement` and
  `AccountsProvider`. `/method` now redirects home when the signed-in user has
  no account at all.
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

## PR 6 — actions (done, #82)

`ActionList` + `ExampleWalletSplitTable` + `ExampleWalletSplitRow`; wires
sections 3 and 4. Both section bodies go through `MethodBlocks`; only the
checklists and the table are hand-wired.

Values and tick states are **hardcoded** from the deck — none of the underlying
settings exist yet (backlog §6b). The rescue rule is body text, not a checkbox:
presenting it as a decision invites renegotiating it at the checkout, which is
exactly when it must not be negotiable.

Four things PRs 7–8 inherit from it:

- **An icon-and-text line is a `GoalOutcome`.** Section 3's two rules reuse it
  as they stand — `promise.rule.*` is already `IconLine`-shaped — inside a
  wrapper that owns nothing but the dividers between them. Reach for it before
  drawing another.
- **A muted remark is a block** (decision 12), so a section component never
  writes a `<p>` itself.
- **Wide content carries its own `overflow-x`.** The table's caption is a
  `<caption>` inside it rather than a paragraph beside it, so the two scroll
  together; the sources list follows the same shape if it ever needs one.
- **Screenshots ship with the PR.** `pr-screenshots` (#80) landed while this was
  open, so PRs 7 and 8 carry shots of the sections they wire.

## PR 7 — scripts (done, #84)

`ScriptsSection` + the `heading` block kind; wires section 5. `TalkBubble`
shipped in PR 5 and took nothing. Outlined bubble with a tail, against
`EvidenceQuote`'s filled treatment — same rounded language, opposite fill, so
neither is mistaken for the other while scanning. The "don't say this" line is
struck through **inside the same bubble**, so both halves read as one exchange.

No component was added for a script: decision 14 carries the heading as a
block, so the section is one `MethodBlocks` over nine of them — the intro, then
a heading and a bubble per moment.

Two things PR 8 inherits from it:

- **`MethodBlocks` has a fourth kind**, and section 6's sub-headings — if it
  wants any — reach the page the same way. Anything else a body needs is a
  block before it is markup.
- **A section's number comes from `SECTION_NUMBER`** (decision 15), not from a
  `constants.ts` of its own; `limits: 6` is already the next key in the map.

## PR 8 — limits and sources (open, #89)

`LimitsSection` + `SourcesSection` + `SourceList` + `SourceMarker`; wires
section 6 and the sources accordion, and connects the two with numbers.

Section 6 was not softened. It says the effect sizes are modest, that allowance
alone teaches nothing, and that the parent should hand over physical cash at
this age — which partly argues against the product. That is deliberate, and it
is the section that gained the most citations: three of its four claims now
name the study under them.

`limits: 6` went into `SECTION_NUMBER` as decision 15 said it would, and the
section is one `MethodBlocks` over the five `limits.*` blocks and nothing else.
`SOURCES_SECTION_ID` sits beside the map for the accordion that has no number.

## Notes / risks

- **No new theme tokens needed.** `theme-tokens.ts` already has `accentSoft`,
  `softBg`/`softBorder`/`softText`, `depositBg`, `alert`/`alertSoftBg`,
  `divider`, and `gradients.actionButton`.
- **First table in the app.** Section 4's example table has its own
  `overflow-x` container so the page body never scrolls sideways on a phone.
- **LTR inside RTL.** Author names and URLs in the sources list are LTR runs in
  RTL paragraphs; wrap them so punctuation doesn't jump.
- **Tailwind's preflight strips list markers app-wide** — `ol, ul, menu {
  list-style: none }`, reached through `globals.css`. Any list that wants its
  numbers has to ask for them back; `SourceList` sets `list-style: decimal`.
  This is not a redundant line, and deleting it empties the numbering the
  citation markers point at.
- **`<details>` over a JS accordion** — native, accessible, works unhydrated.
- **Section 3 closed by default** is a real risk: it's the rule the method rests
  on and a skimming parent may never open it. Mitigated by the chip; revisit if
  it goes unread.
- **Section 4 is long expanded** — seven paragraphs, a quote, a table and two
  checklists. Splitting it was drawn and rejected (decision 11); the table moved
  under «איך מחלקים?» instead. If it still reads long, the next lever is moving
  the Gneezy quote out, not an eighth summary row.
- **Custom split will reach this page.** The table and the «באפליקציה» line
  both read `DEPOSIT_SPLIT`, which is the default every account gets today. The
  work is in the custom-split feature, not here — but it lands on section 4
  first, because section 4 is the only place the page quotes a number the
  parent can change.
- **`*.visual.ts` are browser assertions, not image snapshots.** There is no
  pixel tooling in this repo and no stored baselines — a visual suite drives a
  real page and asserts computed styles and geometry, so there is nothing to
  record and nothing to re-record. Deferring the `/method` suite through PRs 5
  to 8 was still right, but for the plainer reason that it would have been
  rewritten five times rather than re-recorded five times.

  It covers what jsdom cannot see: the chevron turning over, and
  `list-style: decimal` surviving Tailwind's reset — the numbering every
  citation mark points at. **Assert the flipped matrix, not merely "some
  transform":** `rotate(0deg)` computes to a matrix rather than `none`, so a
  chevron that never turns passes the looser form. The `details[open] >
  summary &` scoping stays uncovered — loosening it to a descendant combinator
  passes, correctly, because nothing on this page nests.
- **The page is no longer static.** #79 wired `/method` to the signed-in
  user's accounts, so PR 8 branches off a `main` where `Method` takes props and
  a section can reach the selected account if it needs to — which is the shape
  decision 13's custom split will want.
