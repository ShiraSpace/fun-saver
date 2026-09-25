import { JSX } from 'react';
import { redirect } from 'next/navigation';
import { Method } from '@/components/Method';
import { HOME_ROUTE } from '@/components/Home/constants';
import { getStore } from '@/db';
import { summarizeAccounts } from '@/lib/interest/interest-settlement';
import { today } from '@/lib/clock';
import { findCurrentAccount } from '@/lib/current-account';
import { ThemedPage } from '@/theme/ThemedPage';
import { SignedInUserProvider } from '@/components/Home/signed-in-user-context';
import { signedInAccounts } from '../signed-in-accounts';

export const dynamic = 'force-dynamic';

export default async function MethodPage(): Promise<JSX.Element> {
  const { user, accounts, currentAccountId, themeId } =
    await signedInAccounts();
  const accountSummaries = await summarizeAccounts({
    store: getStore(),
    accounts,
    asOf: today(),
  });
  const initialAccount = findCurrentAccount(accountSummaries, currentAccountId);

  if (!initialAccount) {
    redirect(HOME_ROUTE);
  }

  return (
    <ThemedPage themeId={themeId}>
      <SignedInUserProvider value={user}>
        <Method accounts={accountSummaries} initialAccount={initialAccount} />
      </SignedInUserProvider>
    </ThemedPage>
  );
}
