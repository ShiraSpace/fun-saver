import { StatusCodes } from 'http-status-codes';
import { signedInUserId } from '@/auth';
import { getStore } from '@/db';
import { validNewAccount } from '@/lib/account-input';
import { AccountsStore } from '@/lib/accounts-store';

export async function POST(request: Request): Promise<Response> {
  const userId = await signedInUserId();

  if (!userId) {
    return Response.json(
      { error: 'not signed in' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const input = validNewAccount(await request.json().catch(() => null));

  if (!input) {
    return Response.json(
      { error: 'invalid new account' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const account = await new AccountsStore(getStore()).createAccount({
    input,
    ownerId: userId,
  });

  return Response.json(account, { status: StatusCodes.CREATED });
}
