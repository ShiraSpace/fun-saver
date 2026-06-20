import { InMemoryStore } from '@/db/memory-store';
import { AccountsStore } from '../accounts-store';
import { CREATE_ACCOUNT_INPUT } from '@/test-support/fixtures';

describe('AccountsStore', () => {
  it('creates an active account with the given name and avatar', async () => {
    const accountsStore = new AccountsStore(new InMemoryStore());

    const account = await accountsStore.createAccount(CREATE_ACCOUNT_INPUT);

    expect(typeof account.id).toBe('string');
    expect(account.id.length).toBeGreaterThan(0);
    expect(account).toMatchObject({
      name: CREATE_ACCOUNT_INPUT.name,
      avatarId: CREATE_ACCOUNT_INPUT.avatarId,
      isActive: true,
    });
  });
});
