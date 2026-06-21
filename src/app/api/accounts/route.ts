import { getStore } from '@/db';
import { AccountsStore, type CreateAccountInput } from '@/lib/accounts-store';
import { today } from '@/lib/clock';

export async function POST(request: Request): Promise<Response> {
  const input = (await request.json()) as CreateAccountInput;
  const account = await new AccountsStore(getStore()).createAccount(
    input,
    today()
  );
  return Response.json(account, { status: 201 });
}
