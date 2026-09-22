import { getStore } from '@/db';
import { validAccountEdits } from '@/lib/account-input';
import { AccountsStore } from '@/lib/accounts-store';
import { jsonBody } from '../../json-body';
import { accountNotFound, badRequest } from '../../responses';
import { withAccountEditor } from './with-account-editor';

export const PUT = withAccountEditor(async (editAccountRequest, id) => {
  const edits = validAccountEdits(await jsonBody(editAccountRequest));

  if (!edits) {
    return badRequest('invalid account edits');
  }

  const updated = await new AccountsStore(getStore()).updateAccount(id, edits);

  if (!updated) {
    return accountNotFound();
  }

  return Response.json(updated);
});
