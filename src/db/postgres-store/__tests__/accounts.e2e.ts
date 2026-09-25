/**
 * @jest-environment node
 */
import { DuplicateAccountError } from '@/lib/account/errors';
import { THEME_ID } from '@/theme/registry';
import {
  createMockAccount,
  mockAccountEdits,
} from '@/test-utils/mocks/account.mocks';
import { withTestDatabase } from './test-database';

describe('PostgresAccounts', () => {
  const { store, accountId } = withTestDatabase();

  it('round-trips an account with embedded wallets through JSONB', async () => {
    const mockAccount = createMockAccount({
      id: accountId('round-trip'),
      wallets: [
        {
          id: 'savings',
          name: 'savings',
          icon: '🐷',
          monthlyInterestRate: 0.15,
          openedAt: '2026-01-01',
          lastInterestDate: '2026-01-01',
        },
      ],
    });

    await store.insertAccount(mockAccount);

    expect(await store.getAccount(mockAccount.id)).toEqual(mockAccount);
  });

  it('rejects a second insert of the same account', async () => {
    const mockAccount = createMockAccount({ id: accountId('duplicate') });

    await store.insertAccount(mockAccount);

    await expect(store.insertAccount(mockAccount)).rejects.toThrow(
      DuplicateAccountError
    );
  });

  it('updates the theme and returns the updated account', async () => {
    const mockAccount = createMockAccount({ id: accountId('theme') });
    await store.insertAccount(mockAccount);

    const updated = await store.setAccountTheme(
      mockAccount.id,
      THEME_ID.midnightBlue
    );

    expect(updated?.themeId).toBe(THEME_ID.midnightBlue);
    expect((await store.getAccount(mockAccount.id))?.themeId).toBe(
      THEME_ID.midnightBlue
    );
    expect(
      await store.setAccountTheme(accountId('missing'), THEME_ID.sunshineQuest)
    ).toBeUndefined();
  });

  describe('edit account', () => {
    it('updates the name and avatar and returns the updated account', async () => {
      const mockAccount = createMockAccount({ id: accountId('edit-both') });
      await store.insertAccount(mockAccount);

      const updated = await store.updateAccount(
        mockAccount.id,
        mockAccountEdits
      );

      expect(updated).toMatchObject(mockAccountEdits);
      expect(await store.getAccount(mockAccount.id)).toMatchObject(
        mockAccountEdits
      );
    });

    it('leaves the columns a partial edit does not carry alone', async () => {
      const mockAccount = createMockAccount({ id: accountId('edit-partial') });
      await store.insertAccount(mockAccount);

      await store.updateAccount(mockAccount.id, {
        name: mockAccountEdits.name,
      });

      expect(await store.getAccount(mockAccount.id)).toMatchObject({
        name: mockAccountEdits.name,
        avatarId: mockAccount.avatarId,
        themeId: mockAccount.themeId,
        wallets: mockAccount.wallets,
      });
    });

    it('returns the account untouched when the edit carries nothing', async () => {
      const mockAccount = createMockAccount({ id: accountId('edit-empty') });
      await store.insertAccount(mockAccount);

      expect(await store.updateAccount(mockAccount.id, {})).toEqual(
        mockAccount
      );
    });

    it('returns undefined for an unknown account', async () => {
      expect(
        await store.updateAccount(accountId('missing'), mockAccountEdits)
      ).toBeUndefined();
    });
  });
});
