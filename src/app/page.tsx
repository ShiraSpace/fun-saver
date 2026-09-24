import { JSX } from 'react';
import { Home } from '@/components/Home';
import { getStore } from '@/db';
import { summarizeAccounts } from '@/lib/interest-settlement';
import { today } from '@/lib/clock';
import { ThemedPage } from '@/theme/ThemedPage';
import { SignedInUserProvider } from '@/components/Home/signed-in-user-context';
import { signedInAccounts } from './signed-in-accounts';

export const dynamic = 'force-dynamic';

export default async function HomePage(): Promise<JSX.Element> {
  const { user, accounts, currentAccountId, themeId } =
    await signedInAccounts();
  const accountSummaries = await summarizeAccounts({
    store: getStore(),
    accounts,
    asOf: today(),
  });

  return (
    <ThemedPage themeId={themeId}>
      <SignedInUserProvider value={user}>
        <Home accounts={accountSummaries} initialAccountId={currentAccountId} />
      </SignedInUserProvider>
    </ThemedPage>
  );
}
