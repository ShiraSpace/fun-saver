import { getStore } from '@/db';
import { asObject } from '@/lib/json-object';
import { isThemeId } from '@/theme/registry';
import { jsonBody } from '@/app/api/json-body';
import { API_ERRORS } from '@/app/api/constants';
import { accountNotFound, badRequest } from '@/app/api/responses';
import { withAccountEditor } from '../with-account-editor';

export const PUT = withAccountEditor(async (request, id) => {
  const body = asObject(await jsonBody(request));

  if (!body) {
    return badRequest(API_ERRORS.invalidThemeRequest);
  }

  if (!isThemeId(body.themeId)) {
    return badRequest(API_ERRORS.unknownTheme);
  }

  const updated = await getStore().setAccountTheme(id, body.themeId);

  if (!updated) {
    return accountNotFound();
  }

  return Response.json(updated);
});
