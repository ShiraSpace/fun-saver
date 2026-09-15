import type { AuthProvider, User } from '@/lib/types';

export function findUserByIdentity(
  users: User[],
  provider: AuthProvider,
  providerAccountId: string
): User | undefined {
  return users.find(
    (user) =>
      user.provider === provider && user.providerAccountId === providerAccountId
  );
}

export function isKnownUser(users: User[], userId: string): boolean {
  return users.some((user) => user.id === userId);
}
