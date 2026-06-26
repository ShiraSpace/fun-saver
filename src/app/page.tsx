import { JSX } from 'react';
import { cookies } from 'next/headers';
import { Home } from '@/components/Home';
import type { AccountView } from '@/components/AccountSwitcher';
import { SELECTED_ACCOUNT_COOKIE } from '@/components/Home/selected-account-cookie';
import { getStore } from '@/db';
import { getWalletsForAccount } from '@/lib/account-dashboard';
import { today } from '@/lib/clock';

export const dynamic = 'force-dynamic';

export default async function HomePage(): Promise<JSX.Element> {
  const store = getStore();
  const [accounts, cookieStore] = await Promise.all([
    store.listAccounts(),
    cookies(),
  ]);

  const asOf = today();
  const views: AccountView[] = await Promise.all(
    accounts.map(async (account) => ({
      account,
      wallets: await getWalletsForAccount(store, account, asOf),
    }))
  );

  const storedAccountId = cookieStore.get(SELECTED_ACCOUNT_COOKIE)?.value;
  const initialAccountId =
    storedAccountId &&
    accounts.some((account) => account.id === storedAccountId)
      ? storedAccountId
      : (accounts[0]?.id ?? '');

  return (
    <main>
      <Home views={views} initialAccountId={initialAccountId} />
    </main>
  );
}
