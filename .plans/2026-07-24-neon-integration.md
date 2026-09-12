# Neon Integration Plan — PostgreSQL + Auth

**Goal:** Replace the JSON file store with Neon Postgres and add Stack Auth (via Neon Auth), so the app is deployable to
Vercel with real persistent data and a proper login.

**Architecture:**

- Database: `@neondatabase/serverless` HTTP driver — no WebSocket/pool setup needed; each query is a `neon` tagged
  template call
- Auth: Stack Auth (Neon Auth is powered by Stack Auth). Single parent account for Phase 1. E2e tests bypass auth via
  `FUNSAVER_SKIP_AUTH=true` env var, following the same pattern as `FUNSAVER_NOW`
- The `DataStore` interface does not change. `PostgresStore` is a new implementation alongside `JsonFileStore`
- `getStore()` selects `PostgresStore` when `DATABASE_URL` is set, falls back to `JsonFileStore` otherwise — all
  existing unit tests stay green with no changes

**Deployment:** Vercel (zero-config Next.js, free tier, auto-HTTPS). Possible once DB and auth are in place.

---

## Prerequisites (do before Task 1)

1. Create a Neon account at neon.tech
2. Create a project (e.g. `fun-saver`)
3. Copy the connection string — add it to `.env.local` as `DATABASE_URL=postgres://...`
4. Enable Neon Auth in the Neon console → copy the three env vars into `.env.local`:
    - `NEXT_PUBLIC_STACK_PROJECT_ID`
    - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
    - `STACK_SECRET_SERVER_KEY`

---

## Task 1 — SQL Schema

**Files:**

- Create: `src/db/schema.sql`
- Create: `src/db/run-migration.ts`

These two files are the source of truth for the DB structure. `run-migration.ts` is a one-shot script — run it once to
create tables. It is idempotent (`CREATE TABLE IF NOT EXISTS`).

- [ ] **Create `src/db/schema.sql`**

```sql
CREATE TABLE IF NOT EXISTS accounts
(
    id
    TEXT
    PRIMARY
    KEY,
    user_id
    TEXT
    NOT
    NULL,
    name
    TEXT
    NOT
    NULL,
    avatar_id
    TEXT
    NOT
    NULL,
    is_active
    BOOLEAN
    NOT
    NULL
    DEFAULT
    true,
    theme_id
    TEXT
    NOT
    NULL
    DEFAULT
    'sunshine-quest'
);

CREATE TABLE IF NOT EXISTS wallets
(
    id
    TEXT
    PRIMARY
    KEY,
    account_id
    TEXT
    NOT
    NULL
    REFERENCES
    accounts
(
    id
) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    monthly_interest_rate NUMERIC
(
    6,
    4
) NOT NULL DEFAULT 0,
    opened_at TEXT NOT NULL,
    last_interest_date TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS transactions
(
    id
    TEXT
    PRIMARY
    KEY,
    wallet_id
    TEXT
    NOT
    NULL
    REFERENCES
    wallets
(
    id
) ON DELETE CASCADE,
    account_id TEXT NOT NULL REFERENCES accounts
(
    id
)
  ON DELETE CASCADE,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    occurred_at TEXT NOT NULL
    );

CREATE INDEX IF NOT EXISTS transactions_wallet_idx ON transactions(wallet_id);
```

Dates are stored as `TEXT` (`'2026-07-24'` format) to avoid JavaScript `Date` conversion.
IDs are `TEXT` (UUIDs from `src/lib/ids.ts`), matching the existing type.

- [ ] **Create `src/db/run-migration.ts`**

```typescript
import {neon} from '@neondatabase/serverless';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

async function main(): Promise<void> {
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error('DATABASE_URL is not set');
    }

    const sql = neon(url);
    const schema = await readFile(resolve('src/db/schema.sql'), 'utf8');
    await sql(schema);
    console.log('Migration complete.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
```

- [ ] **Install the Neon driver**

```bash
npm install @neondatabase/serverless
```

- [ ] **Add migration script to `package.json`**

Add under `"scripts"`:

```json
"db:migrate": "tsx src/db/run-migration.ts"
```

- [ ] **Run the migration against your Neon database**

```bash
npm run db:migrate
```

Expected output:

```
Migration complete.
```

- [ ] **Verify in Neon console**

Open the Neon console → Tables. Confirm `accounts`, `wallets`, `transactions` all exist with the correct columns.

- [ ] **Commit**

```bash
git add src/db/schema.sql src/db/run-migration.ts package.json package-lock.json
git commit -m "feat: SQL schema for accounts, wallets, transactions"
```

---

## Task 2 — PostgresStore

**Files:**

- Create: `src/db/postgres-store.ts`
- Create: `src/db/__tests__/postgres-store.test.ts`

`PostgresStore` implements the same `DataStore` interface as `JsonFileStore`. The neon tagged-template call (`sql\`...\`
`) returns an array of row objects directly (not `{ rows }`).

`insertTransactionWithGuard` does a plain SELECT then INSERT without a DB-level lock — acceptable for a family app with
a few requests per day. The interest idempotency guard is already enforced in `addDailyInterest` by checking dates.

- [ ] **Create `src/db/postgres-store.ts`**

```typescript
import {neon} from '@neondatabase/serverless';
import type {Account, Transaction, Wallet} from '@/lib/types';
import type {ThemeId} from '@/theme/registry';
import type {BuildGuardedTransaction, DataStore} from './data-store';

type Row = Record<string, unknown>;

function rowToWallet(row: Row): Wallet {
    return {
        id: row['wallet_id'] as string,
        name: row['wallet_name'] as Wallet['name'],
        icon: row['icon'] as string,
        monthlyInterestRate: Number(row['monthly_interest_rate']),
        openedAt: row['opened_at'] as string,
        lastInterestDate: row['last_interest_date'] as string,
    };
}

function rowToTransaction(row: Row): Transaction {
    return {
        id: row['id'] as string,
        walletId: row['wallet_id'] as string,
        accountId: row['account_id'] as string,
        type: row['type'] as Transaction['type'],
        amount: Number(row['amount']),
        occurredAt: row['occurred_at'] as string,
    };
}

function groupByAccount(rows: Row[]): Account[] {
    const accountMap = new Map<string, Account>();

    for (const row of rows) {
        const id = row['id'] as string;

        if (!accountMap.has(id)) {
            accountMap.set(id, {
                id,
                name: row['name'] as string,
                avatarId: row['avatar_id'] as string,
                isActive: row['is_active'] as boolean,
                themeId: row['theme_id'] as string,
                wallets: [],
            });
        }

        if (row['wallet_id']) {
            accountMap.get(id)!.wallets.push(rowToWallet(row));
        }
    }

    return Array.from(accountMap.values());
}

export class PostgresStore implements DataStore {
    private readonly sql: ReturnType<typeof neon>;

    constructor(connectionString: string) {
        this.sql = neon(connectionString);
    }

    async insertAccount(
        account: Account,
        userId = 'single-family'
    ): Promise<void> {
        await this.sql`
      INSERT INTO accounts (id, user_id, name, avatar_id, is_active, theme_id)
      VALUES (${account.id}, ${userId}, ${account.name}, ${account.avatarId},
              ${account.isActive}, ${account.themeId})
    `;

        for (const wallet of account.wallets) {
            await this.sql`
        INSERT INTO wallets (id, account_id, name, icon, monthly_interest_rate, opened_at, last_interest_date)
        VALUES (${wallet.id}, ${account.id}, ${wallet.name}, ${wallet.icon},
                ${wallet.monthlyInterestRate}, ${wallet.openedAt}, ${wallet.lastInterestDate})
      `;
        }
    }

    async listAccounts(): Promise<Account[]> {
        const rows = await this.sql<Row[]>`
      SELECT a.id, a.name, a.avatar_id, a.is_active, a.theme_id,
             w.id AS wallet_id, w.name AS wallet_name, w.icon,
             w.monthly_interest_rate, w.opened_at, w.last_interest_date
      FROM accounts a
      LEFT JOIN wallets w ON w.account_id = a.id
      ORDER BY a.name, w.name
    `;
        return groupByAccount(rows);
    }

    async getAccount(id: string): Promise<Account | undefined> {
        const rows = await this.sql<Row[]>`
      SELECT a.id, a.name, a.avatar_id, a.is_active, a.theme_id,
             w.id AS wallet_id, w.name AS wallet_name, w.icon,
             w.monthly_interest_rate, w.opened_at, w.last_interest_date
      FROM accounts a
      LEFT JOIN wallets w ON w.account_id = a.id
      WHERE a.id = ${id}
    `;
        return groupByAccount(rows)[0];
    }

    async setAccountTheme(
        id: string,
        themeId: ThemeId
    ): Promise<Account | undefined> {
        await this.sql`UPDATE accounts SET theme_id = ${themeId} WHERE id = ${id}`;
        return this.getAccount(id);
    }

    async insertTransactions(transactions: Transaction[]): Promise<void> {
        for (const tx of transactions) {
            await this.sql`
        INSERT INTO transactions (id, wallet_id, account_id, type, amount, occurred_at)
        VALUES (${tx.id}, ${tx.walletId}, ${tx.accountId}, ${tx.type}, ${tx.amount}, ${tx.occurredAt})
      `;
        }
    }

    async listTransactionsByWallet(walletId: string): Promise<Transaction[]> {
        const rows = await this.sql<Row[]>`
      SELECT id, wallet_id, account_id, type, amount, occurred_at
      FROM transactions WHERE wallet_id = ${walletId}
      ORDER BY occurred_at
    `;
        return rows.map(rowToTransaction);
    }

    async insertTransactionWithGuard(
        walletId: string,
        build: BuildGuardedTransaction
    ): Promise<Transaction> {
        const rows = await this.sql<Row[]>`
      SELECT id, wallet_id, account_id, type, amount, occurred_at
      FROM transactions WHERE wallet_id = ${walletId}
    `;
        const existing = rows.map(rowToTransaction);
        const tx = build(existing);

        await this.sql`
      INSERT INTO transactions (id, wallet_id, account_id, type, amount, occurred_at)
      VALUES (${tx.id}, ${tx.walletId}, ${tx.accountId}, ${tx.type}, ${tx.amount}, ${tx.occurredAt})
    `;

        return tx;
    }
}
```

- [ ] **Write the integration tests**

Create `src/db/__tests__/postgres-store.test.ts`:

```typescript
/**
 * @jest-environment node
 */
import {PostgresStore} from '../postgres-store';
import {mockCreateAccountInput} from '@/test-support/fixtures';
import {AccountsStore} from '@/lib/accounts-store';

const TEST_URL = process.env.TEST_DATABASE_URL;
const describeIfDb = TEST_URL ? describe : describe.skip;

const ASOF = '2026-01-01';
const UNIQUE_PREFIX = `test_${Date.now()}`;

describeIfDb('PostgresStore', () => {
    let store: PostgresStore;

    beforeEach(async () => {
        store = new PostgresStore(TEST_URL!);
    });

    afterEach(async () => {
        const {neon} = await import('@neondatabase/serverless');
        const sql = neon(TEST_URL!);
        await sql`DELETE FROM transactions WHERE account_id IN (SELECT id FROM accounts WHERE name LIKE ${UNIQUE_PREFIX + '%'})`;
        await sql`DELETE FROM accounts WHERE name LIKE ${UNIQUE_PREFIX + '%'}`;
    });

    async function createTestAccount(): Promise<string> {
        const account = await new AccountsStore(store).createAccount(
            {...mockCreateAccountInput, name: `${UNIQUE_PREFIX}_account`},
            ASOF
        );
        return account.id;
    }

    it('inserts and lists an account with wallets', async () => {
        await createTestAccount();

        const accounts = await store.listAccounts();
        const created = accounts.find((a) => a.name.startsWith(UNIQUE_PREFIX));

        expect(created).toBeDefined();
        expect(created!.wallets).toHaveLength(3);
        expect(created!.wallets.map((w) => w.name).sort()).toEqual([
            'goodDeeds',
            'savings',
            'spending',
        ]);
    });

    it('getAccount returns the account with wallets', async () => {
        const id = await createTestAccount();
        const account = await store.getAccount(id);

        expect(account).toBeDefined();
        expect(account!.id).toBe(id);
        expect(account!.wallets).toHaveLength(3);
    });

    it('setAccountTheme updates and returns the account', async () => {
        const id = await createTestAccount();
        const updated = await store.setAccountTheme(id, 'midnight-blue');

        expect(updated?.themeId).toBe('midnight-blue');
        expect((await store.getAccount(id))?.themeId).toBe('midnight-blue');
    });

    it('insertTransactions and listTransactionsByWallet round-trip', async () => {
        const id = await createTestAccount();
        const account = await store.getAccount(id);
        const wallet = account!.wallets[0];

        await store.insertTransactions([
            {
                id: `tx-${Date.now()}`,
                walletId: wallet.id,
                accountId: id,
                type: 'deposit',
                amount: 1000,
                occurredAt: ASOF,
            },
        ]);

        const txs = await store.listTransactionsByWallet(wallet.id);
        expect(txs).toHaveLength(1);
        expect(txs[0].amount).toBe(1000);
    });
});
```

- [ ] **Run the tests**

Without `TEST_DATABASE_URL` (CI / regular dev):

```bash
npm test -- --testPathPattern="postgres-store"
```

Expected: suite is **skipped** (0 tests run, no failures).

With a real Neon test DB (add a second Neon branch named `test`, copy its URL):

```bash
TEST_DATABASE_URL="postgres://..." npm test -- --testPathPattern="postgres-store"
```

Expected: PASS (5 tests).

- [ ] **Commit**

```bash
git add src/db/postgres-store.ts src/db/__tests__/postgres-store.test.ts
git commit -m "feat: PostgresStore implementing DataStore against Neon Postgres"
```

---

## Task 3 — Wire store selection

**Files:**

- Modify: `src/db/index.ts`
- Modify: `.env.example`

`getStore()` returns a `PostgresStore` when `DATABASE_URL` is set, otherwise falls back to `JsonFileStore`. All existing
tests continue using `JsonFileStore` (they set `FUNSAVER_DATA_PATH` to a temp dir; `DATABASE_URL` is not set in tests).

- [ ] **Update `src/db/index.ts`**

```typescript
import {resolve} from 'node:path';
import {JsonFileStore} from './json-file-store';
import {PostgresStore} from './postgres-store';
import type {DataStore} from './data-store';

let cached: { key: string; store: DataStore } | null = null;

export function getStore(): DataStore {
    const dbUrl = process.env.DATABASE_URL;

    if (dbUrl) {
        if (cached?.key !== dbUrl) {
            cached = {key: dbUrl, store: new PostgresStore(dbUrl)};
        }
        return cached.store;
    }

    const filePath = resolve(
        process.env.FUNSAVER_DATA_PATH ?? 'src/db/data.json'
    );
    if (cached?.key !== filePath) {
        cached = {key: filePath, store: new JsonFileStore(filePath)};
    }
    return cached.store;
}
```

- [ ] **Update `.env.example`**

```
# Neon connection string — required in production.
# Get it from the Neon console: your project → Connection string.
DATABASE_URL=

# Stack Auth / Neon Auth credentials — required in production.
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=

# ── Local dev only ───────────────────────────────────────────────
# Overrides DATABASE_URL when set — leave blank to use Neon.
FUNSAVER_DATA_PATH=

# Freezes the clock for visual testing.
# Example: FUNSAVER_NOW=2026-01-01
FUNSAVER_NOW=

# Set to 'true' to bypass Stack Auth in e2e tests and local dev.
FUNSAVER_SKIP_AUTH=
```

- [ ] **Run all existing tests — confirm green**

```bash
npm test
```

Expected: all tests pass. `DATABASE_URL` is not set so `JsonFileStore` is used everywhere.

- [ ] **Manual test with Neon**

In `.env.local`, set only `DATABASE_URL`. Do NOT set `FUNSAVER_DATA_PATH`.

```bash
npm run dev
```

Open `http://localhost:3000`. App should load (empty state — no accounts in Neon yet). Create an account. Refresh.
Account persists. Check Neon console Tables → `accounts` has one row.

- [ ] **Commit**

```bash
git add src/db/index.ts .env.example
git commit -m "feat: select PostgresStore when DATABASE_URL is set, JsonFileStore otherwise"
```

---

## Task 4 — Stack Auth setup

**Files:**

- Create: `src/stack.ts`
- Create: `src/app/handler/[...stack]/page.tsx`
- Modify: `src/app/layout.tsx`

Stack Auth manages sign-in/sign-out at `/handler/sign-in` and `/handler/sign-out`. `StackProvider` in the layout gives
client components access to the current user.

- [ ] **Install Stack Auth**

```bash
npm install @stackframe/stack
```

- [ ] **Create `src/stack.ts`**

```typescript
import 'server-only';
import {StackServerApp} from '@stackframe/stack';

export const stackServerApp = new StackServerApp({
    tokenStore: 'nextjs-cookie',
});
```

- [ ] **Create `src/app/handler/[...stack]/page.tsx`**

```typescript
import {StackHandler} from '@stackframe/stack';
import {stackServerApp} from '@/stack';
import {JSX} from 'react';

interface Props {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
}

export default function Handler(props: Props): JSX.Element {
    return <StackHandler fullPage
    app = {stackServerApp}
    {...
        props
    }
    />;
}
```

- [ ] **Update `src/app/layout.tsx` — add `StackProvider`**

```typescript
import React, {JSX} from 'react';
import type {Metadata, Viewport} from 'next';
import {StackProvider, StackTheme} from '@stackframe/stack';
import {stackServerApp} from '@/stack';
import './globals.css';
import {EmotionStyleRegistry} from './EmotionStyleRegistry';

export const metadata: Metadata = {
    title: 'Fun Saver',
    description: 'חיסכון חכם לילדים',
};

export const viewport: Viewport = {
    themeColor: '#6B2C8E',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>): Promise<JSX.Element> {
    return (
        <html lang = "he"
    dir = "rtl" >
    <body className = "flex min-h-full flex-col" >
    <StackProvider app = {stackServerApp} >
        <StackTheme>
            <EmotionStyleRegistry>{children} < /EmotionStyleRegistry>
        < /StackTheme>
        < /StackProvider>
        < /body>
        < /html>
)
    ;
}
```

- [ ] **Run all tests — confirm green**

```bash
npm test
```

Expected: all tests pass (Stack Auth is installed but not yet enforced).

- [ ] **Manual test**

```bash
npm run dev
```

Visit `http://localhost:3000/handler/sign-in`. Stack Auth's sign-in page should render (they provide a built-in UI).
Sign up with your email. Sign out via `http://localhost:3000/handler/sign-out`.

- [ ] **Commit**

```bash
git add src/stack.ts src/app/handler/ src/app/layout.tsx package.json package-lock.json
git commit -m "feat: Stack Auth setup — sign-in/sign-out at /handler/*"
```

---

## Task 5 — Protect routes with middleware

**Files:**

- Create: `src/middleware.ts`

The middleware uses `stackServerApp.middleware` to enforce auth on all routes. When `FUNSAVER_SKIP_AUTH=true` (used in
e2e tests), auth is bypassed entirely — same pattern as `FUNSAVER_NOW` skipping the real clock.

Public paths that never require auth: `/handler/*` (Stack Auth's own pages), `/_next/*`, static assets.

- [ ] **Create `src/middleware.ts`**

```typescript
import {NextRequest, NextResponse} from 'next/server';
import {stackServerApp} from '@/stack';

export async function middleware(request: NextRequest): Promise<NextResponse> {
    if (process.env.FUNSAVER_SKIP_AUTH === 'true') {
        return NextResponse.next();
    }
    return stackServerApp.middleware(request);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg)).*)',
    ],
};
```

- [ ] **Run all tests — confirm green**

```bash
npm test
```

Expected: all tests pass (middleware doesn't run in Jest).

- [ ] **Manual test**

```bash
npm run dev
```

1. Clear cookies in the browser.
2. Visit `http://localhost:3000` — expect redirect to `/handler/sign-in`.
3. Sign in with the account you created in Task 4.
4. Expect redirect back to the app.
5. Refresh — app loads without re-prompting.
6. Visit `http://localhost:3000/handler/sign-out` — expect sign-out, redirect to sign-in.

- [ ] **Commit**

```bash
git add src/middleware.ts
git commit -m "feat: protect all routes with Stack Auth middleware"
```

---

## Task 6 — Update e2e test harness for auth bypass

**Files:**

- Modify: `e2e/server.ts`
- Modify: `e2e/driver/use-driver.ts`

E2e tests start a production build with `next start`. They need auth disabled so tests don't need to navigate a sign-in
page. Set `FUNSAVER_SKIP_AUTH=true` in the server env (same as how `FUNSAVER_NOW` freezes the clock).

`use-driver.ts` currently seeds state via `JsonFileStore` directly. When `DATABASE_URL` is set in the server, the app
reads from Neon instead of the file — but tests still need isolated data. Solution: e2e tests continue to NOT set
`DATABASE_URL`, so the server falls back to `JsonFileStore` with `FUNSAVER_DATA_PATH`. The auth bypass is the only
addition needed.

- [ ] **Update `e2e/server.ts`**

Add `FUNSAVER_SKIP_AUTH: 'true'` to the env block:

```typescript
const env: NodeJS.ProcessEnv = {
    ...process.env,
    PORT: String(port),
    FUNSAVER_DATA_PATH: dataPath,
    FUNSAVER_NOW: '2026-01-01',
    FUNSAVER_SKIP_AUTH: 'true',
};
```

- [ ] **Run all e2e tests — confirm green**

```bash
npm run test:e2e
```

Expected: all existing e2e tests pass without changes to any test file.

- [ ] **Commit**

```bash
git add e2e/server.ts
git commit -m "test: bypass Stack Auth in e2e server via FUNSAVER_SKIP_AUTH"
```

---

## Task 7 — Migrate existing data to Neon

**Files:**

- Create: `src/db/migrate-from-json.ts`

One-shot script: reads `src/db/data.json` and inserts all accounts, wallets, and transactions into the Neon database.
Safe to re-run — uses `INSERT ... ON CONFLICT DO NOTHING` so it won't duplicate.

- [ ] **Create `src/db/migrate-from-json.ts`**

```typescript
import {neon} from '@neondatabase/serverless';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import type {StoreData} from './data-store';

async function main(): Promise<void> {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');

    const sql = neon(url);
    const raw = await readFile(resolve('src/db/data.json'), 'utf8');
    const data = JSON.parse(raw) as StoreData;

    for (const account of data.accounts) {
        await sql`
      INSERT INTO accounts (id, user_id, name, avatar_id, is_active, theme_id)
      VALUES (${account.id}, 'single-family', ${account.name}, ${account.avatarId},
              ${account.isActive}, ${account.themeId})
      ON CONFLICT (id) DO NOTHING
    `;

        for (const wallet of account.wallets) {
            await sql`
        INSERT INTO wallets (id, account_id, name, icon, monthly_interest_rate, opened_at, last_interest_date)
        VALUES (${wallet.id}, ${account.id}, ${wallet.name}, ${wallet.icon},
                ${wallet.monthlyInterestRate}, ${wallet.openedAt}, ${wallet.lastInterestDate})
        ON CONFLICT (id) DO NOTHING
      `;
        }
    }

    for (const tx of data.transactions) {
        await sql`
      INSERT INTO transactions (id, wallet_id, account_id, type, amount, occurred_at)
      VALUES (${tx.id}, ${tx.walletId}, ${tx.accountId}, ${tx.type}, ${tx.amount}, ${tx.occurredAt})
      ON CONFLICT (id) DO NOTHING
    `;
    }

    console.log(
        `Migrated ${data.accounts.length} accounts and ${data.transactions.length} transactions.`
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
```

- [ ] **Add script to `package.json`**

```json
"db:migrate-json": "tsx src/db/migrate-from-json.ts"
```

- [ ] **Run the migration**

```bash
npm run db:migrate-json
```

Expected:

```
Migrated 1 accounts and 21 transactions.
```

- [ ] **Verify in the app**

```bash
npm run dev
```

Open `http://localhost:3000` (with `DATABASE_URL` in `.env.local`). Sign in. שירה's account and all balances should
appear, with daily interest calculated through today.

- [ ] **Commit**

```bash
git add src/db/migrate-from-json.ts package.json
git commit -m "chore: one-shot migration script from data.json to Neon Postgres"
```

---

## Task 8 — Deploy to Vercel

No new files. Configuration happens in the Vercel dashboard.

- [ ] **Push the branch to GitHub and open a PR (or push to main)**

- [ ] **Import the project on vercel.com**

1. Go to vercel.com → Add New Project → Import from GitHub → select `fun-saver`
2. Framework: Next.js (auto-detected)
3. Root directory: `.` (leave default)

- [ ] **Set environment variables in Vercel dashboard**

Under Settings → Environment Variables, add:

| Key                                        | Value                                                                           |
|--------------------------------------------|---------------------------------------------------------------------------------|
| `DATABASE_URL`                             | Neon connection string (use the **pooled** connection string from Neon console) |
| `NEXT_PUBLIC_STACK_PROJECT_ID`             | from Neon Auth / Stack Auth dashboard                                           |
| `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` | from Neon Auth / Stack Auth dashboard                                           |
| `STACK_SECRET_SERVER_KEY`                  | from Neon Auth / Stack Auth dashboard                                           |

Do NOT set `FUNSAVER_DATA_PATH`, `FUNSAVER_SKIP_AUTH`, or `FUNSAVER_NOW` in production.

- [ ] **Deploy**

Vercel auto-deploys on every push to `main`. Trigger the first deploy from the dashboard.

- [ ] **Smoke test on phone**

1. Open the Vercel URL on your phone.
2. Sign in with your account.
3. Confirm שירה's balances and interest history appear.
4. Make a deposit — confirm it persists after refreshing.
5. On Android: Chrome → menu → Add to Home Screen. On iOS: Share → Add to Home Screen. (PWA manifest added separately in
   the next PR if desired.)

---

## Testing Summary

| Task                 | Unit/Integration test                                        | Manual test                                     |
|----------------------|--------------------------------------------------------------|-------------------------------------------------|
| 1 — Schema           | —                                                            | Neon console: tables exist                      |
| 2 — PostgresStore    | `postgres-store.test.ts` (skips without `TEST_DATABASE_URL`) | —                                               |
| 3 — Wire store       | all existing tests pass                                      | App works with `DATABASE_URL` in dev            |
| 4 — Stack Auth setup | all existing tests pass                                      | `/handler/sign-in` renders, sign-up works       |
| 5 — Middleware       | all existing tests pass                                      | Unauthenticated → redirect; authenticated → app |
| 6 — E2e auth bypass  | `npm run test:e2e` passes unchanged                          | —                                               |
| 7 — Migration        | —                                                            | App shows migrated data via Neon                |
| 8 — Deploy           | —                                                            | Smoke test on phone                             |
