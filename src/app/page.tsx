import { JSX } from 'react';
import type { Account as AccountModel } from '@/lib/types';
import { Account } from '@/components/Account';
import { CreateAccount } from '@/components/CreateAccount';
import { EmptyState } from '@/components/EmptyState';
import {
  CREATE_ACCOUNT_HREF,
  CREATE_ACCOUNT_PARAM,
} from '@/components/CreateAccount/constants';
import { getStore } from '@/db';

export const dynamic = 'force-dynamic';

interface HomeProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function route(
  account: AccountModel | undefined,
  isCreating: boolean
): JSX.Element {
  if (account) {
    return <Account name={account.name} avatarId={account.avatarId} />;
  }
  if (isCreating) {
    return <CreateAccount />;
  }
  return <EmptyState createAccountHref={CREATE_ACCOUNT_HREF} />;
}

export default async function Home({
  searchParams,
}: HomeProps): Promise<JSX.Element> {
  const [[account], params] = await Promise.all([
    getStore().listAccounts(),
    searchParams,
  ]);

  return <main>{route(account, Boolean(params[CREATE_ACCOUNT_PARAM]))}</main>;
}
