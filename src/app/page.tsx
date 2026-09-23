import { JSX } from 'react';
import { Home } from '@/components/Home';
import { getStore } from '@/db';
import { withDerivedWallets } from '@/lib/account-dashboard';
import { today } from '@/lib/clock';
import { ThemedPage } from '@/theme/ThemedPage';
import { signedInAccounts } from './signed-in-accounts';

export const dynamic = 'force-dynamic';

export default async function HomePage(): Promise<JSX.Element> {
  const { accounts, selectedAccountId, themeId } = await signedInAccounts();
  const derived = await withDerivedWallets({
    store: getStore(),
    accounts,
    asOf: today(),
  });

  return (
    <ThemedPage themeId={themeId}>
      <Home accounts={derived} initialAccountId={selectedAccountId} />
    </ThemedPage>
  );
}
