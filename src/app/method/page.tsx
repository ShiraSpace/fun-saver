import { JSX } from 'react';
import { Method } from '@/components/Method';
import { Home } from '@/components/Home';
import { getStore } from '@/db';
import { withDerivedWallets } from '@/lib/account-dashboard';
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
  const screen = initialAccount ? (
    <Method accounts={derived} initialAccount={initialAccount} />
  ) : (
    <Home accounts={derived} initialAccountId={selectedAccountId} />
  );

  return (
    <ThemedPage themeId={themeId}>
      <SignedInUserProvider value={user}>{screen}</SignedInUserProvider>
    </ThemedPage>
  );
}
