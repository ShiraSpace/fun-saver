import { signedInUser } from '@/auth';
import { getStore } from '@/db';
import {
  canEditAccount,
  isAccountUser,
  type AccountAccessParams,
} from '@/lib/account/account-access';
import { notSignedIn, notYourAccount } from '@/app/api/responses';

export interface AccountRouteParams {
  id: string;
}

interface RouteContext<Params extends AccountRouteParams> {
  params: Promise<Params>;
}

type AccountHandler<Params extends AccountRouteParams> = (
  request: Request,
  accountId: string,
  params: Params
) => Promise<Response>;

type RouteHandler<Params extends AccountRouteParams> = (
  request: Request,
  context: RouteContext<Params>
) => Promise<Response>;

type AccountAccessRule = (params: AccountAccessParams) => Promise<boolean>;

function withAccountAccess<Params extends AccountRouteParams>(
  hasAccess: AccountAccessRule,
  handle: AccountHandler<Params>
): RouteHandler<Params> {
  return async (request, context) => {
    const [user, params] = await Promise.all([signedInUser(), context.params]);

    if (!user) {
      return notSignedIn();
    }

    const allowed = await hasAccess({
      store: getStore(),
      userId: user.id,
      accountId: params.id,
    });

    if (!allowed) {
      return notYourAccount();
    }

    return handle(request, params.id, params);
  };
}

export function withAccountEditor<
  Params extends AccountRouteParams = AccountRouteParams,
>(handle: AccountHandler<Params>): RouteHandler<Params> {
  return withAccountAccess(canEditAccount, handle);
}

export function withAccountUser<
  Params extends AccountRouteParams = AccountRouteParams,
>(handle: AccountHandler<Params>): RouteHandler<Params> {
  return withAccountAccess(isAccountUser, handle);
}
