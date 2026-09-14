# The Method page — design

> Status: **approved in chat 2026-09-14**, not yet implemented.
> Copy: `docs/copy/method-page.he.md` (shipping) · `method-page.en.md` (parked).
> Evidence: `docs/research/jar-method.md`.
> Roadmap context: `docs/backlog.md`.

## Purpose

A parent-facing page that explains **why** fun-saver splits money into three
wallets, and **which six rules a family has to set** for the method to work at
all. It is the answer to "what is this app actually for", and it is where the
non-obvious rules live — pay on a fixed day, don't tie it to chores, don't
refill mid-week.

## Scope

**In:** one static, read-only route. Hebrew only. Content from the approved
copy deck. A collapsible sources section.

**Out (deliberate):**
- Does **not** write anything to an account. No allowance amount, payday or
  split is configured here. A setup wizard is roadmap item #8 — the section
  order is designed so section 4 can later become interactive without moving
  anything else.
- Does **not** ship English. The app has no i18n system; see `backlog.md` §2.
  The English copy already exists so that task is wiring, not translation.
- No child-facing view. This page is for the parent.

## Route and entry point

- Route: `src/app/method/page.tsx` — a server component. No client state, no
  data fetching, nothing account-specific.
- Entry: a new item in the burger menu, alongside the existing sections in
  `src/components/Menu/`. It is a navigation link, not a menu section that
  renders inline — follow the existing `MenuLabel` styling so it doesn't look
  bolted on.

## Structure

Six sections in fixed order, then sources. Section numbering is part of the
design — it signals "there's a finite list of things to decide" and makes the
page scannable on a phone.

| # | Section | Note |
| --- | --- | --- |
| 1 | למה לא קופה אחת | Opens with the 72% partitioning result — the strongest fact we have |
| 2 | שלוש הקופות | Three wallet blocks. **Reuse the existing donut** rather than a new illustration |
| 3 | ההבטחה | Visually emphasised — this is the load-bearing rule |
| 4 | מה צריך להחליט | Six sub-decisions + the ₪30 worked example table |
| 5 | מה אומרים לילד | Scripted lines, ❌/✅ pairs |
| 6 | מה השיטה לא עושה | Honest limits. Do not soften this section |
| — | המקורות | Collapsed by default; 16 numbered citations with links |

## Components

Prefer composition of what exists over new primitives.

| Need | Approach |
| --- | --- |
| Page chrome | Existing `Screen` + `Header` |
| Section heading + body | One new local `MethodSection` — heading, optional number, children |
| Pull-quote for a research finding | One new local `EvidenceQuote` — distinct background, used 6× |
| Wallet explainer trio | Reuse `OverviewCard`'s `Donut`/`Legend` if they can take static props; otherwise a static SVG. **Check before writing a new one.** |
| Script lines (❌/✅) | Plain markup inside `MethodSection`; not worth a component |
| Sources accordion | Native `<details>/<summary>`. No JS, no library, works without hydration |

`EvidenceQuote` and `MethodSection` live under
`src/components/Method/`, matching the existing per-component folder
convention (`Component.tsx`, `Component.styles.ts`, `constants.ts`,
`Component.test.tsx`).

## Content handling

Copy goes into a `constants.ts` under `src/components/Method/` as a structured
object keyed exactly as in the copy deck (`method.why.body` etc.), **not** as
JSX prose scattered through components. Two reasons: the 200-line file cap
makes long inline prose impractical, and when i18n lands the catalogue can
absorb this object wholesale.

The sources list is data — an array of `{ id, claim, citation, url }` —
rendered by a loop, not 16 hand-written list items.

## RTL / mobile

The app is RTL-first and mobile-first; nothing here changes that. Two things to
watch:

- **Tables.** Sections 4 and the worked example use tables — the only tables in
  the app so far. They must scroll inside their own container rather than
  making the page scroll horizontally on a narrow phone.
- **Latin text inside RTL.** Author names and URLs in the sources list are LTR
  runs inside an RTL paragraph. Wrap them so punctuation doesn't jump.

## Testing

Per `docs/HANDOFF.md` and the existing layers — unit tests colocated, driver
classes are e2e-only.

- Unit: `Method.test.tsx` — all six sections render; the sources list renders
  one entry per source; `<details>` is closed by default.
- Unit: the copy constants export every key the components consume (guards
  against a key typo silently rendering nothing).
- e2e: the menu link navigates to `/method`; a visual snapshot at mobile width.

No test asserts on prose content — copy will change.

## Deliberate simplifications

- `<details>` over a JS accordion. Native, accessible, zero bytes.
- No anchor links / table of contents. Six sections on a phone is a scroll, not
  a navigation problem. Add if the page grows.
- No analytics on the page. Add when there's a question it would answer.

## Open question, deferred not forgotten

Section 6 tells the parent to hand over the spending money **as physical
cash** and use the app as a ledger — because the pain-of-paying literature says
a screen has less friction than coins (research §11). That is an honest
limitation of the product, and it partly argues against the product. We are
shipping it anyway because credibility is worth more than the claim it
undercuts. Revisit if the spending wallet ever becomes a real payment
instrument.
