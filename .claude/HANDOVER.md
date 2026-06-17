# Handover — 2026-06-17

## What shipped

- 2006ee7 chore: capture brainstorm artifacts — palette spec, home mockup, inspiration

## In flight

- fun-saver brainstorm: Section 1 (Domain Model + Store interface) presented in chat —
  awaiting user "looks right?" answer. Remaining sections: API surface, frontend
  architecture, interest math + display rules, testing, migration path. Then write spec
  to `docs/superpowers/specs/2026-06-17-fun-saver-design.md` and hand off to writing-plans
  skill. Tasks #5–#9 still pending.

## Watch-outs

- Architecture chosen: **API-first** (`/api/...` routes + React Query), NOT Server Actions
- Only **savings** has interest in MVP; spending + good_deeds rate = 0
- Display rule: numbers rounded to nearest half-shekel; ₪ lower-left of number (40% size,
  opacity 0.65, top:0.35em). One coin design: full silver disc or D-half (no "½" text)
- `git push` to GitHub needed `http.postBuffer=524288000` one-shot override to succeed
  (HTTP 400 otherwise). Don't be alarmed if it recurs — same workaround
- `.superpowers/` is gitignored; brainstorm scratch lives there. Visual companion server
  auto-exits after 30 min idle. Restart via `superpowers/brainstorming/scripts/start-server.sh`
- User switched language mid-session to **English** — continue in English

## Open questions

- Domain model approval (Section 1) — once answered, advance through sections 2–6, write
  the spec, run spec self-review, request user review, then transition to writing-plans
