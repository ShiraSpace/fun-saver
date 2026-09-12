import { InMemoryStore } from '../memory-store';
import {
  createMockAccount,
  mockAccount,
  mockSecondAccount,
  createMockTransaction,
  mockAccountEdit,
} from '@/test-support/fixtures';

const deposit = createMockTransaction();
const pristine = createMockAccount();

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
    await store.insertAccount(createMockAccount());

    await store.setAccountTheme('a1', 'midnight-blue');
    await store.setAccountTheme('missing', 'jungle-quest');

    expect((await store.getAccount('a1'))?.themeId).toBe('midnight-blue');
  });

  describe('edit account', () => {
    let store: InMemoryStore;

    beforeEach(async () => {
      store = new InMemoryStore();
      await store.insertAccount(createMockAccount());
    });

    it('updates the name and avatar', async () => {
      const updated = await store.updateAccount('a1', mockAccountEdit);

      expect(updated).toMatchObject(mockAccountEdit);
      expect(await store.getAccount('a1')).toMatchObject(mockAccountEdit);
    });

    it('leaves untouched fields alone on a partial update', async () => {
      await store.updateAccount('a1', { name: mockAccountEdit.name });

      expect(await store.getAccount('a1')).toMatchObject({
        name: mockAccountEdit.name,
        avatarId: pristine.avatarId,
        wallets: pristine.wallets,
      });
    });

    it('returns undefined for an unknown id', async () => {
      expect(
        await store.updateAccount('missing', mockAccountEdit)
      ).toBeUndefined();
    });
  });

  it('lists transactions filtered by wallet', async () => {
    const store = new InMemoryStore();

    await store.insertTransactions([deposit]);

    expect(
      (await store.listTransactionsByWallet('a1', 'w1')).map(
        (transaction) => transaction.id
      )
    ).toEqual(['t1']);
  });
});
