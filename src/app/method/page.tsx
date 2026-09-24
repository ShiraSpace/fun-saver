import { JSX } from 'react';
import { redirect } from 'next/navigation';
import { Method } from '@/components/Method';
import { HOME_ROUTE } from '@/components/Home/constants';
import { getStore } from '@/db';
import { withDerivedWallets } from '@/lib/interest-settlement';
import { today } from '@/lib/clock';
import { selectedAccount } from '@/lib/selected-account';
import { ThemedPage } from '@/theme/ThemedPage';
import { SignedInUserProvider } from '@/components/Home/signed-in-user-context';
import { signedInAccounts } from '../signed-in-accounts';

export const dynamic = 'force-dynamic';

export default async function MethodPage(): Promise<JSX.Element> {
  const { user, accounts, selectedAccountId, themeId } =
    await signedInAccounts();
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
    <ThemedPage themeId={themeId}>
      <SignedInUserProvider value={user}>
        <Method accounts={derived} initialAccount={initialAccount} />
      </SignedInUserProvider>
    </ThemedPage>
  );
}
