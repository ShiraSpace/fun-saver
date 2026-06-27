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

  const account = await store.getAccount(id);

  if (!account) {
    return Response.json({ error: 'account not found' }, { status: 404 });
  }

  const { amount } = (await request.json()) as DepositBody;

  try {
    const transactions = await addDeposit({
      store,
      account,
      amountAgorot: shekelsToAgorot(amount),
      asOf: today(),
    });

    return Response.json(transactions);
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    throw error;
  }
}
