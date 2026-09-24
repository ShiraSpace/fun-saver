import { InMemoryStore } from '@/db/memory-store';
import { mockUser } from '@/test-utils/fixtures';
import { provisionUser, googleIdentity } from '../user-provisioning';

const { providerAccountId, email, name } = mockUser;

const identity = { providerAccountId, email, name };

const profile = { sub: providerAccountId, email, name };

describe('googleIdentity', () => {
  it('maps a google profile onto an identity', () => {
    expect(googleIdentity(profile)).toEqual(identity);
  });

  it('falls back to the email local part when google sends no name', () => {
    expect(googleIdentity({ ...profile, name: null })).toEqual({
      ...identity,
      name: 'eli',
    });
  });

  it('rejects a profile without a sub', () => {
    expect(googleIdentity({ ...profile, sub: null })).toBeUndefined();
  });

  it('rejects a profile without an email', () => {
    expect(googleIdentity({ ...profile, email: null })).toBeUndefined();
  });

  it('rejects a missing profile', () => {
    expect(googleIdentity()).toBeUndefined();
  });
});

describe('provisionUser', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('creates a user the first time a google sub signs in', async () => {
    const user = await provisionUser(store, identity);

    expect(user).toMatchObject({ provider: 'google', ...identity });
    expect(
      await store.findUserByIdentity('google', identity.providerAccountId)
    ).toEqual(user);
  });

  it('reuses the existing user when the same google sub signs in again', async () => {
    const first = await provisionUser(store, identity);

    const second = await provisionUser(store, { ...identity, name: 'אלי פ' });

    expect(second).toEqual(first);
  });

  it('returns the winning row when a concurrent sign-in inserted first', async () => {
    const concurrentUser = await provisionUser(store, identity);
    jest.spyOn(store, 'findUserByIdentity').mockResolvedValueOnce(undefined);

    const loser = await provisionUser(store, identity);

    expect(loser).toEqual(concurrentUser);
  });
});
