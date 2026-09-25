import { StatusCodes } from 'http-status-codes';
import { signedInUser } from '@/auth';
import { getStore } from '@/db';
import { validNewAccount } from '@/lib/account/account-input';
import { AccountsStore } from '@/lib/account/accounts-store';
import { jsonBody } from '@/app/api/json-body';
import { API_ERRORS } from '@/app/api/constants';
import { badRequest, notSignedIn } from '@/app/api/responses';

export async function POST(request: Request): Promise<Response> {
  const user = await signedInUser();

  if (!user) {
    return notSignedIn();
  }

  const input = validNewAccount(await jsonBody(request));

  if (!input) {
    return badRequest(API_ERRORS.invalidNewAccount);
  }

  const account = await new AccountsStore(getStore()).createAccount({
    input,
    ownerId: user.id,
  });

  return Response.json(account, { status: StatusCodes.CREATED });
}
