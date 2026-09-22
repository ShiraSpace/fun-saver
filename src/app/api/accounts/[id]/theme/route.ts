import { getStore } from '@/db';
import { THEMES, type ThemeId } from '@/theme/registry';
import { jsonBody } from '../../../json-body';
import { accountNotFound, badRequest } from '../../../responses';
import { withAccountEditor } from '../with-account-editor';

interface ThemeBody {
  themeId: string;
}

export const PUT = withAccountEditor(async (request, id) => {
  const body = await jsonBody<ThemeBody>(request);

  if (!body || !(body.themeId in THEMES)) {
    return badRequest('unknown theme');
  }

  const updated = await getStore().setAccountTheme(id, body.themeId as ThemeId);

  if (!updated) {
    return accountNotFound();
  }

  return Response.json(updated);
});
