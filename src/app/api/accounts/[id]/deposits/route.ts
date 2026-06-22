import { getStore } from '@/db';
import { addDeposit } from '@/lib/transactions';
import { shekelsToAgorot } from '@/lib/money';
import { ValidationError } from '@/lib/errors';
import { today } from '@/lib/clock';

interface DepositBody {
  amount: number;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: Request,
  context: RouteContext
): Promise<Response> {
  const { id } = await context.params;
  const store = getStore();

  const accounts = await store.listAccounts();

  if (!accounts.some((account) => account.id === id)) {
    return Response.json({ error: 'account not found' }, { status: 404 });
  }

  const { amount } = (await request.json()) as DepositBody;

  try {
    const transactions = await addDeposit(
      store,
      id,
      shekelsToAgorot(amount),
      today()
    );

    return Response.json(transactions);
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    throw error;
  }
}
