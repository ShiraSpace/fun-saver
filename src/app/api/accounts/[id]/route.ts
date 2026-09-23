import { getStore } from '@/db';
import { validAccountEdits } from '@/lib/account-input';
import { AccountsStore } from '@/lib/accounts-store';
import { jsonBody } from '@/app/api/json-body';
import { API_ERRORS } from '@/app/api/constants';
import { accountNotFound, badRequest } from '@/app/api/responses';
import { withAccountEditor } from './with-account-editor';

export const PUT = withAccountEditor(async (editAccountRequest, id) => {
  const edits = validAccountEdits(await jsonBody(editAccountRequest));

  if (!edits) {
    return badRequest(API_ERRORS.invalidAccountEdits);
  }

  const updated = await new AccountsStore(getStore()).updateAccount(id, edits);

  if (!updated) {
    return accountNotFound();
  }

  return Response.json(updated);
});
