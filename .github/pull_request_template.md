One or two lines on what was wrong.

One paragraph on what this does about it.

## Screenshots

Required whenever the diff changes anything a user can see — a component, a
`.styles.ts`, a theme token, copy. Before/after when this changes existing UI.
See the `pr-screenshots` skill; `gh pr edit <n> --attach shot.png` uploads them.

Delete this section only if nothing visible changed.

## Review notes

Only where a reviewer would otherwise question or wrongly "fix" something in
the diff. Usually none.

## Test plan

One action and its expected result per line, runnable by someone who has not
read the diff. Not "tests pass".
