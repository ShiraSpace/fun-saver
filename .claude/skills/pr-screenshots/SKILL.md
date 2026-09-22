---
name: pr-screenshots
description: Use when opening or updating a fun-saver pull request whose diff changes anything visible in the app — a component, a `.styles.ts`, a theme token, copy. Drives the real app with the e2e harness, shoots the changed screens at phone size, and attaches them to the PR body with `gh --attach`. Every UI PR in this repo carries screenshots.
---

# PR screenshots

A reviewer should see the change before reading the diff. Every PR that alters
something visible carries at least one screenshot of the state it changed.

Skip only when the diff touches nothing a user can see — `src/lib`, `src/db`,
API routes, tests, docs, config.

## 1. Write the shot script

One file per PR, in `e2e/shots/` (gitignored, so it never reaches the branch).
It **must** be `.mts` — `withShots` is called with top-level `await` and tsx
loads `.ts` as CommonJS.

The scripts are deliberately not committed: they are throwaway, and a stale one
left behind reddens `tsc` on every later branch. The cost is that a reviewer
cannot re-shoot your screens, so paste the script into the PR body under the
images when the states are anything but obvious, and delete the file once the
PR is up.

```ts
// e2e/shots/<topic>.shot.mts
import { mockAccount, mockSecondAccount, mockTransactions } from '@/test-utils/fixtures';
import { withShots } from '../shot';

await withShots(
  { accounts: [mockAccount, mockSecondAccount], transactions: mockTransactions },
  async (app, shoot) => {
    await app.menu.open();
    await shoot('picker-shut');

    await app.menu.openAccountPicker();
    await shoot('picker-open');
  }
);
```

`withShots` boots a built server on a free port, seeds a fresh store, signs in
as `mockUser`, and opens a 402×874 page at `deviceScaleFactor: 2`. `app` is the
same `AppDriver` the visual suites use — `menu`, `header`, `dashboard`,
`createAccount`, `editAccount`, `avatarPicker`, `emptyState`, `session`. Reach
for a driver method before writing a raw selector; add one to the driver if it
is missing, the way a visual test would.

Seed `transactions: mockTransactions` whenever a balance is on screen —
without it every total reads `₪0` and the screenshot misrepresents the app.

## 2. Shoot

```bash
npx next build
npx tsx e2e/shots/<topic>.shot.mts
```

The build is required: the harness runs `next start`. Rebuild after every code
change, or you will shoot the previous version. PNGs land in `e2e/shots/out/`.

**Always open each PNG and look at it** before attaching. A shot of the wrong
screen, a half-finished animation, or a `₪0` total is worse than no shot.

## 3. Before/after

Worth it when the PR changes existing UI rather than adding new UI.

For a single-property change, revert just that property, shoot, and put it
back — far faster than any branch dance, and there is nothing to forget:

```bash
# edit the one line back to its old value
npx next build && npx tsx e2e/shots/<topic>.shot.mts
mv e2e/shots/out/<name>.png e2e/shots/out/before-<name>.png
git checkout -- <the file you edited>
npx next build   # rebuild, or every later shot is the "before"
```

For a wider change, shoot the base in a second worktree so this one is never
disturbed:

```bash
git worktree add ../shot-base origin/main
cp e2e/shots/<topic>.shot.mts ../shot-base/e2e/shots/
# in ../shot-base: npx next build && npx tsx e2e/shots/<topic>.shot.mts
git worktree remove ../shot-base
```

Never `git stash` for this. The stash stack is shared with every other
worktree and session on the machine, and a recipe that stashes is a recipe
someone forgets to unstash.

## 4. Attach

`gh` uploads media natively since v2.99.0 — no extension needed.

```bash
rtk proxy gh pr edit <number> --body-file body.md \
  --attach 'e2e/shots/out/before-picker-open.png#before: the list pushes the sections down' \
  --attach 'e2e/shots/out/picker-open.png#after: the list floats over them'
```

Put the markdown in the body file where you want the images to appear:

```markdown
| before | after |
| --- | --- |
| ![before](e2e/shots/out/before-picker-open.png) | ![after](e2e/shots/out/picker-open.png) |
```

`gh` rewrites each local path in place to the uploaded `user-attachments` URL.
Without a reference in the body, attachments are appended at the end instead.

Text after `#` is the alt text. Write it as what the reviewer should notice,
not as a filename. Up to 50 files per command, 10 MB per image.

`.github/pull_request_template.md` carries the Screenshots section that every
PR is expected to fill. Passing `--body-file` replaces the template wholesale,
so keep the section yourself when you write a body.

Run `gh` through `rtk proxy` — the RTK hook otherwise returns invented output
for `gh` commands.
