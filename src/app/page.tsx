import { JSX } from 'react';
import { cookies } from 'next/headers';
import { Home } from '@/components/Home';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { SELECTED_ACCOUNT_COOKIE } from '@/components/Home/selected-account-cookie';
import { getStore } from '@/db';
import { getWalletsForAccount } from '@/lib/account-dashboard';
import { today } from '@/lib/clock';
import { resolveThemeId } from '@/theme/registry';
import { ThemeController } from '@/theme/ThemeController';

export const dynamic = 'force-dynamic';

export default async function HomePage(): Promise<JSX.Element> {
  const store = getStore();
  const [storedAccounts, cookieStore] = await Promise.all([
    store.listAccounts(),
    cookies(),
  ]);

  const asOf = today();
  const accounts: AccountWithDerivedWallets[] = await Promise.all(
    storedAccounts.map(async (account) => ({
      ...account,
      wallets: await getWalletsForAccount(store, account, asOf),
    }))
  );

  const storedAccountId = cookieStore.get(SELECTED_ACCOUNT_COOKIE)?.value;
  const defaultAccountId = accounts[0]?.id ?? '';

  const initialAccountId =
    storedAccountId && accounts.some(({ id }) => id === storedAccountId)
      ? storedAccountId
      : defaultAccountId;

  const selectedAccount = accounts.find(({ id }) => id === initialAccountId);
  const initialThemeId = resolveThemeId(selectedAccount?.themeId);

  return (
    <main>
      <ThemeController initialThemeId={initialThemeId}>
        <Home accounts={accounts} initialAccountId={initialAccountId} />
      </ThemeController>
    </main>
  );
}
