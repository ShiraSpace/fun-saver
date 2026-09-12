/**
 * @jest-environment node
 */
import { PostgresStore } from '../postgres-store';
import { createMockAccount, mockAccountEdit } from '@/test-support/fixtures';

const mockQuery = jest.fn();

jest.mock('@neondatabase/serverless', () => ({
  neon: (): { query: jest.Mock } => ({ query: mockQuery }),
}));

const account = createMockAccount();
const accountRow = {
  id: account.id,
  name: account.name,
  avatar_id: account.avatarId,
  is_active: account.isActive,
  theme_id: account.themeId,
  wallets: account.wallets,
};

describe('PostgresStore', () => {
  let store: PostgresStore;

  beforeEach(() => {
    mockQuery.mockReset().mockResolvedValue([accountRow]);
    store = new PostgresStore('postgres://stub');
  });

  describe('edit account', () => {
    it('sets only the columns the edit carries', async () => {
      await store.updateAccount(account.id, mockAccountEdit);

      const [text, params] = mockQuery.mock.calls[0];
      expect(text).toContain('name = $1');
      expect(text).toContain('avatar_id = $2');
      expect(text).toContain('WHERE id = $3');
      expect(params).toEqual([
        mockAccountEdit.name,
        mockAccountEdit.avatarId,
        account.id,
      ]);
    });

    it('leaves the avatar column out of a name-only edit', async () => {
      await store.updateAccount(account.id, { name: mockAccountEdit.name });

      const [text, params] = mockQuery.mock.calls[0];
      expect(text).toContain('name = $1');
      expect(text).not.toContain('avatar_id');
      expect(params).toEqual([mockAccountEdit.name, account.id]);
    });

    it('returns the account unchanged when there is nothing to edit', async () => {
      expect(await store.updateAccount(account.id, {})).toEqual(account);

      const [text] = mockQuery.mock.calls[0];
      expect(text).toContain('SELECT');
      expect(text).not.toContain('UPDATE');
    });

    it('returns undefined for an unknown account', async () => {
      mockQuery.mockResolvedValue([]);

      expect(
        await store.updateAccount('missing', mockAccountEdit)
      ).toBeUndefined();
    });
  });
});
