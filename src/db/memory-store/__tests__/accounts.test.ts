import { InMemoryStore } from '../index';
import { DuplicateAccountError } from '@/lib/errors';
import {
  createMockAccount,
  mockAccount,
  mockAccountEdit,
  mockSecondAccount,
} from '@/test-utils/fixtures';

const pristine = createMockAccount();

describe('InMemoryStore accounts', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('lists inserted accounts', async () => {
    await store.insertAccount(mockAccount);

    expect(await store.listAccounts()).toEqual([mockAccount]);
  });

  it('rejects a second insert of the same account', async () => {
    await store.insertAccount(mockAccount);

    await expect(store.insertAccount(mockAccount)).rejects.toThrow(
      DuplicateAccountError
    );
  });

  it('returns each account with its own embedded wallets', async () => {
    await store.insertAccount(mockAccount);
    await store.insertAccount(mockSecondAccount);

    expect(
      (await store.getAccount('a1'))?.wallets.map((wallet) => wallet.id)
    ).toEqual(['w1', 'w2', 'w3']);
    expect((await store.getAccount('a2'))?.wallets).toEqual([]);
    expect(await store.getAccount('missing')).toBeUndefined();
  });

  it('changes an account theme and ignores unknown ids', async () => {
    await store.insertAccount(createMockAccount());

    await store.setAccountTheme('a1', 'midnight-blue');
    await store.setAccountTheme('missing', 'jungle-quest');

    expect((await store.getAccount('a1'))?.themeId).toBe('midnight-blue');
  });

  describe('edit account', () => {
    beforeEach(async () => {
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
});
