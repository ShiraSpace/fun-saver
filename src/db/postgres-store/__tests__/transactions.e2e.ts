/**
 * @jest-environment node
 */
import {
  createMockAccount,
  createMockTransaction,
  mockTransactions,
} from '@/test-utils/fixtures';
import { withLiveStore } from './live-store';

describe('PostgresTransactions', () => {
  const { store, accountId, txId } = withLiveStore();
  const accountA = createMockAccount({ id: accountId('a') });
  const accountB = createMockAccount({ id: accountId('b') });

  beforeEach(async () => {
    await store.insertAccount(accountA);
    await store.insertAccount(accountB);
  });

  it('scopes listByWallet by accountId so two accounts never mix', async () => {
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

  it('lists an account across its wallets and never another account', async () => {
    const ledger = mockTransactions.map((row) => ({
      ...row,
      id: txId(row.id),
      accountId: accountA.id,
    }));
    await store.insertTransactions([
      ...ledger,
      createMockTransaction({ id: txId('b1'), accountId: accountB.id }),
    ]);

    const rows = await store.listTransactionsByAccount(accountA.id);

    expect(new Set(rows)).toEqual(new Set(ledger));
  });

  it('returns an account oldest first, ties broken by write time', async () => {
    await store.insertTransactions([
      createMockTransaction({
        id: txId('evening'),
        accountId: accountA.id,
        createdAt: '2026-01-01T09:00:00.000Z',
      }),
      createMockTransaction({
        id: txId('morning'),
        accountId: accountA.id,
        createdAt: '2026-01-01T08:00:00.000Z',
      }),
    ]);

    const rows = await store.listTransactionsByAccount(accountA.id);

    expect(rows.map((row) => row.id)).toEqual([
      txId('morning'),
      txId('evening'),
    ]);
  });
});
