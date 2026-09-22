import { StatusCodes } from 'http-status-codes';
import { signedInUserId } from '@/auth';
import { getStore } from '@/db';
import { canEditAccount } from '@/lib/account-access';

interface RouteContext {
  params: Promise<{ id: string }>;
}

type AccountEditorHandler = (
  request: Request,
  accountId: string
) => Promise<Response>;

type RouteHandler = (
  request: Request,
  context: RouteContext
) => Promise<Response>;

export function withAccountEditor(handle: AccountEditorHandler): RouteHandler {
  return async (request, context) => {
    const [userId, { id }] = await Promise.all([
      signedInUserId(),
      context.params,
    ]);

    if (!userId) {
      return Response.json(
        { error: 'not signed in' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    if (!(await canEditAccount(getStore(), userId, id))) {
      return Response.json(
        { error: 'not your account' },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    return handle(request, id);
  };
}
