# The Method page — design

> Status: **variant E approved 2026-09-15**, not yet implemented.
> Mockup: `mockups/method-page.html` — five variants; **E is the one to build**.
> A–D are kept for reference; do not delete them without asking.
> Copy: `docs/copy/method-page.he.md` (shipping) · `method-page.en.md` (parked).
> Evidence: `docs/research/jar-method.md`. Roadmap: `docs/backlog.md`.

## Purpose

A parent-facing page that states **what we are trying to achieve**, explains
**why** fun-saver splits money into three wallets, and lists **what the parent
has to do** for the method to work. It is where the non-obvious rules live —
pay on a fixed day, don't tie it to chores, don't refill mid-week.

## Scope

**In:** one static, read-only route. Hebrew only. Content from the approved
copy deck. A collapsible sources section.

**Out (deliberate):**
- Does **not** write anything to an account. The action checklists are
  presentational — they show what to decide and what has been decided, but the
  parent applies it manually. A real setup wizard is roadmap item #8; the
  section order is designed so section 4 can absorb it without moving anything.
- Does **not** ship English. See `backlog.md` §2. The English copy already
  exists so that task is wiring, not translation.
- No child-facing view. This page is for the parent.

## Route and entry point

- Route: `src/app/method/page.tsx` — a server component. No client state, no
  data fetching, nothing account-specific.
- Entry: a new item in the burger menu, alongside the existing sections in
  `src/components/Menu/`. A navigation link, not an inline menu section —
  follow the existing `MenuLabel` styling so it doesn't look bolted on.

## Structure

An always-visible opener, then six collapsible sections, then sources.
**Every section is closed by default**, including ההבטחה.

| | Section | Note |
| --- | --- | --- |
| — | **Opener** | Always visible. Goal + בקצרה in **one** primary-gradient block with a divider between them |
| 1 | למה לא קופה אחת | Opens on the 72% partitioning result — the strongest fact we have |
| 2 | שלוש הקופות | Three wallet blocks. **Reuse the existing donut**, don't draw a new one |
| 3 | ההבטחה | Carries `הכי חשוב` on the summary row, since it is closed like the rest |
| 4 | מה צריך לעשות | Five decisions + one conversation, in two labelled action groups |
| 5 | מה אומרים לילד | Scripts only — no actions; its checklist item lives in section 4 |
| 6 | מה השיטה לא עושה | Honest limits. Do not soften this section |
| — | המקורות | Collapsed; 16 numbered citations with links |

### Three information formats

The page carries three kinds of content and they must be visually
distinguishable at a glance. This is the core of the design.

| Format | Treatment | Carries |
| --- | --- | --- |
| `text` | Plain text on the white card | The explanation |
| `quote` | Filled tint, start rail, citation line | A research finding |
| `talk` | **Outlined** speech bubble with a tail and a 🗣️ label | What to say to the child |

`quote` is filled and `talk` is outlined on purpose — same rounded language,
opposite treatment, so neither is mistaken for the other while scanning. In
`talk`, the "don't say this" line is a strikethrough inside the same bubble
rather than a separate block, so both halves read as one exchange.

### Actions

Checkboxes appear **only where the parent has something to do** — decide, set
in the app, or communicate to the child. Never on explanatory content.

- Section 3 — `להחליט`: which day. Sits directly under the Kidd quote so the
  reason and the decision touch.
- Section 4 — `להחליט · להגדיר באפליקציה` (5 items) and `לתקשר` (1 item).

The rescue rule ("when it runs out mid-week you wait") is **body text, not a
checkbox**. Presenting it as a decision invites renegotiating it at the
checkout, which is exactly when it must not be negotiable.

## Components

Prefer composition of what exists over new primitives.

| Need | Approach |
| --- | --- |
| Page chrome | Existing `Screen` + `Header` |
| Opener | One new local `MethodIntro` — gradient block, goal, divider, brief |
| Collapsible section | One new local `MethodSection` wrapping `<details>` |
| Research finding | One new local `EvidenceQuote` — used 4× |
| What to say | One new local `TalkBubble` — used 5× |
| Action checklist | One new local `ActionList` — label + items, used 3× |
| Wallet trio | Reuse `OverviewCard`'s `Donut`/`Legend` if they take static props; otherwise a static SVG. **Check before writing a new one.** |
| Sources accordion | Native `<details>/<summary>`. No JS, no library, works unhydrated |

All live under `src/components/Method/`, matching the existing per-component
folder convention (`Component.tsx`, `Component.styles.ts`, `constants.ts`,
`Component.test.tsx`, `index.ts`).

## Content handling

Copy goes into a `constants.ts` under `src/components/Method/` as a structured
object keyed exactly as in the copy deck (`method.goal.body`,
`method.actions.decide.items`, …), **not** as JSX prose scattered through
components. Two reasons: the 200-line file cap makes long inline prose
impractical, and when i18n lands the catalogue absorbs this object wholesale.

Sources and action items are **data** — arrays rendered by a loop, not
hand-written list items.

Expect `constants.ts` to exceed 200 lines with 66 keys. Split it by section
(`copy/goal.ts`, `copy/actions.ts`, …) re-exported from one barrel rather than
compressing the text.

## RTL / mobile

RTL-first and mobile-first; nothing here changes that. Two things to watch:

- **Tables.** Section 4's example table is the only table in the app so far. It
  must scroll inside its own container rather than making the page scroll
  horizontally on a narrow phone.
- **Latin text inside RTL.** Author names and URLs in the sources list are LTR
  runs inside RTL paragraphs. Wrap them so punctuation doesn't jump.

## Testing

Per the existing layers — unit tests colocated, driver classes e2e-only.

- Unit: all six sections plus the opener render; sources render one entry per
  source; every `<details>` is closed on first render.
- Unit: the copy constants export every key the components consume (guards
  against a key typo silently rendering nothing).
- Unit: `ActionList` renders ticked and unticked states distinctly.
- e2e: the menu link navigates to `/method`; visual snapshot at mobile width.

No test asserts on prose content — copy will change.

## Deliberate simplifications

- `<details>` over a JS accordion. Native, accessible, zero bytes.
- No anchor links or table of contents. Six closed sections on a phone is a
  list, not a navigation problem.
- No analytics. Add when there's a question it would answer.

## Open questions, deferred not forgotten

- **Section 3 is closed by default** and it is the rule the method rests on. A
  skimming parent may never open it. Mitigated by the `הכי חשוב` chip; revisit
  if it turns out to go unread.
- **Section 4 is long when expanded** — six paragraphs, a quote, two checklists
  and a table. Splitting it into "מה להחליט" and "הדוגמה שלנו" is the fallback
  if it feels heavy in the real app.
- **Section 6 recommends handing over physical cash** and using the app as a
  ledger, because the pain-of-paying literature says a screen has less friction
  than coins (research §11). That is an honest limitation that partly argues
  against the product. Shipping it anyway: credibility is worth more than the
  claim it undercuts. Revisit if the spending wallet becomes a real payment
  instrument.
