/**
 * @jest-environment node
 */
import {
  createMockAccount,
  createMockTransaction,
  mockTransactions,
} from '@/test-utils/fixtures';
import { withTestDatabase } from './test-database';

describe('PostgresTransactions', () => {
  const { store, accountId, transactionId } = withTestDatabase();
  const accountA = createMockAccount({ id: accountId('a') });
  const accountB = createMockAccount({ id: accountId('b') });

  beforeEach(async () => {
    await store.insertAccount(accountA);
    await store.insertAccount(accountB);
  });

  it('scopes listByWallet by accountId so two accounts never mix', async () => {
    await store.insertTransactions([
      createMockTransaction({
        id: transactionId('a1'),
        accountId: accountA.id,
        walletId: 'savings',
        amount: 100,
      }),
      createMockTransaction({
        id: transactionId('a2'),
        accountId: accountA.id,
        walletId: 'savings',
        amount: 200,
      }),
      createMockTransaction({
        id: transactionId('b1'),
        accountId: accountB.id,
        walletId: 'savings',
        amount: 999,
      }),
    ]);

    const accountATransactions = await store.listTransactionsByWallet(
      accountA.id,
      'savings'
    );
    const accountBTransactions = await store.listTransactionsByWallet(
      accountB.id,
      'savings'
    );

    expect(
      accountATransactions.map((transaction) => transaction.id).sort()
    ).toEqual([transactionId('a1'), transactionId('a2')]);
    expect(accountBTransactions.map((transaction) => transaction.id)).toEqual([
      transactionId('b1'),
    ]);
  });

  it('gathers every wallet of one child’s history, and none of another child’s', async () => {
    const accountATransactions = mockTransactions.map((transaction) => ({
      ...transaction,
      id: transactionId(transaction.id),
      accountId: accountA.id,
    }));
    await store.insertTransactions([
      ...accountATransactions,
      createMockTransaction({
        id: transactionId('b1'),
        accountId: accountB.id,
      }),
    ]);

    const listedTransactions = await store.listTransactionsByAccount(
      accountA.id
    );

    expect(new Set(listedTransactions)).toEqual(new Set(accountATransactions));
  });

  it('tells the history in the order it happened, same-day transactions in the order they were made', async () => {
    await store.insertTransactions([
      createMockTransaction({
        id: transactionId('evening'),
        accountId: accountA.id,
        createdAt: '2026-01-01T09:00:00.000Z',
      }),
      createMockTransaction({
        id: transactionId('morning'),
        accountId: accountA.id,
        createdAt: '2026-01-01T08:00:00.000Z',
      }),
    ]);

    const listedTransactions = await store.listTransactionsByAccount(
      accountA.id
    );

    expect(listedTransactions.map((transaction) => transaction.id)).toEqual([
      transactionId('morning'),
      transactionId('evening'),
    ]);
  });
});
