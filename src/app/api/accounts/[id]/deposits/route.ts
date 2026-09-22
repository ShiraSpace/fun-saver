import { getStore } from '@/db';
import { addDeposit } from '@/lib/transactions';
import { shekelsToAgorot } from '@/lib/money';
import { ValidationError } from '@/lib/errors';
import { today } from '@/lib/clock';
import { validDeposit } from '@/lib/transaction-input';
import { jsonBody } from '@/app/api/json-body';
import { accountNotFound, badRequest } from '@/app/api/responses';
import { withAccountEditor } from '../with-account-editor';

export const POST = withAccountEditor(async (request, id) => {
  const store = getStore();
  const account = await store.getAccount(id);

  if (!account) {
    return accountNotFound();
  }

  const amount = validDeposit(await jsonBody(request));

  if (amount === undefined) {
    return badRequest('invalid deposit');
  }

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
      return badRequest(error.message);
    }

    throw error;
  }
});
