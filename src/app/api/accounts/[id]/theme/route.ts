import { getStore } from '@/db';
import { AccountsStore } from '@/lib/accounts-store';
import { THEMES, type ThemeId } from '@/theme/registry';

interface ThemeBody {
  themeId: string;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(
  request: Request,
  context: RouteContext
): Promise<Response> {
  const { id } = await context.params;
  const { themeId } = (await request.json()) as ThemeBody;

  if (!(themeId in THEMES)) {
    return Response.json({ error: 'unknown theme' }, { status: 400 });
  }

  const store = getStore();
  const account = await store.getAccount(id);

  if (!account) {
    return Response.json({ error: 'account not found' }, { status: 404 });
  }

  const updated = await new AccountsStore(store).setTheme(
    id,
    themeId as ThemeId
  );

  return Response.json(updated);
}
