import { InMemoryStore } from '@/db/memory-store';
import { createAccount } from '../accounts';

describe('createAccount', () => {
  it('creates an active account with the given name and avatar', async () => {
    const store = new InMemoryStore();

    const account = await createAccount(store, { name: 'נועה', avatarId: 'kid-01' });

    expect(account).toMatchObject({ name: 'נועה', avatarId: 'kid-01', isActive: true });
    expect(typeof account.id).toBe('string');
    expect(account.id.length).toBeGreaterThan(0);
  });
});
