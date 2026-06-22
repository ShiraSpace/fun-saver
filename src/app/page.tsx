import { JSX } from 'react';
import type { Account as AccountModel, WalletWithDerived } from '@/lib/types';
import { Account } from '@/components/Account';
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
  account: AccountModel | undefined;
  wallets: WalletWithDerived[];
  isCreating: boolean;
}

function route({ account, wallets, isCreating }: RouteParams): JSX.Element {
  if (account) {
    return (
      <Account
        accountId={account.id}
        name={account.name}
        avatarId={account.avatarId}
        wallets={wallets}
      />
    );
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
  const [[account], params] = await Promise.all([
    store.listAccounts(),
    searchParams,
  ]);

  const wallets = account
    ? await getWalletsForAccount(store, account.id, today())
    : [];

  const mainComponent = route({
    account,
    wallets,
    isCreating: Boolean(params[CREATE_ACCOUNT_PARAM]),
  });

  return <main>{mainComponent}</main>;
}
