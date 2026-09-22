import { DuplicateAccountError, UnknownOwnerError } from '@/lib/errors';

const UNIQUE_VIOLATION = '23505';
const FOREIGN_KEY_VIOLATION = '23503';

export interface AttemptedAccountWrite {
  accountId: string;
  ownerId?: string;
}

export function toAccountWriteError(
  error: unknown,
  { accountId, ownerId }: AttemptedAccountWrite
): unknown {
  const { code } = error as { code?: string };

  if (code === UNIQUE_VIOLATION) {
    return new DuplicateAccountError(accountId);
  }

  if (code === FOREIGN_KEY_VIOLATION && ownerId) {
    return new UnknownOwnerError(ownerId);
  }

  return error;
}
