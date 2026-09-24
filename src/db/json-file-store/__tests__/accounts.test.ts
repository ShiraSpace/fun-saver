import { JsonFileStore } from '../index';
import { DuplicateAccountError } from '@/lib/errors';
import { THEME_ID } from '@/theme/registry';
import {
  mockAccount,
  mockAccountEdits,
  mockSiblingAccount,
} from '@/test-utils/fixtures';
import { withTempStoreFile } from '@/test-utils/test-utils';

describe('JsonFileStore accounts', () => {
  const file = withTempStoreFile();
  let store: JsonFileStore;

  beforeEach(() => {
    store = new JsonFileStore(file.path);
  });

  it('rejects a second insert of the same account', async () => {
    await store.insertAccount(mockAccount);

    await expect(store.insertAccount(mockAccount)).rejects.toThrow(
      DuplicateAccountError
    );
  });

  it('persists accounts with embedded wallets across instances', async () => {
    await new JsonFileStore(file.path).insertAccount(mockAccount);

    const reopened = new JsonFileStore(file.path);
    expect(await reopened.getAccount(mockAccount.id)).toEqual(mockAccount);
    expect(
      (await reopened.getAccount('a1'))?.wallets.map((wallet) => wallet.id)
    ).toEqual(['w1', 'w2', 'w3']);
  });

  it('persists an account theme change across instances', async () => {
    await new JsonFileStore(file.path).insertAccount(mockAccount);

    await new JsonFileStore(file.path).setAccountTheme(
      'a1',
      THEME_ID.midnightBlue
    );

    expect((await new JsonFileStore(file.path).getAccount('a1'))?.themeId).toBe(
      THEME_ID.midnightBlue
    );
  });

  describe('edit account', () => {
    beforeEach(async () => {
      await store.insertAccount(mockAccount);
      await store.insertAccount(mockSiblingAccount);
    });

    it('persists a name and avatar change across instances', async () => {
      const updated = await store.updateAccount('a1', mockAccountEdits);

      expect(updated).toMatchObject(mockAccountEdits);
      expect(await new JsonFileStore(file.path).getAccount('a1')).toMatchObject(
        {
          ...mockAccountEdits,
          wallets: mockAccount.wallets,
        }
      );
    });

    it('leaves the other accounts untouched', async () => {
      await store.updateAccount('a1', mockAccountEdits);

      expect(await new JsonFileStore(file.path).getAccount('a2')).toEqual(
        mockSiblingAccount
      );
    });

    it('returns undefined when updating an unknown account', async () => {
      expect(
        await store.updateAccount('missing', mockAccountEdits)
      ).toBeUndefined();
      expect((await store.getAccount('a1'))?.name).toBe(mockAccount.name);
    });
  });
});
