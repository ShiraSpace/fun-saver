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
