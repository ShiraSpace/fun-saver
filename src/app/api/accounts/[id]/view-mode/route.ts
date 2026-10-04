import { getStore } from '@/db';
import { asObject } from '@/lib/json-object';
import { isViewMode } from '@/lib/account/view-mode';
import { jsonBody } from '@/app/api/json-body';
import { API_ERRORS } from '@/app/api/constants';
import { accountNotFound, badRequest } from '@/app/api/responses';
import { withAccountEditor } from '../with-account-editor';

export const PUT = withAccountEditor(async (request, id) => {
  const body = asObject(await jsonBody(request));

  if (!body) {
    return badRequest(API_ERRORS.invalidViewModeRequest);
  }

  if (!isViewMode(body.viewMode)) {
    return badRequest(API_ERRORS.unknownViewMode);
  }

  const updated = await getStore().setAccountViewMode(id, body.viewMode);

  if (!updated) {
    return accountNotFound();
  }

  return Response.json(updated);
});
