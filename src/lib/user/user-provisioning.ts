import type { DataStore } from '@/db/data-store';
import { now } from '@/lib/clock';
import { GOOGLE_PROVIDER } from './constants';
import { DuplicateUserError } from './errors';
import { newId } from '@/lib/ids';
import type { User } from './types';

export interface GoogleIdentity {
  providerAccountId: string;
  email: string;
  name: string;
}

export interface GoogleProfile {
  sub?: string | null;
  email?: string | null;
  name?: string | null;
}

export function googleIdentity(
  profile?: GoogleProfile
): GoogleIdentity | undefined {
  const { sub, email, name } = profile ?? {};

  if (!sub || !email) {
    return;
  }

  return { providerAccountId: sub, email, name: displayName(name, email) };
}

export async function provisionUser(
  store: DataStore,
  identity: GoogleIdentity
): Promise<User> {
  const existing = await findUserByGoogleIdentity(
    store,
    identity.providerAccountId
  );

  if (existing) {
    return existing;
  }

  return insertGoogleUser(store, identity);
}

async function insertGoogleUser(
  store: DataStore,
  identity: GoogleIdentity
): Promise<User> {
  const user = newGoogleUser(identity);

  try {
    await store.insertUser(user);
  } catch (error) {
    return userCreatedConcurrently(store, identity, error);
  }

  return user;
}

async function userCreatedConcurrently(
  store: DataStore,
  identity: GoogleIdentity,
  error: unknown
): Promise<User> {
  if (!(error instanceof DuplicateUserError)) {
    throw error;
  }

  const concurrentUser = await findUserByGoogleIdentity(
    store,
    identity.providerAccountId
  );

  if (!concurrentUser) {
    throw error;
  }

  return concurrentUser;
}

function findUserByGoogleIdentity(
  store: DataStore,
  providerAccountId: string
): Promise<User | undefined> {
  return store.findUserByIdentity(GOOGLE_PROVIDER, providerAccountId);
}

export function displayName(
  name: string | null | undefined,
  email: string
): string {
  return name || emailLocalPart(email);
}

function emailLocalPart(email: string): string {
  return email.split('@')[0];
}

function newGoogleUser(identity: GoogleIdentity): User {
  return {
    id: newId(),
    provider: GOOGLE_PROVIDER,
    providerAccountId: identity.providerAccountId,
    email: identity.email,
    name: identity.name,
    createdAt: now(),
  };
}
