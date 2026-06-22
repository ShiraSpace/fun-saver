import { JSX } from 'react';
import {
  AccountSwitcher,
  type AccountView,
} from '@/components/AccountSwitcher';
import { CreateAccount } from '@/components/CreateAccount';
import { EmptyState } from '@/components/EmptyState';
import {
  CREATE_ACCOUNT_HREF,
  CREATE_ACCOUNT_PARAM,
} from '@/components/CreateAccount/constants';
import { getStore } from '@/db';
import { getWalletsForAccount } from '@/lib/account-dashboard';
import { today } from '@/lib/clock';

export const dynamic = 'force-dynamic';

interface HomeProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

interface RouteParams {
  views: AccountView[];
  isCreating: boolean;
}

function route({ views, isCreating }: RouteParams): JSX.Element {
  if (views.length > 0) {
    return <AccountSwitcher views={views} />;
  }

  if (isCreating) {
    return <CreateAccount />;
  }

  return <EmptyState createAccountHref={CREATE_ACCOUNT_HREF} />;
}

export default async function Home({
  searchParams,
}: HomeProps): Promise<JSX.Element> {
  const store = getStore();
  const [accounts, params] = await Promise.all([
    store.listAccounts(),
    searchParams,
  ]);

  const views = await Promise.all(
    accounts.map(async (account) => ({
      account,
      wallets: await getWalletsForAccount(store, account.id, today()),
    }))
  );

  const mainComponent = route({
    views,
    isCreating: Boolean(params[CREATE_ACCOUNT_PARAM]),
  });

  return <main>{mainComponent}</main>;
}
