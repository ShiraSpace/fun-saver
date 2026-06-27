import { InMemoryStore } from '../memory-store';
import {
  mockAccount,
  mockSecondAccount,
  createMockTransaction,
} from '@/test-support/fixtures';

const deposit = createMockTransaction();

describe('InMemoryStore', () => {
  it('lists inserted accounts', async () => {
    const store = new InMemoryStore();

    await store.insertAccount(mockAccount);

    expect(await store.listAccounts()).toEqual([mockAccount]);
  });

  it('returns each account with its own embedded wallets', async () => {
    const store = new InMemoryStore();

    await store.insertAccount(mockAccount);
    await store.insertAccount(mockSecondAccount);

    expect(
      (await store.getAccount('a1'))?.wallets.map((wallet) => wallet.id)
    ).toEqual(['w1', 'w2', 'w3']);
    expect((await store.getAccount('a2'))?.wallets).toEqual([]);
    expect(await store.getAccount('missing')).toBeUndefined();
  });

  it('changes an account theme and ignores unknown ids', async () => {
    const store = new InMemoryStore();
    await store.insertAccount(mockAccount);

    await store.setAccountTheme('a1', 'midnight-blue');
    await store.setAccountTheme('missing', 'jungle-quest');

    expect((await store.getAccount('a1'))?.themeId).toBe('midnight-blue');
  });

  it('lists transactions filtered by wallet', async () => {
    const store = new InMemoryStore();

    await store.insertTransactions([deposit]);

    expect(
      (await store.listTransactionsByWallet('w1')).map(
        (transaction) => transaction.id
      )
    ).toEqual(['t1']);
  });
});
