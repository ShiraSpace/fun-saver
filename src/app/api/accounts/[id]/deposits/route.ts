import { getStore } from '@/db';
import { addDeposit } from '@/lib/transactions';
import { shekelsToAgorot } from '@/lib/money';
import { ValidationError } from '@/lib/errors';
import { today } from '@/lib/clock';
import { jsonBody } from '../../../json-body';
import { accountNotFound, badRequest } from '../../../responses';
import { withAccountEditor } from '../with-account-editor';

interface DepositBody {
  amount: number;
}

export const POST = withAccountEditor(async (request, id) => {
  const store = getStore();
  const account = await store.getAccount(id);

  if (!account) {
    return accountNotFound();
  }

  const body = await jsonBody<DepositBody>(request);

  if (!body) {
    return badRequest('invalid deposit');
  }

  try {
    const transactions = await addDeposit({
      store,
      account,
      amountAgorot: shekelsToAgorot(body.amount),
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
