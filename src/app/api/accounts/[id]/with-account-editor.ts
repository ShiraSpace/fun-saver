import { signedInUserId } from '@/auth';
import { getStore } from '@/db';
import { canEditAccount } from '@/lib/account-access';
import { notSignedIn, notYourAccount } from '@/app/api/responses';

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
      return notSignedIn();
    }

    const canEdit = await canEditAccount({
      store: getStore(),
      userId,
      accountId: id,
    });

    if (!canEdit) {
      return notYourAccount();
    }

    return handle(request, id);
  };
}
