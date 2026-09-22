import { StatusCodes } from 'http-status-codes';
import { signedInUserId } from '@/auth';
import { getStore } from '@/db';
import { validNewAccount } from '@/lib/account-input';
import { AccountsStore } from '@/lib/accounts-store';
import { jsonBody } from '../json-body';
import { badRequest, notSignedIn } from '../responses';

export async function POST(request: Request): Promise<Response> {
  const userId = await signedInUserId();

  if (!userId) {
    return notSignedIn();
  }

  const input = validNewAccount(await jsonBody(request));

  if (!input) {
    return badRequest('invalid new account');
  }

  const account = await new AccountsStore(getStore()).createAccount({
    input,
    ownerId: userId,
  });

  return Response.json(account, { status: StatusCodes.CREATED });
}
