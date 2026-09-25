import { NeonDbError } from '@neondatabase/serverless';
import { DuplicateAccountError, UnknownOwnerError } from '@/lib/account/errors';

const UNIQUE_VIOLATION = '23505';
const FOREIGN_KEY_VIOLATION = '23503';

export interface AttemptedAccountWrite {
  accountId: string;
  ownerId?: string;
}

export function accountWriteError(
  error: unknown,
  { accountId, ownerId }: AttemptedAccountWrite
): unknown {
  if (!(error instanceof NeonDbError)) {
    return error;
  }

  if (error.code === UNIQUE_VIOLATION) {
    return new DuplicateAccountError(accountId);
  }

  if (error.code === FOREIGN_KEY_VIOLATION && ownerId) {
    return new UnknownOwnerError(ownerId);
  }

  return error;
}
