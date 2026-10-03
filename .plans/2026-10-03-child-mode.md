# Child Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A view-only child screen per account (savings first, then spending and good deeds, in whole shekels) and a child menu. The parent turns it on from the menu, and it is saved on the account.

**Architecture:** A new `accounts.view_mode` column (`APP_VIEW_MODE`) travels with the account row that every page already loads, so `Home` and `MenuContent` branch on `currentAccount.viewMode` with no new props and no cookie. A thin `PUT /api/accounts/[id]/view-mode` route saves it, copying the theme route. The child screens reuse `Header`, `Money`, `Avatar` and `AppearanceSection`.

**Tech Stack:** Next.js 16 App Router, React, Emotion, Jest + RTL, Postgres (Neon), puppeteer `node:test` e2e.

**Spec:** `docs/superpowers/specs/2026-10-03-child-mode-design.md`. Mockup: `mockups/child-mode.html`, screen 1 and menus 2a and 2b.

## Global Constraints

- **Workflow (CLAUDE.md overrides TDD):** each task goes production code → STOP for review → commit on "commit" → first ≤3 tests → STOP → the remaining tests → commit on "commit tests". Watch every test fail against its own deliberate break (snapshot with `cp`, break, run, restore, `cmp`).
- No commits, pushes or migrations without explicit approval. Never force-push.
- No code comments. Single quotes, named exports only, explicit return types, ≤200 lines per file and ≤40 per function. Never squeeze under a limit with whitespace.
- Styles go in `<Component>.styles.ts` with literal values inline, with no `*_STYLE` object. Colours and type sizes come from `theme.*`.
- Copy and test IDs go in each component's `constants.ts` (`*_COPY`, `*_TEST_IDS`).
- Names come from `docs/glossary.md`. Names in this plan are proposals; re-check each one when implementing, and ask if in doubt.
- Tests: the scenario goes in `describe` plus `beforeEach`, with one `expect` per `it`. Name tests in domain language. Stand-ins take a `mock` prefix. Shared mocks live in `src/test-utils/mocks/<domain>.mocks.ts`. Driver classes are e2e-only.
- The view-mode values are always `APP_VIEW_MODE.parent` / `APP_VIEW_MODE.child`, never a bare string. The SQL default and CHECK are the only literals.
- Child amounts are whole shekels, **rounded down** (`floorToShekels`).
- `rtk` output isn't trusted for facts. Use `./node_modules/.bin/<tool>` and `rtk proxy git …`.
- **Fresh worktree setup (once, before Task 1):** run `npm install`, and copy `.env.local` from `../fun-saver/.env.local`.

## Review Focus

1. **Stored mode not in the enum** (an old JSON-store account with no `viewMode`, or a manual DB edit) → the account shows the parent view. Pinned in Task 1 (`resolveAppViewMode`) and Task 2 (`accountFromRow`).
2. **Withdrawals larger than deposits** (interest is more than the balance) → "הפקדת" shows ₪0, never negative, and the tiles still add up. Pinned in Task 1.
3. **Save fails while switching** (offline, 403) → the view stays the same and an error shows. Pinned in Task 5.
4. **A child opens `/transactions` or `/method` by URL** → the menu there is the child menu. Pinned in Task 6.
5. **A sibling's account** → turning child mode on for one account leaves the other in parent view. Pinned in Task 2 (memory store).

---

## File map

| File | Responsibility |
| --- | --- |
| `src/lib/account/view-mode.ts` (new) | `APP_VIEW_MODE`, `AppViewMode`, `isAppViewMode`, `resolveAppViewMode`, `isChildView` |
| `src/lib/money.ts` | `floorToShekels` |
| `src/lib/wallet/savings-in-whole-shekels.ts` (new) | splits savings into the shekels the child put in and the shekels interest earned |
| `docs/glossary.md` | three new rows |
| `src/lib/account/types.ts`, `accounts-store.ts` | `Account.viewMode`; new accounts start as parent |
| `src/db/schema.sql`, `rows.ts`, `data-store.ts`, `repository-store.ts`, `*/accounts.ts` | column, mapping, `setAccountViewMode` |
| `src/app/api/accounts/[id]/view-mode/route.ts` (new), `src/app/api/constants.ts` | thin PUT |
| `src/components/ChildAccount/` (new) | child home: `ChildAccount`, `ChildSavings`, `ChildWallet` |
| `src/components/Money/Money.tsx` | `roundDown` prop |
| `src/components/Home/Home.tsx` | picks `ChildAccount` or `Account` |
| `src/components/Menu/ViewModeSwitch/` (new) | the switch and `useAccountViewMode` |
| `src/components/Menu/ChildMenuContent/` (new) | child menu |
| `src/components/Menu/MenuContent/MenuContent.tsx` | picks the child or parent menu; the parent gets the switch |
| `e2e/child-view.e2e.ts`, `e2e/driver/child-account-driver.ts` (new), `menu-driver.ts` | browser proof |

---
### Task 1: The words — view mode, whole shekels for a child, the savings split

**Files:**
- Create: `src/lib/account/view-mode.ts`
- Create: `src/lib/wallet/savings-in-whole-shekels.ts`
- Modify: `src/lib/money.ts` (add after `agorotToWholeShekels`)
- Modify: `docs/glossary.md` (Terms table)
- Test: `src/lib/account/__tests__/view-mode.test.ts`, `src/lib/__tests__/money.test.ts`, `src/lib/wallet/__tests__/savings-in-whole-shekels.test.ts`

**Interfaces:**
- Produces: `APP_VIEW_MODE`, `type AppViewMode`, `isAppViewMode(value: unknown): value is AppViewMode`, `resolveAppViewMode(stored: string | undefined): AppViewMode`, `isChildView(account: Pick<Account, 'viewMode'>): boolean`, `floorToShekels(agorot: number): number`, `savingsInWholeShekels(savings: Pick<WalletSummary, 'balance' | 'interestEarned'>): SavingsInWholeShekels`, `interface SavingsInWholeShekels { balanceShekels; principalShekels; interestEarnedShekels }`.

- [ ] **Step 1: Production code**

`src/lib/account/view-mode.ts`. It imports `Account` as a type only, and `viewMode` is added to `Account` in Task 2. Until then, type the parameter as `{ viewMode?: AppViewMode }` and switch it to `Pick<Account, 'viewMode'>` in Task 2.

```ts
export const APP_VIEW_MODE = {
  parent: 'parent',
  child: 'child',
} as const;

export type AppViewMode = (typeof APP_VIEW_MODE)[keyof typeof APP_VIEW_MODE];

const APP_VIEW_MODES: readonly string[] = Object.values(APP_VIEW_MODE);

export function isAppViewMode(value: unknown): value is AppViewMode {
  return typeof value === 'string' && APP_VIEW_MODES.includes(value);
}

export function resolveAppViewMode(stored: string | undefined): AppViewMode {
  return isAppViewMode(stored) ? stored : APP_VIEW_MODE.parent;
}

export function isChildView(account: { viewMode?: AppViewMode }): boolean {
  return account.viewMode === APP_VIEW_MODE.child;
}
```

`src/lib/money.ts`, after `agorotToWholeShekels`:

```ts
export function floorToShekels(agorot: number): number {
  return Math.floor(agorot / AGOROT_PER_SHEKEL);
}
```

`src/lib/wallet/savings-in-whole-shekels.ts`:

```ts
import { floorToShekels } from '@/lib/money';
import type { WalletSummary } from './types';

export interface SavingsInWholeShekels {
  balanceShekels: number;
  principalShekels: number;
  interestEarnedShekels: number;
}

export function savingsInWholeShekels(
  savings: Pick<WalletSummary, 'balance' | 'interestEarned'>
): SavingsInWholeShekels {
  const balanceShekels = floorToShekels(savings.balance);
  const interestEarnedShekels = Math.min(
    floorToShekels(savings.interestEarned),
    balanceShekels
  );

  return {
    balanceShekels,
    principalShekels: balanceShekels - interestEarnedShekels,
    interestEarnedShekels,
  };
}
```

`docs/glossary.md`: add these rows to Terms, after "The account being viewed":

```md
| Which screen the account is shown in | מצב ילד · מצב הורה             | `AppViewMode`: `APP_VIEW_MODE.parent`, `APP_VIEW_MODE.child`; column `view_mode` | `AppMode` (viewing/creating/editing), childView    |
| Whole shekels, never more than there is | ₪                           | `floorToShekels`                                                          | rounding to nearest on a child's screen             |
| Savings as the child sees it         | הפקדת · הרוויח לבד             | `savingsInWholeShekels`: `principalShekels`, `interestEarnedShekels`      | deposited, gain                                     |
```

Run: `./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/eslint src/lib docs`. Expected: clean.

- [ ] **Step 2: STOP.** Show the diff and wait for review, then "commit".

```bash
rtk proxy git add src/lib/account/view-mode.ts src/lib/money.ts src/lib/wallet/savings-in-whole-shekels.ts docs/glossary.md
rtk proxy git commit -m "feat(child-mode): the words for a child's screen and its whole-shekel savings"
```

- [ ] **Step 3: First three tests**, in `src/lib/wallet/__tests__/savings-in-whole-shekels.test.ts`:

```ts
import { savingsInWholeShekels } from '../savings-in-whole-shekels';

describe('savingsInWholeShekels', () => {
  describe('savings of ₪148.90, ₪6.40 of it interest', () => {
    const mockSavings = { balance: 14890, interestEarned: 640 };

    it('shows the balance without the agorot the child cannot count yet', () => {
      expect(savingsInWholeShekels(mockSavings).balanceShekels).toBe(148);
    });

    it('shows what the money earned by itself in whole shekels', () => {
      expect(savingsInWholeShekels(mockSavings).interestEarnedShekels).toBe(6);
    });

  });

  describe('savings of ₪148.50, ₪6.90 of it interest', () => {
    it('shows what the child put in as the rest, so the two add up to the balance', () => {
      expect(
        savingsInWholeShekels({ balance: 14850, interestEarned: 690 })
          .principalShekels
      ).toBe(142);
    });
  });
});
```

Break-watch each one, reading which test reddens:
1. In `floorToShekels`, change `Math.floor` to `Math.round`. The balance test reddens (149).
2. Return `floorToShekels(savings.balance)` as `interestEarnedShekels`. The earned test reddens.
3. Compute `principalShekels` as `floorToShekels(savings.balance - savings.interestEarned)`. The put-in test reddens (141, not 142). That is why it has its own fixture: ₪148.90/₪6.40 gives 142 either way.

Run: `./node_modules/.bin/jest src/lib/wallet/__tests__/savings-in-whole-shekels.test.ts`.

- [ ] **Step 4: STOP** for test review.

- [ ] **Step 5: Remaining tests**, each watched failing:

Append to `savings-in-whole-shekels.test.ts`:

```ts
  describe('withdrawals took more than was deposited, so interest is more than the balance', () => {
    const mockSavings = { balance: 300, interestEarned: 500 };

    it('never shows a negative amount put in', () => {
      expect(savingsInWholeShekels(mockSavings).principalShekels).toBe(0);
    });

    it('counts the whole balance as earned, so the tiles still add up', () => {
      expect(savingsInWholeShekels(mockSavings).interestEarnedShekels).toBe(3);
    });
  });

  describe('savings that have not earned interest yet', () => {
    it('shows nothing earned', () => {
      expect(
        savingsInWholeShekels({ balance: 1200, interestEarned: 0 })
          .interestEarnedShekels
      ).toBe(0);
    });
  });
```

`src/lib/__tests__/money.test.ts`: add `floorToShekels` to the import and append:

```ts
describe('floorToShekels', () => {
  it('drops agorot rather than rounding up to money that is not there', () => {
    expect(floorToShekels(2399)).toBe(23);
  });

  it('keeps an exact shekel amount', () => {
    expect(floorToShekels(2300)).toBe(23);
  });

  it('shows less than a shekel as nothing', () => {
    expect(floorToShekels(99)).toBe(0);
  });
});
```

`src/lib/account/__tests__/view-mode.test.ts`:

```ts
import {
  APP_VIEW_MODE,
  isChildView,
  resolveAppViewMode,
} from '../view-mode';

describe('resolveAppViewMode', () => {
  it('keeps a stored child view', () => {
    expect(resolveAppViewMode(APP_VIEW_MODE.child)).toBe(APP_VIEW_MODE.child);
  });

  it('shows an account with no stored view the parent screen', () => {
    expect(resolveAppViewMode(undefined)).toBe(APP_VIEW_MODE.parent);
  });

  it('shows an account with an unknown stored view the parent screen', () => {
    expect(resolveAppViewMode('toddler')).toBe(APP_VIEW_MODE.parent);
  });
});

describe('isChildView', () => {
  it('is true for an account in child view', () => {
    expect(isChildView({ viewMode: APP_VIEW_MODE.child })).toBe(true);
  });

  it('is false for an account in parent view', () => {
    expect(isChildView({ viewMode: APP_VIEW_MODE.parent })).toBe(false);
  });
});
```

Run: `./node_modules/.bin/jest src/lib`. Expected: all pass.

- [ ] **Step 6: STOP**, then on "commit tests":

```bash
rtk proxy git add src/lib/__tests__/money.test.ts src/lib/account/__tests__/view-mode.test.ts src/lib/wallet/__tests__/savings-in-whole-shekels.test.ts
rtk proxy git commit -m "test(child-mode): whole shekels and the savings split"
```

---
### Task 2: The account remembers its view mode

**Files:**
- Modify: `src/lib/account/types.ts` (`Account`), `src/lib/account/view-mode.ts` (`isChildView` param), `src/lib/account/accounts-store.ts:28-35`
- Modify: `src/db/schema.sql` (after the `accounts` CREATE), `src/db/rows.ts`, `src/db/data-store.ts`, `src/db/repository-store.ts`
- Modify: `src/db/memory-store/accounts.ts`, `src/db/json-file-store/accounts.ts`, `src/db/postgres-store/accounts.ts`
- Modify: `src/test-utils/mocks/account.mocks.ts` (`createMockAccount`)
- Test: `src/db/memory-store/__tests__/accounts.test.ts`, `src/db/json-file-store/__tests__/accounts.test.ts`, `src/db/__tests__/rows.test.ts`, `src/lib/account/__tests__/accounts-store.test.ts`, `src/db/postgres-store/__tests__/accounts.e2e.ts`

**Interfaces:**
- Consumes: `APP_VIEW_MODE`, `AppViewMode`, `resolveAppViewMode` (Task 1).
- Produces: `Account.viewMode: AppViewMode`; `DataStore.setAccountViewMode(id: string, viewMode: AppViewMode): Promise<Account | undefined>`; `AccountRepository.setViewMode(id, viewMode)`; `isChildView(account: Pick<Account, 'viewMode'>): boolean`.

- [ ] **Step 1: Production code**

`src/lib/account/types.ts`: add `import type { AppViewMode } from './view-mode';` and, in `Account` after `themeId`:

```ts
  viewMode: AppViewMode;
```

`src/lib/account/view-mode.ts`: add `import type { Account } from './types';`, then change the param to `account: Pick<Account, 'viewMode'>`.

`src/lib/account/accounts-store.ts`, in `createAccount` after `themeId: DEFAULT_THEME_ID,`:

```ts
      viewMode: APP_VIEW_MODE.parent,
```

(import `APP_VIEW_MODE` from `./view-mode`).

`src/db/schema.sql`, right after the `CREATE TABLE IF NOT EXISTS accounts (...)` block. The replay is idempotent, and the default must match `APP_VIEW_MODE.parent`:

```sql
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS view_mode TEXT NOT NULL DEFAULT 'parent'
  CHECK (view_mode IN ('parent', 'child'));
```

`src/db/rows.ts`: add `view_mode: string;` to `AccountRow` after `theme_id`, and in `accountFromRow` after `themeId`:

```ts
    viewMode: resolveAppViewMode(row.view_mode),
```

(import `resolveAppViewMode` from `@/lib/account/view-mode`).

`src/db/data-store.ts`: import `type AppViewMode`. In `AccountRepository`, after `setTheme`:

```ts
  setViewMode(id: string, viewMode: AppViewMode): Promise<Account | undefined>;
```

In `DataStore`, after `setAccountTheme`:

```ts
  setAccountViewMode(
    id: string,
    viewMode: AppViewMode
  ): Promise<Account | undefined>;
```

`src/db/repository-store.ts`, after `setAccountTheme`:

```ts
  setAccountViewMode(
    id: string,
    viewMode: AppViewMode
  ): Promise<Account | undefined> {
    return this.accounts.setViewMode(id, viewMode);
  }
```

`src/db/memory-store/accounts.ts`, after `setTheme`:

```ts
  async setViewMode(
    id: string,
    viewMode: AppViewMode
  ): Promise<Account | undefined> {
    const account = this.find(id);

    if (!account) {
      return;
    }

    account.viewMode = viewMode;

    return account;
  }
```

`src/db/json-file-store/accounts.ts`, after `setTheme`:

```ts
  setViewMode(id: string, viewMode: AppViewMode): Promise<Account | undefined> {
    return this.session.write(
      async (contents, save): Promise<Account | undefined> => {
        const account = findAccount(contents, id);

        if (!account) {
          return;
        }

        account.viewMode = viewMode;
        await save();

        return account;
      }
    );
  }
```

If `setTheme` and `setViewMode` push the file over 200 lines, or ESLint flags the duplication, extract one private `setColumn<Key extends 'themeId' | 'viewMode'>(id, key, value)` that both call. Do this in all three repositories so they stay alike. Do **not** collapse lines.

`src/db/postgres-store/accounts.ts`: add `view_mode` to the INSERT column list and `${account.viewMode},` to the values after `${account.themeId},`. After `setTheme`:

```ts
  async setViewMode(
    id: string,
    viewMode: AppViewMode
  ): Promise<Account | undefined> {
    const rows = await this.query(
      'UPDATE accounts SET view_mode = $1 WHERE id = $2 RETURNING *',
      [viewMode, id]
    );

    return rows[0] ? accountFromRow(rows[0]) : undefined;
  }
```

`src/test-utils/mocks/account.mocks.ts`, in `createMockAccount` after `themeId`:

```ts
    viewMode: APP_VIEW_MODE.parent,
```

Run: `./node_modules/.bin/tsc --noEmit` (it lists every `Account` literal that still needs `viewMode`; fix each one at its source, and add `view_mode` to `mockAccountRow` in `rows.test.ts`), then `./node_modules/.bin/eslint src`, then `./node_modules/.bin/jest`. Expected: clean, and the existing tests still pass.

- [ ] **Step 2: Do NOT migrate.** `npm run db:migrate` targets **production** (`DATABASE_URL`). The controller runs `npm run db:migrate-test` (and `db:migrate-dev` for the local app) once the user has confirmed. Skip `npm run test:db` until the controller says the test branch is migrated.

- [ ] **Step 3: STOP** for review, then on "commit":

```bash
rtk proxy git add src/lib/account src/db src/test-utils/mocks/account.mocks.ts
rtk proxy git commit -m "feat(child-mode): an account remembers which screen it is shown in"
```

- [ ] **Step 4: First three tests**, in `src/db/memory-store/__tests__/accounts.test.ts`, inside `describe('InMemoryStore accounts')` (`store` is already created in its `beforeEach`):

```ts
  describe('a parent turns child view on for one of two children', () => {
    beforeEach(async () => {
      await store.insertAccount(createMockAccount());
      await store.insertAccount(mockSiblingAccount);
      await store.setAccountViewMode(mockAccount.id, APP_VIEW_MODE.child);
    });

    it('shows that child the child screen', async () => {
      expect((await store.getAccount(mockAccount.id))?.viewMode).toBe(
        APP_VIEW_MODE.child
      );
    });

    it('leaves the sibling on the parent screen', async () => {
      expect((await store.getAccount(mockSiblingAccount.id))?.viewMode).toBe(
        APP_VIEW_MODE.parent
      );
    });
  });

  it('ignores a view change for an account that does not exist', async () => {
    expect(
      await store.setAccountViewMode('missing', APP_VIEW_MODE.child)
    ).toBeUndefined();
  });
```

Break-watch: (1) remove `account.viewMode = viewMode;`, and the first test reddens; (2) set `viewMode` on every account in `this.accounts`, and the sibling test reddens; (3) return `this.accounts[0]` when the account isn't found, and the missing-account test reddens.

- [ ] **Step 5: STOP** for test review.

- [ ] **Step 6: Remaining tests**, each watched failing:

`src/db/json-file-store/__tests__/accounts.test.ts`, next to the theme test:

```ts
  it('remembers child view across instances', async () => {
    await new JsonFileStore(file.path).insertAccount(mockAccount);
    await new JsonFileStore(file.path).setAccountViewMode(
      mockAccount.id,
      APP_VIEW_MODE.child
    );

    expect(
      (await new JsonFileStore(file.path).getAccount(mockAccount.id))?.viewMode
    ).toBe(APP_VIEW_MODE.child);
  });
```

`src/db/__tests__/rows.test.ts`:

```ts
describe('accountFromRow view mode', () => {
  it('reads a stored child view', () => {
    expect(
      accountFromRow({ ...mockAccountRow, view_mode: APP_VIEW_MODE.child })
        .viewMode
    ).toBe(APP_VIEW_MODE.child);
  });

  it('shows an unknown stored view as the parent screen', () => {
    expect(
      accountFromRow({ ...mockAccountRow, view_mode: 'toddler' }).viewMode
    ).toBe(APP_VIEW_MODE.parent);
  });
});
```

`src/lib/account/__tests__/accounts-store.test.ts`:

```ts
  it('opens a new account on the parent screen', () => {
    expect(account.viewMode).toBe(APP_VIEW_MODE.parent);
  });
```

`src/db/postgres-store/__tests__/accounts.e2e.ts` (live Neon, `npm run test:db`):

```ts
  describe('view mode', () => {
    it('saves child view and reads it back', async () => {
      const mockAccount = createMockAccount({ id: accountId('view-mode') });
      await store.insertAccount(mockAccount);
      await store.setAccountViewMode(mockAccount.id, APP_VIEW_MODE.child);

      expect((await store.getAccount(mockAccount.id))?.viewMode).toBe(
        APP_VIEW_MODE.child
      );
    });

    it('opens an inserted account on the parent screen', async () => {
      const mockAccount = createMockAccount({ id: accountId('view-default') });
      await store.insertAccount(mockAccount);

      expect((await store.getAccount(mockAccount.id))?.viewMode).toBe(
        APP_VIEW_MODE.parent
      );
    });
  });
```

Run: `./node_modules/.bin/jest src/db src/lib/account`, then `npm run test:db`.

- [ ] **Step 7: STOP**, then on "commit tests":

```bash
rtk proxy git add src/db src/lib/account/__tests__
rtk proxy git commit -m "test(child-mode): the account keeps its view mode in every store"
```

---
### Task 3: Saving the view mode — `PUT /api/accounts/[id]/view-mode`

**Files:**
- Create: `src/app/api/accounts/[id]/view-mode/route.ts`
- Modify: `src/app/api/constants.ts` (`API_ERRORS`)
- Test: `src/app/api/accounts/[id]/view-mode/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `isAppViewMode` (Task 1), `getStore().setAccountViewMode` (Task 2), `withAccountEditor` (existing, `src/app/api/accounts/[id]/with-account-editor.ts`).
- Produces: `PUT` taking body `{ viewMode: AppViewMode }`. Responses: 200 with the updated `Account`; 400 `{ error: API_ERRORS.invalidViewModeRequest | API_ERRORS.unknownViewMode }`; 403 for a stranger or a missing account (from `withAccountEditor`).

- [ ] **Step 1: Production code**

`src/app/api/constants.ts`, in `API_ERRORS` after `unknownTheme`:

```ts
  invalidViewModeRequest: 'invalid view mode request',
  unknownViewMode: 'unknown view mode',
```

`src/app/api/accounts/[id]/view-mode/route.ts`. This is the theme route with the theme swapped out:

```ts
import { getStore } from '@/db';
import { asObject } from '@/lib/json-object';
import { isAppViewMode } from '@/lib/account/view-mode';
import { jsonBody } from '@/app/api/json-body';
import { API_ERRORS } from '@/app/api/constants';
import { accountNotFound, badRequest } from '@/app/api/responses';
import { withAccountEditor } from '../with-account-editor';

export const PUT = withAccountEditor(async (request, id) => {
  const body = asObject(await jsonBody(request));

  if (!body) {
    return badRequest(API_ERRORS.invalidViewModeRequest);
  }

  if (!isAppViewMode(body.viewMode)) {
    return badRequest(API_ERRORS.unknownViewMode);
  }

  const updated = await getStore().setAccountViewMode(id, body.viewMode);

  if (!updated) {
    return accountNotFound();
  }

  return Response.json(updated);
});
```

Run: `./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/eslint src/app`.

- [ ] **Step 2: STOP** for review, then on "commit":

```bash
rtk proxy git add src/app/api/constants.ts "src/app/api/accounts/[id]/view-mode/route.ts"
rtk proxy git commit -m "feat(child-mode): a parent saves which screen an account is shown in"
```

- [ ] **Step 3: First three tests**, in `src/app/api/accounts/[id]/view-mode/__tests__/route.test.ts`:

```ts
/**
 * @jest-environment node
 */
import { signedInUser } from '@/auth';
import { API_ERRORS } from '@/app/api/constants';
import { APP_VIEW_MODE } from '@/lib/account/view-mode';
import { getStore } from '@/db';
import { mockCoParent, mockUser } from '@/test-utils/mocks/user.mocks';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempStoreEnv } from '@/test-utils/test-utils';
import { PUT } from '../route';

jest.mock('@/auth');

function putViewMode(viewMode: string, id: string): Promise<Response> {
  const request = new Request('http://localhost/api/accounts/x/view-mode', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ viewMode }),
  });

  return PUT(request, { params: Promise.resolve({ id }) });
}

describe('PUT /api/accounts/[id]/view-mode', () => {
  withTempStoreEnv();

  let accountId: string;

  beforeEach(async () => {
    accountId = (await createOwnedAccount(getStore())).id;
    jest.mocked(signedInUser).mockResolvedValue(mockUser);
  });

  describe('a parent turns child view on', () => {
    beforeEach(async () => {
      await putViewMode(APP_VIEW_MODE.child, accountId);
    });

    it('saves child view on the account', async () => {
      expect((await getStore().getAccount(accountId))?.viewMode).toBe(
        APP_VIEW_MODE.child
      );
    });
  });

  describe('a view mode the app does not have', () => {
    let response: Response;

    beforeEach(async () => {
      response = await putViewMode('toddler', accountId);
    });

    it('is refused as a bad request', () => {
      expect(response.status).toBe(400);
    });

    it('says the view mode is unknown', async () => {
      expect((await response.json()).error).toBe(API_ERRORS.unknownViewMode);
    });
  });
});
```

Break-watch: (1) remove the `setAccountViewMode` call and return `Response.json({})`, and the save test reddens; (2) delete the `isAppViewMode` guard, and both bad-request tests redden. For the second one alone, return `badRequest(API_ERRORS.invalidViewModeRequest)` from the guard: only "says the view mode is unknown" reddens.

- [ ] **Step 4: STOP** for test review.

- [ ] **Step 5: Remaining tests**, each watched failing. Append inside the outer `describe`:

```ts
  describe('a parent turns child view on', () => {
    it('answers with the updated account', async () => {
      const response = await putViewMode(APP_VIEW_MODE.child, accountId);

      expect((await response.json()).viewMode).toBe(APP_VIEW_MODE.child);
    });
  });

  describe('a body that is not an object', () => {
    it('says the request is invalid', async () => {
      const request = new Request('http://localhost/api/accounts/x/view-mode', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: '"child"',
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: accountId }),
      });

      expect((await response.json()).error).toBe(
        API_ERRORS.invalidViewModeRequest
      );
    });
  });

  describe('another family\'s parent', () => {
    let response: Response;

    beforeEach(async () => {
      jest.mocked(signedInUser).mockResolvedValue(mockCoParent);
      response = await putViewMode(APP_VIEW_MODE.child, accountId);
    });

    it('is refused', () => {
      expect(response.status).toBe(403);
    });

    it('leaves the account on the parent screen', async () => {
      expect((await getStore().getAccount(accountId))?.viewMode).toBe(
        APP_VIEW_MODE.parent
      );
    });
  });
```

Merge the first block into the existing `'a parent turns child view on'` describe rather than declaring it twice. Run: `./node_modules/.bin/jest "src/app/api/accounts/\[id\]/view-mode"`.

- [ ] **Step 6: STOP**, then on "commit tests":

```bash
rtk proxy git add "src/app/api/accounts/[id]/view-mode/__tests__"
rtk proxy git commit -m "test(child-mode): only a parent of the account can change its screen"
```

---
### Task 4: The child home (mockup screen 1)

**Files:**
- Modify: `src/components/Money/Money.tsx` (`roundDown` prop)
- Create: `src/components/ChildAccount/{ChildAccount.tsx,ChildAccount.styles.ts,constants.ts,index.ts}`
- Create: `src/components/ChildAccount/ChildSavings/{ChildSavings.tsx,ChildSavings.styles.ts,constants.ts,index.ts}`
- Create: `src/components/ChildAccount/ChildWallet/{ChildWallet.tsx,ChildWallet.styles.ts,constants.ts,index.ts}`
- Modify: `src/components/Home/Home.tsx`
- Test: `src/components/ChildAccount/ChildSavings/ChildSavings.test.tsx`, `ChildWallet/ChildWallet.test.tsx`, `ChildAccount.test.tsx`, `src/components/Money/Money.test.tsx`, `src/components/Home/Home.test.tsx`

**Interfaces:**
- Consumes: `floorToShekels`, `shekelsToAgorot` (`src/lib/money.ts`), `savingsInWholeShekels` (Task 1), `isChildView` (Tasks 1–2), `Header`, `Screen`/`Column`, `WALLET_LABEL`, `WALLET_GRADIENT`.
- Produces: `ChildAccount({ account }: { account: AccountSummary })`; `CHILD_ACCOUNT_TEST_IDS.screen`; `CHILD_SAVINGS_TEST_IDS.{balance,principal,interestEarned}`; `CHILD_WALLET_TEST_IDS.{card,balance}`.

- [ ] **Step 1: Production code**

`src/components/Money/Money.tsx`: add the prop `roundDown?: boolean` (default `false`), and choose the shekels like this:

```ts
function shownShekels(
  amountAgorot: number,
  allowHalf: boolean,
  roundDown: boolean
): number {
  if (roundDown) {
    return floorToShekels(amountAgorot);
  }

  return allowHalf
    ? (nearestHalfShekel(amountAgorot) ?? 0)
    : agorotToWholeShekels(amountAgorot);
}
```

`src/components/ChildAccount/ChildSavings/constants.ts`:

```ts
export const CHILD_SAVINGS_TEST_IDS = {
  card: 'child-savings',
  balance: 'child-savings-balance',
  principal: 'child-savings-principal',
  interestEarned: 'child-savings-interest-earned',
} as const;

export const CHILD_SAVINGS_COPY = {
  title: 'החיסכון שלך',
  principal: 'הפקדת',
  interestEarned: '✨ הרוויח לבד',
  earnedSign: '+',
} as const;
```

`ChildSavings.tsx`:

```tsx
'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import { savingsInWholeShekels } from '@/lib/wallet/savings-in-whole-shekels';
import { shekelsToAgorot } from '@/lib/money';
import { Money } from '@/components/Money';
import { CHILD_SAVINGS_COPY, CHILD_SAVINGS_TEST_IDS } from './constants';
import {
  Card,
  Earned,
  Icon,
  Split,
  Tile,
  TileAmount,
  Title,
  Total,
} from './ChildSavings.styles';

interface ChildSavingsProps {
  savings: WalletSummary;
}

export function ChildSavings({ savings }: ChildSavingsProps): JSX.Element {
  const { principalShekels, interestEarnedShekels } =
    savingsInWholeShekels(savings);

  return (
    <Card data-testid={CHILD_SAVINGS_TEST_IDS.card}>
      <Icon>{savings.icon}</Icon>
      <Title>{CHILD_SAVINGS_COPY.title}</Title>
      <Total>
        <Money
          amountAgorot={savings.balance}
          testId={CHILD_SAVINGS_TEST_IDS.balance}
          roundDown
        />
      </Total>
      <Split>
        <Tile>
          {CHILD_SAVINGS_COPY.principal}
          <TileAmount>
            <Money
              amountAgorot={shekelsToAgorot(principalShekels)}
              testId={CHILD_SAVINGS_TEST_IDS.principal}
              fullSizeCurrency
            />
          </TileAmount>
        </Tile>
        <Earned>
          {CHILD_SAVINGS_COPY.interestEarned}
          <TileAmount dir="ltr">
            {CHILD_SAVINGS_COPY.earnedSign}
            <Money
              amountAgorot={shekelsToAgorot(interestEarnedShekels)}
              testId={CHILD_SAVINGS_TEST_IDS.interestEarned}
              fullSizeCurrency
            />
          </TileAmount>
        </Earned>
      </Split>
    </Card>
  );
}
```

`ChildSavings.styles.ts` writes literal values inline. Colours and type sizes come from the theme:

```ts
import styled from '@emotion/styled';

export const Card = styled.section`
  padding: 22px 18px 18px;
  text-align: center;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: 22px;
  box-shadow: 0 5px 0 ${({ theme }): string => theme.shadows.faint};
`;

export const Icon = styled.div`
  width: 72px;
  height: 72px;
  margin: 0 auto 10px;
  display: grid;
  place-items: center;
  font-size: 40px;
  border-radius: 22px;
  background: ${({ theme }): string => theme.gradients.walletSavings};
`;

export const Title = styled.div`
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Total = styled.div`
  margin: 6px 0 4px;
  font-size: ${({ theme }): number => theme.typography.display}px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const Split = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1.5px dashed ${({ theme }): string => theme.colors.divider};
`;

export const Tile = styled.div`
  display: grid;
  gap: 2px;
  padding: 8px 0;
  border-radius: 14px;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textMuted};
  background: ${({ theme }): string => theme.colors.softBg};
`;

export const Earned = styled(Tile)`
  color: ${({ theme }): string => theme.colors.gainText};
  background: ${({ theme }): string => theme.colors.gainSoftBg};
`;

export const TileAmount = styled.span`
  justify-self: center;
  font-size: ${({ theme }): number => theme.typography.title}px;
  color: inherit;
`;
```

`theme.shadows.faint` exists (`src/theme/shadows.ts`). In the "הפקדת" tile, `TileAmount` takes `color: inherit`, so it is `textMuted` there. If the review wants the number in `textStrong`, give `Tile` a `strongAmount` prop rather than a second component.

`src/components/ChildAccount/ChildWallet/constants.ts`:

```ts
import type { WalletName } from '@/lib/wallet/types';

export const CHILD_WALLET_TEST_IDS = {
  card: 'child-wallet',
  balance: 'child-wallet-balance',
} as const;

export const CHILD_WALLET_COPY: Record<Exclude<WalletName, 'savings'>, string> = {
  spending: 'יש לך לבזבז',
  goodDeeds: 'לתת למישהו אחר',
};
```

`ChildWallet.tsx`:

```tsx
'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import { WALLET_LABEL } from '@/lib/wallet/constants';
import { Money } from '@/components/Money';
import { CHILD_WALLET_COPY, CHILD_WALLET_TEST_IDS } from './constants';
import { Amount, Card, Icon, Name, Note } from './ChildWallet.styles';

type ChildWalletName = Exclude<WalletSummary['name'], 'savings'>;

interface ChildWalletProps {
  wallet: WalletSummary & { name: ChildWalletName };
}

export function ChildWallet({ wallet }: ChildWalletProps): JSX.Element {
  return (
    <Card data-testid={CHILD_WALLET_TEST_IDS.card}>
      <Icon walletName={wallet.name}>{wallet.icon}</Icon>
      <Name>
        {WALLET_LABEL[wallet.name]}
        <Note>{CHILD_WALLET_COPY[wallet.name]}</Note>
      </Name>
      <Amount>
        <Money
          amountAgorot={wallet.balance}
          testId={CHILD_WALLET_TEST_IDS.balance}
          roundDown
        />
      </Amount>
    </Card>
  );
}
```

`ChildWallet.styles.ts`:

```ts
import styled from '@emotion/styled';
import type { WalletName } from '@/lib/wallet/types';
import { WALLET_GRADIENT } from '@/theme/wallet-gradient';

export const Card = styled.section`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 92px;
  padding: 14px 16px;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: 22px;
  box-shadow: 0 5px 0 ${({ theme }): string => theme.shadows.faint};
`;

export const Icon = styled.span<{ walletName: WalletName }>`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  font-size: 32px;
  background: ${({ walletName, theme }): string =>
    theme.gradients[WALLET_GRADIENT[walletName]]};
`;

export const Name = styled.span`
  flex: 1;
  text-align: start;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const Note = styled.small`
  display: block;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 500;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Amount = styled.span`
  font-size: ${({ theme }): number => theme.typography.amount}px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textStrong};
`;
```

`src/components/ChildAccount/constants.ts`:

```ts
export const CHILD_ACCOUNT_TEST_IDS = {
  screen: 'child-account',
} as const;
```

`ChildAccount.tsx`:

```tsx
'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import type { WalletName, WalletSummary } from '@/lib/wallet/types';
import { Column, Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { ChildSavings } from './ChildSavings';
import { ChildWallet } from './ChildWallet';
import { CHILD_ACCOUNT_TEST_IDS } from './constants';
import { Wallets } from './ChildAccount.styles';

interface ChildAccountProps {
  account: AccountSummary;
}

type NamedWallet<Name extends WalletName> = WalletSummary & { name: Name };

function walletNamed<Name extends WalletName>(
  wallets: WalletSummary[],
  name: Name
): NamedWallet<Name> | undefined {
  return wallets.find(
    (wallet): wallet is NamedWallet<Name> => wallet.name === name
  );
}

export function ChildAccount({ account }: ChildAccountProps): JSX.Element {
  const savings = walletNamed(account.wallets, 'savings');
  const spending = walletNamed(account.wallets, 'spending');
  const goodDeeds = walletNamed(account.wallets, 'goodDeeds');

  return (
    <Screen align="top">
      <Column data-testid={CHILD_ACCOUNT_TEST_IDS.screen}>
        <Header title={account.name} account={account} />
        <Wallets>
          {savings && <ChildSavings savings={savings} />}
          {spending && <ChildWallet wallet={spending} />}
          {goodDeeds && <ChildWallet wallet={goodDeeds} />}
        </Wallets>
      </Column>
    </Screen>
  );
}
```

`ChildAccount.styles.ts`:

```ts
import styled from '@emotion/styled';

export const Wallets = styled.div`
  display: grid;
  gap: 12px;
`;
```

`Column` is a styled `div`, so `data-testid` passes through. Every `index.ts` holds only the named re-export, for example `export { ChildAccount } from './ChildAccount';`.

`src/components/Home/Home.tsx`: pick the screen without a nested ternary:

```tsx
import { ChildAccount } from '@/components/ChildAccount';
import { isChildView } from '@/lib/account/view-mode';
…
      {currentAccount && (
        <AccountsProvider value={{ accounts, currentAccount, switchAccount }}>
          {isChildView(currentAccount) ? (
            <ChildAccount account={currentAccount} />
          ) : (
            <Account account={currentAccount} />
          )}
        </AccountsProvider>
      )}
```

Run: `./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/eslint src/components`. Then check it in the browser: `npm run dev`, switch the dev account to child view (`PUT` with curl or a one-off store edit, **dev branch only**), and compare with `mockups/child-mode.html` screen 1. It must fit a 360×760 viewport with no scrolling.

- [ ] **Step 2: STOP** for review, with a screenshot next to the mockup. Then on "commit":

```bash
rtk proxy git add src/components/Money/Money.tsx src/components/ChildAccount src/components/Home/Home.tsx
rtk proxy git commit -m "feat(child-mode): the child's screen, savings first, in whole shekels"
```

- [ ] **Step 3: First three tests**, in `src/components/ChildAccount/ChildSavings/ChildSavings.test.tsx`:

```tsx
import { render, screen } from '@/test-utils/render';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import { ChildSavings } from './ChildSavings';
import { CHILD_SAVINGS_TEST_IDS } from './constants';

describe('ChildSavings', () => {
  describe('savings of ₪148.90, ₪6.40 of it interest', () => {
    beforeEach(() => {
      render(
        <ChildSavings
          savings={createMockWalletSummary({
            balance: 14890,
            interestEarned: 640,
          })}
        />
      );
    });

    it('shows the savings without agorot, never rounded up', () => {
      expect(
        screen.getByTestId(CHILD_SAVINGS_TEST_IDS.balance)
      ).toHaveTextContent('₪148');
    });

    it('shows what the child put in', () => {
      expect(
        screen.getByTestId(CHILD_SAVINGS_TEST_IDS.principal)
      ).toHaveTextContent('₪142');
    });

    it('shows what the money earned by itself', () => {
      expect(
        screen.getByTestId(CHILD_SAVINGS_TEST_IDS.interestEarned)
      ).toHaveTextContent('₪6');
    });
  });
});
```

Break-watch: (1) drop `roundDown` from the balance `Money`, and it shows ₪149; (2) pass `savings.principal` (agorot) to the principal tile, and it shows the raw value; (3) pass `savings.interestEarnedToday` to the earned tile.

- [ ] **Step 4: STOP** for test review.

- [ ] **Step 5: Remaining tests**, each watched failing.

`ChildWallet.test.tsx`:

```tsx
describe('ChildWallet', () => {
  describe('a spending wallet holding ₪23.99', () => {
    beforeEach(() => {
      render(
        <ChildWallet
          wallet={{
            ...createMockWalletSummary({ name: 'spending', balance: 2399 }),
            name: 'spending',
          }}
        />
      );
    });

    it('shows ₪23, never money the child does not have', () => {
      expect(
        screen.getByTestId(CHILD_WALLET_TEST_IDS.balance)
      ).toHaveTextContent('₪23');
    });

    it('tells the child this is the money to spend', () => {
      expect(screen.getByTestId(CHILD_WALLET_TEST_IDS.card)).toHaveTextContent(
        CHILD_WALLET_COPY.spending
      );
    });
  });
});
```

`ChildAccount.test.tsx` renders `<ChildAccount account={mockAccountSummary} />` with `{ user: mockUser, accounts: mockAccountsContext }` in a `beforeEach`:
- 'puts savings first': the first `section` inside the screen is `CHILD_SAVINGS_TEST_IDS.card`.
- 'shows spending and good deeds': `getAllByTestId(CHILD_WALLET_TEST_IDS.card)` has length 2.
- 'offers the child nothing to do but look': `queryByTestId(ACCOUNT_TEST_IDS.newTransaction)` is null.

`Money.test.tsx`, a new describe:

```tsx
  describe('an amount carrying agorot, shown to a child', () => {
    beforeEach(() => {
      render(<Money amountAgorot={26484} testId="amount" roundDown />);
    });

    it('drops the agorot instead of rounding up', () => {
      expect(screen.getByTestId('amount')).toHaveTextContent('₪264');
    });
  });
```

`Home.test.tsx`, a new describe using `renderHome` from `home-test-helpers.tsx`:

```tsx
  describe('an account in child view', () => {
    beforeEach(() => {
      renderHome({
        accounts: [
          { ...accounts[0], viewMode: APP_VIEW_MODE.child },
          accounts[1],
        ],
      });
    });

    it('opens on the child screen', () => {
      expect(
        screen.getByTestId(CHILD_ACCOUNT_TEST_IDS.screen)
      ).toBeInTheDocument();
    });
  });
```

Run: `./node_modules/.bin/jest src/components/ChildAccount src/components/Money src/components/Home`.

- [ ] **Step 6: STOP**, then on "commit tests":

```bash
rtk proxy git add src/components/ChildAccount src/components/Money/Money.test.tsx src/components/Home/Home.test.tsx
rtk proxy git commit -m "test(child-mode): the child's screen shows whole shekels and nothing to tap"
```

---
### Task 5: The switch, and the parent turning child view on (mockup 2b)

**Files:**
- Create: `src/components/Menu/ViewModeSwitch/{ViewModeSwitch.tsx,ViewModeSwitch.styles.ts,constants.ts,index.ts,use-account-view-mode.ts}`
- Modify: `src/components/Menu/MenuContent/MenuContent.tsx` (inside `MenuAccountSettings`, after `LanguageSection`)
- Test: `src/components/Menu/ViewModeSwitch/ViewModeSwitch.test.tsx`, `src/components/Menu/MenuContent/MenuContent.test.tsx`

**Interfaces:**
- Consumes: `APP_VIEW_MODE`, `AppViewMode` (Task 1); `PUT /api/accounts/[id]/view-mode` (Task 3); `useAccounts`, `useMenu`, `fetchJson`, `useRouter`.
- Produces: `ViewModeSwitch({ viewMode }: { viewMode: AppViewMode })`. The switch turns *that* mode on: the parent menu passes `child`, and the child menu (Task 6) passes `parent`. Also `VIEW_MODE_SWITCH_TEST_IDS.{switch,saveError}` and `VIEW_MODE_SWITCH_COPY`.

- [ ] **Step 1: Production code**

`constants.ts`:

```ts
import { APP_VIEW_MODE, type AppViewMode } from '@/lib/account/view-mode';

export const VIEW_MODE_SWITCH_TEST_IDS = {
  switch: 'menu-view-mode-switch',
  saveError: 'menu-view-mode-save-error',
} as const;

export const VIEW_MODE_SWITCH_COPY = {
  icon: {
    [APP_VIEW_MODE.child]: '🧒',
    [APP_VIEW_MODE.parent]: '👤',
  } satisfies Record<AppViewMode, string>,
  label: {
    [APP_VIEW_MODE.child]: 'מצב ילד',
    [APP_VIEW_MODE.parent]: 'מצב הורה',
  } satisfies Record<AppViewMode, string>,
  childNote: (accountName: string): string =>
    `מסך פשוט ל${accountName}, רק לצפייה`,
  saveError: 'לא הצלחנו להחליף מסך, נסו שוב',
} as const;
```

`use-account-view-mode.ts`. It follows `useAccountTheme`, and closes the menu once the save succeeds:

```ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccounts } from '@/components/Home/accounts-context';
import type { AppViewMode } from '@/lib/account/view-mode';
import { fetchJson } from '@/lib/fetch-json';
import { useMenu, useOnMenuClose } from '../use-menu-state';

interface AccountViewMode {
  chooseViewMode: (viewMode: AppViewMode) => void;
  saveFailed: boolean;
}

function accountViewModeEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}/view-mode`;
}

export function useAccountViewMode(): AccountViewMode {
  const { currentAccount } = useAccounts();
  const { closeMenu } = useMenu();
  const router = useRouter();
  const [saveFailed, setSaveFailed] = useState(false);

  useOnMenuClose((): void => setSaveFailed(false));

  const chooseViewMode = (viewMode: AppViewMode): void => {
    setSaveFailed(false);

    void saveOnAccount();

    async function saveOnAccount(): Promise<void> {
      try {
        await fetchJson({
          url: accountViewModeEndpoint(currentAccount.id),
          method: 'PUT',
          body: { viewMode },
        });

        closeMenu();
        router.refresh();
      } catch {
        setSaveFailed(true);
      }
    }
  };

  return { chooseViewMode, saveFailed };
}
```

`ViewModeSwitch.tsx`:

```tsx
'use client';

import { JSX } from 'react';
import { useAccounts } from '@/components/Home/accounts-context';
import { APP_VIEW_MODE, type AppViewMode } from '@/lib/account/view-mode';
import { useAccountViewMode } from './use-account-view-mode';
import { VIEW_MODE_SWITCH_COPY, VIEW_MODE_SWITCH_TEST_IDS } from './constants';
import {
  Icon,
  Label,
  Note,
  Row,
  SaveError,
  Track,
} from './ViewModeSwitch.styles';

interface ViewModeSwitchProps {
  viewMode: AppViewMode;
}

export function ViewModeSwitch({ viewMode }: ViewModeSwitchProps): JSX.Element {
  const { currentAccount } = useAccounts();
  const { chooseViewMode, saveFailed } = useAccountViewMode();
  const isOn = currentAccount.viewMode === viewMode;

  return (
    <div>
      <Row
        type="button"
        role="switch"
        aria-checked={isOn}
        data-testid={VIEW_MODE_SWITCH_TEST_IDS.switch}
        onClick={(): void => chooseViewMode(viewMode)}
      >
        <Icon aria-hidden>{VIEW_MODE_SWITCH_COPY.icon[viewMode]}</Icon>
        <Label>
          {VIEW_MODE_SWITCH_COPY.label[viewMode]}
          {viewMode === APP_VIEW_MODE.child && (
            <Note>{VIEW_MODE_SWITCH_COPY.childNote(currentAccount.name)}</Note>
          )}
        </Label>
        <Track data-on={isOn} />
      </Row>
      {saveFailed && (
        <SaveError data-testid={VIEW_MODE_SWITCH_TEST_IDS.saveError}>
          {VIEW_MODE_SWITCH_COPY.saveError}
        </SaveError>
      )}
    </div>
  );
}
```

`ViewModeSwitch.styles.ts`. The row is at least 56px tall: the parent menu is for adults, and the child menu adds its own wrapper.

```ts
import styled from '@emotion/styled';

export const Row = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 56px;
  padding: 12px;
  border: 1.5px solid ${({ theme }): string => theme.colors.softBorder};
  border-radius: 18px;
  background: ${({ theme }): string => theme.colors.surface};
  font: inherit;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
  cursor: pointer;
`;

export const Icon = styled.span`
  font-size: 22px;
`;

export const Label = styled.span`
  flex: 1;
  text-align: start;
`;

export const Note = styled.small`
  display: block;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Track = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 28px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.divider};

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    inset-inline-start: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${({ theme }): string => theme.colors.surface};
  }

  &[data-on='true'] {
    background: ${({ theme }): string => theme.colors.primary};
  }

  &[data-on='true']::after {
    inset-inline-start: 23px;
  }
`;

export const SaveError = styled.span`
  display: block;
  margin-top: 8px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  color: ${({ theme }): string => theme.colors.alertText};
`;
```

`MenuContent.tsx`: inside `<MenuAccountSettings>`, after `<LanguageSection />`:

```tsx
          <ViewModeSwitch viewMode={APP_VIEW_MODE.child} />
```

Run: `./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/eslint src/components/Menu`. In the browser (dev), open the menu, tap "מצב ילד", and the child home appears (Task 4).

- [ ] **Step 2: STOP** for review, with a screenshot of the parent menu next to mockup 2b. Then on "commit":

```bash
rtk proxy git add src/components/Menu/ViewModeSwitch src/components/Menu/MenuContent/MenuContent.tsx
rtk proxy git commit -m "feat(child-mode): a parent turns child view on from the account's settings"
```

- [ ] **Step 3: First three tests**, in `ViewModeSwitch.test.tsx`:

```tsx
import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import {
  mockAccountsContext,
  mockAccountSummary,
} from '@/test-utils/mocks/account.mocks';
import { renderInOpenMenu, WithMenu } from '@/test-utils/menu';
import { APP_VIEW_MODE } from '@/lib/account/view-mode';
import { mockRouter } from '@mocks/next/navigation';
import { ViewModeSwitch } from './ViewModeSwitch';
import { VIEW_MODE_SWITCH_COPY, VIEW_MODE_SWITCH_TEST_IDS } from './constants';

function tapSwitch(): void {
  fireEvent.click(screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch));
}

describe('ViewModeSwitch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => mockAccountSummary });
  });

  describe('a parent turns child view on', () => {
    const mockCloseMenu = jest.fn();

    beforeEach(async () => {
      render(
        <WithMenu closeMenu={mockCloseMenu}>
          <ViewModeSwitch viewMode={APP_VIEW_MODE.child} />
        </WithMenu>,
        { accounts: mockAccountsContext }
      );
      tapSwitch();
      await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
    });

    it('saves child view on the current account', () => {
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];

      expect([url, JSON.parse(options.body)]).toEqual([
        `/api/accounts/${mockAccountSummary.id}/view-mode`,
        { viewMode: APP_VIEW_MODE.child },
      ]);
    });

    it('closes the menu so the child screen is what shows', () => {
      expect(mockCloseMenu).toHaveBeenCalled();
    });
  });

  describe('the save fails', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      renderInOpenMenu(<ViewModeSwitch viewMode={APP_VIEW_MODE.child} />, {
        accounts: mockAccountsContext,
      });
      tapSwitch();
    });

    it('says the screen did not change', async () => {
      expect(
        await screen.findByTestId(VIEW_MODE_SWITCH_TEST_IDS.saveError)
      ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.saveError);
    });
  });
});
```

The `waitFor` in the `beforeEach` waits for the save to finish; it is not the test's assertion. `AppearanceSection.test.tsx` waits the same way.

Break-watch: (1) send `{ viewMode: APP_VIEW_MODE.parent }` in the body; (2) remove `closeMenu()`; (3) swallow the error without `setSaveFailed(true)`.

- [ ] **Step 4: STOP** for test review.

- [ ] **Step 5: Remaining tests**, each watched failing:

`ViewModeSwitch.test.tsx`:
- in 'a parent turns child view on': 'refreshes so the page loads in child view': `expect(mockRouter.refresh).toHaveBeenCalledTimes(1)`.
- a new describe 'the parent switch': render without tapping, then 'names the child it simplifies the screen for': the switch `toHaveTextContent(VIEW_MODE_SWITCH_COPY.childNote(mockAccountSummary.name))`, and 'is off while the account is on the parent screen': `toHaveAttribute('aria-checked', 'false')`.
- 'the save fails' → 'and the menu is closed and reopened' → 'forgets the error' (use `closeAndReopenMenu`, as `AppearanceSection.test.tsx` does).

`MenuContent.test.tsx`, a new describe 'for a parent viewing an account', with `render(<WithMenu><MenuContent /></WithMenu>, { user: mockUser, accounts: mockAccountsContext })`:
- 'offers child view among this account's settings': `getByTestId(MENU_ACCOUNT_SETTINGS_TEST_IDS.block)` `toContainElement(getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch))`.

Run: `./node_modules/.bin/jest src/components/Menu`.

- [ ] **Step 6: STOP**, then on "commit tests":

```bash
rtk proxy git add src/components/Menu/ViewModeSwitch src/components/Menu/MenuContent/MenuContent.test.tsx
rtk proxy git commit -m "test(child-mode): the parent's switch saves child view and owns up to a failed save"
```

---
### Task 6: The child menu (mockup 2a)

**Files:**
- Create: `src/components/Menu/ChildMenuContent/{ChildMenuContent.tsx,ChildMenuContent.styles.ts,constants.ts,index.ts}`
- Modify: `src/components/Menu/MenuContent/MenuContent.tsx`
- Test: `src/components/Menu/ChildMenuContent/ChildMenuContent.test.tsx`, `src/components/Menu/MenuContent/MenuContent.test.tsx`

**Interfaces:**
- Consumes: `ViewModeSwitch` (Task 5), `isChildView` (Tasks 1–2), `AppearanceSection`, `Avatar`, `HOME_ROUTE`, `useMenu`, `useOptionalAccounts`.
- Produces: `ChildMenuContent(): JSX.Element`; `CHILD_MENU_CONTENT_TEST_IDS.{menu,home}`.

- [ ] **Step 1: Production code**

`constants.ts`:

```ts
export const CHILD_MENU_CONTENT_TEST_IDS = {
  menu: 'child-menu',
  home: 'child-menu-home',
} as const;

export const CHILD_MENU_CONTENT_COPY = {
  homeIcon: '🏠',
  home: 'הכסף שלי',
} as const;
```

`ChildMenuContent.tsx`:

```tsx
'use client';

import { JSX } from 'react';
import { Avatar } from '@/components/Avatar/Avatar';
import { useAccounts } from '@/components/Home/accounts-context';
import { HOME_ROUTE } from '@/components/Home/constants';
import { APP_VIEW_MODE } from '@/lib/account/view-mode';
import { AppearanceSection } from '../AppearanceSection';
import { ViewModeSwitch } from '../ViewModeSwitch';
import { useMenu } from '../use-menu-state';
import {
  CHILD_MENU_CONTENT_COPY,
  CHILD_MENU_CONTENT_TEST_IDS,
} from './constants';
import {
  Child,
  ChildName,
  HomeLink,
  Item,
  ParentCorner,
} from './ChildMenuContent.styles';

export function ChildMenuContent(): JSX.Element {
  const { currentAccount } = useAccounts();
  const { closeMenu } = useMenu();

  return (
    <div data-testid={CHILD_MENU_CONTENT_TEST_IDS.menu}>
      <Child>
        <Avatar avatarId={currentAccount.avatarId} alt="" size={84} />
        <ChildName>{currentAccount.name}</ChildName>
      </Child>
      <HomeLink
        href={HOME_ROUTE}
        onClick={closeMenu}
        data-testid={CHILD_MENU_CONTENT_TEST_IDS.home}
      >
        <span aria-hidden>{CHILD_MENU_CONTENT_COPY.homeIcon}</span>
        {CHILD_MENU_CONTENT_COPY.home}
      </HomeLink>
      <Item>
        <AppearanceSection />
      </Item>
      <ParentCorner>
        <ViewModeSwitch viewMode={APP_VIEW_MODE.parent} />
      </ParentCorner>
    </div>
  );
}
```

`ChildMenuContent.styles.ts`. Rows are at least 76px tall (≈2cm, as the research recommends):

```ts
import styled from '@emotion/styled';
import Link from 'next/link';

export const Child = styled.div`
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 22px 16px;
  margin-bottom: 16px;
  border-radius: 22px;
  background: ${({ theme }): string => theme.colors.surface};
`;

export const ChildName = styled.b`
  font-size: ${({ theme }): number => theme.typography.title}px;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 76px;
  padding: 16px 18px;
  margin-bottom: 12px;
  border-radius: 22px;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  text-decoration: none;
  color: ${({ theme }): string => theme.colors.surface};
  background: ${({ theme }): string => theme.colors.textStrong};
`;

export const Item = styled.div`
  min-height: 76px;
  padding: 16px 18px;
  margin-bottom: 12px;
  border-radius: 22px;
  background: ${({ theme }): string => theme.colors.surface};
`;

export const ParentCorner = styled.div`
  margin-top: 28px;
  opacity: 0.85;
`;
```

`MenuContent.tsx`. The child view gets its own menu, and an early return keeps the parent branch as it is:

```tsx
export function MenuContent(): JSX.Element {
  const accounts = useOptionalAccounts();
  const hasAccount = Boolean(accounts);
  const { closeMenu } = useMenu();

  if (accounts && isChildView(accounts.currentAccount)) {
    return <ChildMenuContent />;
  }
  … (parent menu as before)
```

Hooks still run unconditionally before the return. Check the function stays ≤40 lines.

Run: `./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/eslint src/components/Menu`. In the browser: in child view, open the menu and compare with mockup 2a. Tap "מצב הורה", and the parent home is back. Visit `/method` in child view, and its menu is the child menu.

- [ ] **Step 2: STOP** for review, with a screenshot next to mockup 2a. Then on "commit":

```bash
rtk proxy git add src/components/Menu/ChildMenuContent src/components/Menu/MenuContent/MenuContent.tsx
rtk proxy git commit -m "feat(child-mode): the child's menu: their name, home, colours, and the way back"
```

- [ ] **Step 3: First three tests**, in `MenuContent.test.tsx`, a new describe:

```tsx
  describe('for an account in child view', () => {
    beforeEach(() => {
      const mockChildAccount = {
        ...mockAccountSummary,
        viewMode: APP_VIEW_MODE.child,
      };

      render(
        <WithMenu>
          <MenuContent />
        </WithMenu>,
        {
          user: mockUser,
          accounts: {
            ...mockAccountsContext,
            currentAccount: mockChildAccount,
          },
        }
      );
    });

    it('shows the child menu', () => {
      expect(
        screen.getByTestId(CHILD_MENU_CONTENT_TEST_IDS.menu)
      ).toBeInTheDocument();
    });

    it('hides the account picker, so the child stays on their own money', () => {
      expect(
        screen.queryByTestId(ACCOUNT_PICKER_TEST_IDS.picker)
      ).not.toBeInTheDocument();
    });

    it('hides the screens meant for the parent', () => {
      expect(
        screen.queryByTestId(NAVIGATION_TABS_TEST_IDS.tabBar)
      ).not.toBeInTheDocument();
    });
  });
```

Break-watch: (1) delete the early return, and all three redden; (2) render `<ChildMenuContent />` *and* `<AccountControls />`, and only the picker test reddens; (3) add `<NavigationTabs>` to `ChildMenuContent`, and only the tabs test reddens.

- [ ] **Step 4: STOP** for test review.

- [ ] **Step 5: Remaining tests**, each watched failing. In `ChildMenuContent.test.tsx`, render inside `WithMenu` with `{ user: mockUser, accounts: { ...mockAccountsContext, currentAccount: mockChildAccount } }`:
- 'greets the child by name': `getByTestId(CHILD_MENU_CONTENT_TEST_IDS.menu)` `toHaveTextContent(mockAccountSummary.name)`.
- 'takes the child home': the home link `toHaveAttribute('href', HOME_ROUTE)`.
- 'closes the menu on the way home': a click on the home link calls `mockCloseMenu` (passed to `WithMenu`).
- 'lets the child pick colours': `getByTestId(APPEARANCE_SECTION_TEST_IDS.section)` exists.
- 'offers the parent the way back': the switch `toHaveTextContent(VIEW_MODE_SWITCH_COPY.label[APP_VIEW_MODE.parent])`.

`MenuContent.test.tsx`, 'for an account in child view':
- 'hides signing out': `queryByTestId(MENU_USER_SETTINGS_TEST_IDS.block)` is null.

Run: `./node_modules/.bin/jest src/components/Menu`.

- [ ] **Step 6: STOP**, then on "commit tests":

```bash
rtk proxy git add src/components/Menu/ChildMenuContent src/components/Menu/MenuContent/MenuContent.test.tsx
rtk proxy git commit -m "test(child-mode): the child's menu keeps parent things out of reach"
```

---
### Task 7: Proof in a real browser

**Files:**
- Create: `e2e/driver/child-account-driver.ts`, `e2e/child-view.e2e.ts`
- Modify: `e2e/driver/menu-driver.ts`, `e2e/driver/use-driver.ts` (`AppDriver`, `createAppDriver`)

**Interfaces:**
- Consumes: `CHILD_ACCOUNT_TEST_IDS`, `CHILD_WALLET_TEST_IDS` (Task 4), `VIEW_MODE_SWITCH_TEST_IDS` (Task 5), `CHILD_MENU_CONTENT_TEST_IDS` (Task 6), `APP_VIEW_MODE`.
- Produces: `AppDriver.childAccount: ChildAccountDriver`; `MenuDriver.tapViewModeSwitch()`, `MenuDriver.childMenuIsShown()`.

This task is test code only, so the CLAUDE.md production-then-tests split collapses into: drivers plus the first three cases, STOP, the rest, then commit.

- [ ] **Step 1: Drivers**

`e2e/driver/child-account-driver.ts`:

```ts
import { CHILD_ACCOUNT_TEST_IDS } from '@/components/ChildAccount/constants';
import { AppBrowser } from './app-browser';

export class ChildAccountDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  isShown(): Promise<boolean> {
    return this.appBrowser.exists(CHILD_ACCOUNT_TEST_IDS.screen);
  }

  async waitUntilShown(): Promise<void> {
    await this.appBrowser.waitForTestId(CHILD_ACCOUNT_TEST_IDS.screen);
  }
}
```

`menu-driver.ts`, new methods (with the matching imports):

```ts
  tapViewModeSwitch(): Promise<void> {
    return this.appBrowser.click(VIEW_MODE_SWITCH_TEST_IDS.switch);
  }

  childMenuIsShown(): Promise<boolean> {
    return this.appBrowser.exists(CHILD_MENU_CONTENT_TEST_IDS.menu);
  }
```

`use-driver.ts`: add `childAccount: ChildAccountDriver` to `AppDriver`, and `childAccount: new ChildAccountDriver(appBrowser),` to `createAppDriver`.

- [ ] **Step 2: First three cases**, in `e2e/child-view.e2e.ts`:

```ts
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { APP_VIEW_MODE } from '@/lib/account/view-mode';
import { createMockAccount, mockAccount } from '@/test-utils/mocks/account.mocks';
import { useDriver } from './driver/use-driver';

describe('an account stored in child view', () => {
  const { childAccount } = useDriver({
    accounts: [createMockAccount({ viewMode: APP_VIEW_MODE.child })],
  });

  it('opens straight on the child screen', async () => {
    assert.equal(await childAccount.isShown(), true);
  });
});

describe('a parent turns child view on', () => {
  const { menu, childAccount, appBrowser } = useDriver({
    accounts: [mockAccount],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.tapViewModeSwitch();
    await childAccount.waitUntilShown();
  });

  it('shows the child screen', async () => {
    assert.equal(await childAccount.isShown(), true);
  });

  it('is still the child screen after a reload, with no cookie to remember it', async () => {
    await appBrowser.reload();

    assert.equal(await childAccount.isShown(), true);
  });
});
```

Check that `useDriver` gives each `describe` a fresh store. `edit-account.e2e.ts` relies on that.

Break-watch: (1) in `Home.tsx`, always render `Account`, and all three redden; (2) make `accountFromRow` and the JSON store ignore `viewMode` (have `JsonAccounts.get` return `{ ...account, viewMode: APP_VIEW_MODE.parent }`): the stored-child and reload cases redden, and the in-session one may stay green, which proves the reload case is what pins persistence; (3) remove `router.refresh()` from `useAccountViewMode`, and "shows the child screen" reddens.

Run: `npm run test:e2e`. It also runs `test:db` and `test:visual` first, so read the e2e summary.

- [ ] **Step 3: STOP** for review.

- [ ] **Step 4: Remaining cases**, each watched failing:

```ts
describe('the child goes back to the parent screen', () => {
  const { menu, childAccount, account } = useDriver({
    accounts: [createMockAccount({ viewMode: APP_VIEW_MODE.child })],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.tapViewModeSwitch();
    await account.waitForOverview();
  });

  it('shows the parent screen again', async () => {
    assert.equal(await childAccount.isShown(), false);
  });
});

describe('a child who opens a parent page by its address', () => {
  const { menu, appBrowser } = useDriver({
    accounts: [createMockAccount({ viewMode: APP_VIEW_MODE.child })],
  });

  beforeEach(async () => {
    await appBrowser.visit('/method');
    await menu.open();
  });

  it('still gets the child menu', async () => {
    assert.equal(await menu.childMenuIsShown(), true);
  });
});
```

If `AccountDriver` has no `waitForOverview`, add one next to `overviewExists()` that waits for `BALANCE_BREAKDOWN_TEST_IDS.card`.

- [ ] **Step 5: STOP**, then on "commit tests":

```bash
rtk proxy git add e2e/child-view.e2e.ts e2e/driver
rtk proxy git commit -m "test(child-mode): child view in a real browser, kept across a reload"
```

---

### Finishing

- [ ] Run the full ladder, captured to files: `./node_modules/.bin/tsc --noEmit`, `./node_modules/.bin/eslint .`, `./node_modules/.bin/jest`, `npm run test:db`, `npm run build`, `npm run test:e2e`. Report the real numbers.
- [ ] `backlog.md` §6: mark it as resolved by this feature (a device-free, account-saved view mode, with no login), in the PR that ships it.
- [ ] Copy this plan to `.plans/child-mode.md` (CLAUDE.md, Phase 1 step 4).
- [ ] Push and open the PR only when the user asks. Use the `pr-screenshots` skill for the child home, the child menu and the parent menu's new row. Keep the PR body to 10–15 lines in the five fixed sections.
