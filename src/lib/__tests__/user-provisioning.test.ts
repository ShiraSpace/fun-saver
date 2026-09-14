import { InMemoryStore } from '@/db/memory-store';
import { createMockUser } from '@/test-utils/fixtures';
import { provisionUser } from '../user-provisioning';

const { providerAccountId, email, name } = createMockUser();

const identity = { providerAccountId, email, name };

describe('provisionUser', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('creates a user the first time a google sub signs in', async () => {
    const user = await provisionUser(store, identity);

    expect(user).toMatchObject({ provider: 'google', ...identity });
    expect(
      await store.findUserByProvider('google', identity.providerAccountId)
    ).toEqual(user);
  });

  it('reuses the existing user when the same google sub signs in again', async () => {
    const first = await provisionUser(store, identity);

    const second = await provisionUser(store, { ...identity, name: 'אלי פ' });

    expect(second).toEqual(first);
  });
});
