import { JSX } from 'react';
import { Home } from '@/components/Home';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { getStore } from '@/db';
import { getWalletsForAccount } from '@/lib/account-dashboard';
import { today } from '@/lib/clock';
import { ThemeController } from '@/theme/ThemeController';
import { signedInAccounts } from './signed-in-accounts';

export const dynamic = 'force-dynamic';

export default async function HomePage(): Promise<JSX.Element> {
  const {
    accounts: storedAccounts,
    selectedAccountId,
    themeId,
  } = await signedInAccounts();

  const asOf = today();
  const store = getStore();
  const accounts: AccountWithDerivedWallets[] = await Promise.all(
    storedAccounts.map(async (account) => ({
      ...account,
      wallets: await getWalletsForAccount(store, account, asOf),
    }))
  );

  return (
    <main>
      <ThemeController initialThemeId={themeId}>
        <Home accounts={accounts} initialAccountId={selectedAccountId} />
      </ThemeController>
    </main>
  );
}
