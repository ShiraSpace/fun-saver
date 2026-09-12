/**
 * @jest-environment node
 */
import { createMockAccount, mockAccountEdit } from '@/test-utils/fixtures';
import { liveDatabaseUrl, withLiveStore } from './live-store';

describe('PostgresAccounts', () => {
  if (!liveDatabaseUrl) {
    it.skip('skipped because TEST_DATABASE_URL is not set', () => undefined);
    return;
  }

  const { store, accountId } = withLiveStore(liveDatabaseUrl);

  it('round-trips an account with embedded wallets through JSONB', async () => {
    const account = createMockAccount({
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

    await store.insertAccount(account);

    expect(await store.getAccount(account.id)).toEqual(account);
    expect(await store.listAccounts()).toContainEqual(account);
  });

  it('updates the theme and returns the updated account', async () => {
    const account = createMockAccount({ id: accountId('theme') });
    await store.insertAccount(account);

    const updated = await store.setAccountTheme(account.id, 'midnight-blue');

    expect(updated?.themeId).toBe('midnight-blue');
    expect((await store.getAccount(account.id))?.themeId).toBe('midnight-blue');
    expect(
      await store.setAccountTheme(accountId('missing'), 'sunshine-quest')
    ).toBeUndefined();
  });

  describe('edit account', () => {
    it('updates the name and avatar and returns the updated account', async () => {
      const account = createMockAccount({ id: accountId('edit-both') });
      await store.insertAccount(account);

      const updated = await store.updateAccount(account.id, mockAccountEdit);

      expect(updated).toMatchObject(mockAccountEdit);
      expect(await store.getAccount(account.id)).toMatchObject(mockAccountEdit);
    });

    it('leaves the columns a partial edit does not carry alone', async () => {
      const account = createMockAccount({ id: accountId('edit-partial') });
      await store.insertAccount(account);

      await store.updateAccount(account.id, { name: mockAccountEdit.name });

      expect(await store.getAccount(account.id)).toMatchObject({
        name: mockAccountEdit.name,
        avatarId: account.avatarId,
        themeId: account.themeId,
        wallets: account.wallets,
      });
    });

    it('returns the account untouched when the edit carries nothing', async () => {
      const account = createMockAccount({ id: accountId('edit-empty') });
      await store.insertAccount(account);

      expect(await store.updateAccount(account.id, {})).toEqual(account);
    });

    it('returns undefined for an unknown account', async () => {
      expect(
        await store.updateAccount(accountId('missing'), mockAccountEdit)
      ).toBeUndefined();
    });
  });
});
