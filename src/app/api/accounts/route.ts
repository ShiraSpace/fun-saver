import { StatusCodes } from 'http-status-codes';
import { getStore } from '@/db';
import { validNewAccount } from '@/lib/account-input';
import { AccountsStore } from '@/lib/accounts-store';
import { today } from '@/lib/clock';

export async function POST(request: Request): Promise<Response> {
  const input = validNewAccount(await request.json().catch(() => null));

  if (!input) {
    return Response.json(
      { error: 'invalid new account' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const account = await new AccountsStore(getStore()).createAccount(
    input,
    today()
  );

  return Response.json(account, { status: StatusCodes.CREATED });
}
