import { signedInUser } from '@/auth';
import { getStore } from '@/db';
import {
  canEditAccount,
  isAccountUser,
  type AccountAccessParams,
} from '@/lib/account/account-access';
import { notSignedIn, notYourAccount } from '@/app/api/responses';

interface RouteContext {
  params: Promise<{ id: string }>;
}

type AccountHandler = (
  request: Request,
  accountId: string
) => Promise<Response>;

type RouteHandler = (
  request: Request,
  context: RouteContext
) => Promise<Response>;

type AccountAccessRule = (params: AccountAccessParams) => Promise<boolean>;

function withAccountAccess(
  hasAccess: AccountAccessRule,
  handle: AccountHandler
): RouteHandler {
  return async (request, context) => {
    const [user, { id }] = await Promise.all([signedInUser(), context.params]);

    if (!user) {
      return notSignedIn();
    }

    const allowed = await hasAccess({
      store: getStore(),
      userId: user.id,
      accountId: id,
    });

    if (!allowed) {
      return notYourAccount();
    }

    return handle(request, id);
  };
}

export function withAccountEditor(handle: AccountHandler): RouteHandler {
  return withAccountAccess(canEditAccount, handle);
}

export function withAccountUser(handle: AccountHandler): RouteHandler {
  return withAccountAccess(isAccountUser, handle);
}
