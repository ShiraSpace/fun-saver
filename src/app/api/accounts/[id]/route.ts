import { StatusCodes } from 'http-status-codes';
import { getStore } from '@/db';
import { validAccountEdits } from '@/lib/account-input';
import { AccountsStore } from '@/lib/accounts-store';
import { withAccountEditor } from './with-account-editor';

export const PUT = withAccountEditor(async (editAccountRequest, id) => {
  const editAccount = await editAccountRequest.json().catch(() => null);
  const edits = validAccountEdits(editAccount);

  if (!edits) {
    return Response.json(
      { error: 'invalid account edits' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const updated = await new AccountsStore(getStore()).updateAccount(id, edits);

  if (!updated) {
    return Response.json(
      { error: 'account not found' },
      { status: StatusCodes.NOT_FOUND }
    );
  }

  return Response.json(updated);
});
