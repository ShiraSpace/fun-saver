import { getStore } from '@/db';
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

  const updated = await getStore().setAccountTheme(id, themeId as ThemeId);

  if (!updated) {
    return Response.json({ error: 'account not found' }, { status: 404 });
  }

  return Response.json(updated);
}
