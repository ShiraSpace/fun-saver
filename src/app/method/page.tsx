import { JSX } from 'react';
import { redirect } from 'next/navigation';
import { Method } from '@/components/Method';
import { HOME_ROUTE } from '@/components/Home/constants';
import { getStore } from '@/db';
import { withDerivedWallets } from '@/lib/account-dashboard';
import { today } from '@/lib/clock';
import { selectedAccount } from '@/lib/selected-account';
import { ThemeController } from '@/theme/ThemeController';
import { signedInAccounts } from '../signed-in-accounts';

export const dynamic = 'force-dynamic';

export default async function MethodPage(): Promise<JSX.Element> {
  const { accounts, selectedAccountId, themeId } = await signedInAccounts();
  const derived = await withDerivedWallets({
    store: getStore(),
    accounts,
    asOf: today(),
  });
  const initialAccount = selectedAccount(derived, selectedAccountId);

  if (!initialAccount) {
    redirect(HOME_ROUTE);
  }

  return (
    <main>
      <ThemeController initialThemeId={themeId}>
        <Method accounts={derived} initialAccount={initialAccount} />
      </ThemeController>
    </main>
  );
}
