import { StatusCodes } from 'http-status-codes';
import { getStore } from '@/db';
import { addWithdrawal } from '@/lib/transactions';
import { shekelsToAgorot } from '@/lib/money';
import { OverdraftError, ValidationError } from '@/lib/errors';
import { today } from '@/lib/clock';
import { withAccountEditor } from '../with-account-editor';

interface WithdrawalBody {
  walletId: string;
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
      return Response.json(
        { error: error.message },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    throw error;
  }
});
