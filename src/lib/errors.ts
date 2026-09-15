import type { User } from './types';

export class ValidationError extends Error {}

export class OverdraftError extends Error {}

export class DuplicateUserError extends Error {
  constructor(user: User) {
    super(
      `${user.provider} account ${user.providerAccountId} already has a user`
    );
  }
}

export class DuplicateAccountError extends Error {
  constructor(accountId: string) {
    super(`account ${accountId} already exists`);
  }
}

export class UnknownOwnerError extends Error {
  constructor(userId: string) {
    super(`no user ${userId} to own the account`);
  }
}
