Start here, cold session, in this worktree:
`/Users/technotronic/Projects/technotronic/fun-saver-home-overview` (branch `feat/home-overview`, off `origin/main`).

Read `.plans/2026-09-12-home-overview-redesign.md` — it is the agreed plan for redesigning the main screen
(total moves out of the header into a donut ring; savings stops being a hero and becomes the first of three
uniform wallet rows; interest shown as numbers in half-shekel steps instead of drawn coins). Open
`mockups/home-overview.html` in a browser — that mockup is the spec, not a suggestion.

The plan is sliced into 4 independently shippable PRs. Work **PR 1 only** this session:
`halfShekelAmount` in `src/lib/money.ts`, with `coinBreakdown` rewritten on top of it.

Follow `CLAUDE.md` exactly: fresh branch off updated `origin/main` for the PR, production code first, stop for
my approval, commit, then tests one at a time with approval between each. Do not start PR 2.

Tick the PR 1 box in the plan's Progress section when it lands.
