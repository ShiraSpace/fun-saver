/**
 * @jest-environment node
 */
import { createMockAccount } from '@/test-utils/mocks/general.mocks';
import {
  createMockTransaction,
  mockTransactions,
} from '@/test-utils/mocks/transaction.mocks';
import { withTestDatabase } from './test-database';

describe('PostgresTransactions', () => {
  const { store, accountId, transactionId } = withTestDatabase();
  const mockAccountA = createMockAccount({ id: accountId('a') });
  const mockAccountB = createMockAccount({ id: accountId('b') });

  beforeEach(async () => {
    await store.insertAccount(mockAccountA);
    await store.insertAccount(mockAccountB);
  });

  it('scopes listByWallet by accountId so two accounts never mix', async () => {
    await store.insertTransactions([
      createMockTransaction({
        id: transactionId('a1'),
        accountId: mockAccountA.id,
        walletId: 'savings',
        amount: 100,
      }),
      createMockTransaction({
        id: transactionId('a2'),
        accountId: mockAccountA.id,
        walletId: 'savings',
        amount: 200,
      }),
      createMockTransaction({
        id: transactionId('b1'),
        accountId: mockAccountB.id,
        walletId: 'savings',
        amount: 999,
      }),
    ]);

    const accountATransactions = await store.listTransactionsByWallet(
      mockAccountA.id,
      'savings'
    );
    const accountBTransactions = await store.listTransactionsByWallet(
      mockAccountB.id,
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
      accountId: mockAccountA.id,
    }));
    await store.insertTransactions([
      ...accountATransactions,
      createMockTransaction({
        id: transactionId('b1'),
        accountId: mockAccountB.id,
      }),
    ]);

    const listedTransactions = await store.listTransactionsByAccount(
      mockAccountA.id
    );

    expect(new Set(listedTransactions)).toEqual(new Set(accountATransactions));
  });

  it('tells the history in the order it happened, same-day transactions in the order they were made', async () => {
    await store.insertTransactions([
      createMockTransaction({
        id: transactionId('evening'),
        accountId: mockAccountA.id,
        createdAt: '2026-01-01T09:00:00.000Z',
      }),
      createMockTransaction({
        id: transactionId('morning'),
        accountId: mockAccountA.id,
        createdAt: '2026-01-01T08:00:00.000Z',
      }),
    ]);

    const listedTransactions = await store.listTransactionsByAccount(
      mockAccountA.id
    );

    expect(listedTransactions.map((transaction) => transaction.id)).toEqual([
      transactionId('morning'),
      transactionId('evening'),
    ]);
  });
});
