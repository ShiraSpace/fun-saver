import { getStore } from '@/db';
import { addWithdrawal } from '@/lib/transactions';
import { shekelsToAgorot } from '@/lib/money';
import { OverdraftError, ValidationError } from '@/lib/errors';
import { today } from '@/lib/clock';
import { jsonBody } from '../../../json-body';
import { accountNotFound, badRequest } from '../../../responses';
import { withAccountEditor } from '../with-account-editor';

interface WithdrawalBody {
  walletId: string;
  amount: number;
}

export const POST = withAccountEditor(async (request, id) => {
  const store = getStore();
  const account = await store.getAccount(id);

  if (!account) {
    return accountNotFound();
  }

  const body = await jsonBody<WithdrawalBody>(request);

  if (!body) {
    return badRequest('invalid withdrawal');
  }

  try {
    const transaction = await addWithdrawal({
      store,
      account,
      walletId: body.walletId,
      amountAgorot: shekelsToAgorot(body.amount),
      asOf: today(),
    });

    return Response.json(transaction);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof OverdraftError) {
      return badRequest(error.message);
    }

    throw error;
  }
});
