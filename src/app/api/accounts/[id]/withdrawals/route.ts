import { getStore } from '@/db';
import { addWithdrawal } from '@/lib/transactions';
import { shekelsToAgorot } from '@/lib/money';
import { OverdraftError, ValidationError } from '@/lib/errors';
import { today } from '@/lib/clock';

interface WithdrawalBody {
  walletId: string;
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

  const { walletId, amount } = (await request.json()) as WithdrawalBody;

  try {
    const transaction = await addWithdrawal({
      store,
      account,
      walletId,
      amountAgorot: shekelsToAgorot(amount),
      asOf: today(),
    });

    return Response.json(transaction);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof OverdraftError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    throw error;
  }
}
