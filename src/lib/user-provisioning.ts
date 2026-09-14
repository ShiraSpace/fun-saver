import type { DataStore } from '@/db/data-store';
import { newId } from './ids';
import type { User } from './types';

export interface GoogleIdentity {
  providerAccountId: string;
  email: string;
  name: string;
}

export async function provisionUser(
  store: DataStore,
  identity: GoogleIdentity
): Promise<User> {
  const existing = await store.findUserByProvider(
    'google',
    identity.providerAccountId
  );

  if (existing) {
    return existing;
  }

  const user = newGoogleUser(identity);
  await store.insertUser(user);

  return user;
}

function newGoogleUser(identity: GoogleIdentity): User {
  return {
    id: newId(),
    provider: 'google',
    providerAccountId: identity.providerAccountId,
    email: identity.email,
    name: identity.name,
    createdAt: new Date().toISOString(),
  };
}
