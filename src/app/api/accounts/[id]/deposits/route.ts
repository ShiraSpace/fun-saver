import { StatusCodes } from 'http-status-codes';
import { getStore } from '@/db';
import { addDeposit } from '@/lib/transactions';
import { shekelsToAgorot } from '@/lib/money';
import { ValidationError } from '@/lib/errors';
import { today } from '@/lib/clock';
import { withAccountEditor } from '../with-account-editor';

interface DepositBody {
  amount: number;
}

export const POST = withAccountEditor(async (request, id) => {
  const store = getStore();
  const account = await store.getAccount(id);

  if (!account) {
    return Response.json(
      { error: 'account not found' },
      { status: StatusCodes.NOT_FOUND }
    );
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
      return Response.json(
        { error: error.message },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    throw error;
  }
});
