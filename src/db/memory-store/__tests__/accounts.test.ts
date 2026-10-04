import { InMemoryStore } from '../index';
import { DuplicateAccountError } from '@/lib/account/errors';
import { VIEW_MODE } from '@/lib/account/view-mode';
import { THEME_ID } from '@/theme/registry';
import {
  createMockAccount,
  mockAccount,
  mockAccountEdits,
  mockSiblingAccount,
} from '@/test-utils/mocks/account.mocks';

const mockPristineAccount = createMockAccount();

describe('InMemoryStore accounts', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('stores an inserted account', async () => {
    await store.insertAccount(mockAccount);

    expect(await store.getAccount(mockAccount.id)).toEqual(mockAccount);
  });

  it('rejects a second insert of the same account', async () => {
    await store.insertAccount(mockAccount);

    await expect(store.insertAccount(mockAccount)).rejects.toThrow(
      DuplicateAccountError
    );
  });

  it('returns each account with its own embedded wallets', async () => {
    await store.insertAccount(mockAccount);
    await store.insertAccount(mockSiblingAccount);

    expect(
      (await store.getAccount('a1'))?.wallets.map((wallet) => wallet.id)
    ).toEqual(['w1', 'w2', 'w3']);
    expect((await store.getAccount('a2'))?.wallets).toEqual([]);
    expect(await store.getAccount('missing')).toBeUndefined();
  });

  describe('a parent turns child view on for one of two children', () => {
    beforeEach(async () => {
      await store.insertAccount(createMockAccount());
      await store.insertAccount(mockSiblingAccount);
      await store.setAccountViewMode(mockAccount.id, VIEW_MODE.child);
    });

    it('shows that child the child screen', async () => {
      expect((await store.getAccount(mockAccount.id))?.viewMode).toBe(
        VIEW_MODE.child
      );
    });

    it('leaves the sibling on the parent screen', async () => {
      expect((await store.getAccount(mockSiblingAccount.id))?.viewMode).toBe(
        VIEW_MODE.parent
      );
    });
  });

  it('ignores a view change for an account that does not exist', async () => {
    await store.insertAccount(createMockAccount());

    expect(
      await store.setAccountViewMode('missing', VIEW_MODE.child)
    ).toBeUndefined();
  });

  it('changes an account theme and ignores unknown ids', async () => {
    await store.insertAccount(createMockAccount());

    await store.setAccountTheme('a1', THEME_ID.midnightBlue);
    await store.setAccountTheme('missing', THEME_ID.jungleQuest);

    expect((await store.getAccount('a1'))?.themeId).toBe(THEME_ID.midnightBlue);
  });

  describe('edit account', () => {
    beforeEach(async () => {
      await store.insertAccount(createMockAccount());
    });

    it('updates the name and avatar', async () => {
      const updated = await store.updateAccount('a1', mockAccountEdits);

      expect(updated).toMatchObject(mockAccountEdits);
      expect(await store.getAccount('a1')).toMatchObject(mockAccountEdits);
    });

    it('leaves untouched fields alone on a partial update', async () => {
      await store.updateAccount('a1', { name: mockAccountEdits.name });

      expect(await store.getAccount('a1')).toMatchObject({
        name: mockAccountEdits.name,
        avatarId: mockPristineAccount.avatarId,
        wallets: mockPristineAccount.wallets,
      });
    });

    it('returns undefined for an unknown id', async () => {
      expect(
        await store.updateAccount('missing', mockAccountEdits)
      ).toBeUndefined();
    });
  });
});
