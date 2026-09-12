/**
 * @jest-environment node
 */
import {
  createMockAccount,
  createMockTransaction,
} from '@/test-utils/fixtures';
import { withLiveStore } from './live-store';

describe('PostgresTransactions', () => {
  const { store, accountId, txId } = withLiveStore();

  it('scopes listByWallet by accountId so two accounts never mix', async () => {
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
});
