import { StatusCodes } from 'http-status-codes';
import { signedInUserId } from '@/auth';
import { getStore } from '@/db';
import { validNewAccount } from '@/lib/account-input';
import { AccountsStore } from '@/lib/accounts-store';
import { jsonBody } from '@/app/api/json-body';
import { API_ERRORS } from '@/app/api/constants';
import { badRequest, notSignedIn } from '@/app/api/responses';

export async function POST(request: Request): Promise<Response> {
  const userId = await signedInUserId();

  if (!userId) {
    return notSignedIn();
  }

  const input = validNewAccount(await jsonBody(request));

  if (!input) {
    return badRequest(API_ERRORS.invalidNewAccount);
  }

  const account = await new AccountsStore(getStore()).createAccount({
    input,
    ownerId: userId,
  });

  return Response.json(account, { status: StatusCodes.CREATED });
}
