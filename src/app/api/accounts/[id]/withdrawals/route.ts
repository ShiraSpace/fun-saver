import { getStore } from '@/db';
import { addWithdrawal } from '@/lib/transaction/transactions';
import { shekelsToAgorot } from '@/lib/money';
import { OverdraftError } from '@/lib/transaction/errors';
import { ValidationError } from '@/lib/errors';
import { today } from '@/lib/clock';
import { validWithdrawal } from '@/lib/transaction/transaction-input';
import { jsonBody } from '@/app/api/json-body';
import { API_ERRORS } from '@/app/api/constants';
import { accountNotFound, badRequest } from '@/app/api/responses';
import { withAccountEditor } from '../with-account-editor';

export const POST = withAccountEditor(async (request, id) => {
  const store = getStore();
  const account = await store.getAccount(id);

  if (!account) {
    return accountNotFound();
  }

  const withdrawal = validWithdrawal(await jsonBody(request));

  if (!withdrawal) {
    return badRequest(API_ERRORS.invalidWithdrawal);
  }

  try {
    const transaction = await addWithdrawal({
      store,
      account,
      walletId: withdrawal.walletId,
      amountAgorot: shekelsToAgorot(withdrawal.amountShekels),
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
