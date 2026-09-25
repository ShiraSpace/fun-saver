import type { User } from './types';

export class DuplicateUserError extends Error {
  constructor(user: User) {
    super(
      `${user.provider} account ${user.providerAccountId} already has a user`
    );
  }
}
