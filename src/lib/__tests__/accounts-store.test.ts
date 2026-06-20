import { InMemoryStore } from '@/db/memory-store';
import { AccountsStore } from '../accounts-store';

describe('AccountsStore', () => {
  const name = 'יעל';
  const avatarId = 'kid-03';

  it('creates an active account with the given name and avatar', async () => {
    const accountsStore = new AccountsStore(new InMemoryStore());

    const account = await accountsStore.createAccount({
      name,
      avatarId,
    });

    expect(typeof account.id).toBe('string');
    expect(account.id.length).toBeGreaterThan(0);
    expect(account).toMatchObject({
      name,
      avatarId,
      isActive: true,
    });
  });
});
