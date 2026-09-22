'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { AccountManagement } from '@/components/AccountManagement';
import { AccountsProvider } from '@/components/Home/accounts-context';
import { useAccountNavigation } from '@/hooks/use-account-navigation';
import { MethodIntro } from './MethodIntro';
import { WalletsSection } from './WalletsSection';
import { WhySection } from './WhySection';
import { METHOD_COPY } from './copy';
import { Column } from './Method.styles';

interface MethodProps {
  accounts: AccountWithDerivedWallets[];
  initialAccount: AccountWithDerivedWallets;
}

export function Method({ accounts, initialAccount }: MethodProps): JSX.Element {
  const navigation = useAccountNavigation(accounts, initialAccount.id);
  const { currentAccount, selectAccount } = navigation;

  return (
    <AccountManagement navigation={navigation}>
      <AccountsProvider
        value={{
          accounts,
          currentAccount: currentAccount ?? initialAccount,
          selectAccount,
        }}
      >
        <Screen align="top">
          <Column>
            <Header title={METHOD_COPY.title} />
            <MethodIntro />
            <WhySection />
            <WalletsSection />
          </Column>
        </Screen>
      </AccountsProvider>
    </AccountManagement>
  );
}
