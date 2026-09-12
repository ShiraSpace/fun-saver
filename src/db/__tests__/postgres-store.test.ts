/**
 * @jest-environment node
 */
import { neon } from '@neondatabase/serverless';
import { PostgresStore } from '../postgres-store';
import {
  createMockAccount,
  createMockTransaction,
} from '@/test-support/fixtures';

describe('PostgresStore integration', () => {
  const url = process.env.TEST_DATABASE_URL;

  if (!url) {
    it.skip('skipped because TEST_DATABASE_URL is not set', () => undefined);
    return;
  }

  const runPrefix = `it-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const store = new PostgresStore(url);
  const cleanupSql = neon(url);

  const accountId = (suffix: string): string => `${runPrefix}-a-${suffix}`;
  const walletId = (name: string): string => name;
  const txId = (suffix: string): string => `${runPrefix}-t-${suffix}`;

  afterEach(async () => {
    await cleanupSql`DELETE FROM transactions WHERE id LIKE ${runPrefix + '%'}`;
    await cleanupSql`DELETE FROM accounts WHERE id LIKE ${runPrefix + '%'}`;
  });

  it('round-trips an account with embedded wallets through JSONB', async () => {
    const account = createMockAccount({
      id: accountId('round-trip'),
      wallets: [
        {
          id: walletId('savings'),
          name: 'savings',
          icon: '🐷',
          monthlyInterestRate: 0.15,
          openedAt: '2026-01-01',
          lastInterestDate: '2026-01-01',
        },
      ],
    });

    await store.insertAccount(account);

    expect(await store.getAccount(account.id)).toEqual(account);
    expect(await store.listAccounts()).toContainEqual(account);
  });

  it('scopes listTransactionsByWallet by accountId so two accounts never mix', async () => {
    const accountA = createMockAccount({ id: accountId('a') });
    const accountB = createMockAccount({ id: accountId('b') });
    await store.insertAccount(accountA);
    await store.insertAccount(accountB);

    await store.insertTransactions([
      createMockTransaction({
        id: txId('a1'),
        accountId: accountA.id,
        walletId: 'savings',
        amount: 100,
      }),
      createMockTransaction({
        id: txId('a2'),
        accountId: accountA.id,
        walletId: 'savings',
        amount: 200,
      }),
      createMockTransaction({
        id: txId('b1'),
        accountId: accountB.id,
        walletId: 'savings',
        amount: 999,
      }),
    ]);

    const aRows = await store.listTransactionsByWallet(accountA.id, 'savings');
    const bRows = await store.listTransactionsByWallet(accountB.id, 'savings');

    expect(aRows.map((row) => row.id).sort()).toEqual([txId('a1'), txId('a2')]);
    expect(bRows.map((row) => row.id)).toEqual([txId('b1')]);
  });

  it('updates the theme and returns the updated account', async () => {
    const account = createMockAccount({ id: accountId('theme') });
    await store.insertAccount(account);

    const updated = await store.setAccountTheme(account.id, 'midnight-blue');

    expect(updated?.themeId).toBe('midnight-blue');
    expect((await store.getAccount(account.id))?.themeId).toBe('midnight-blue');
    expect(
      await store.setAccountTheme(accountId('missing'), 'sunshine-quest')
    ).toBeUndefined();
  });
});
