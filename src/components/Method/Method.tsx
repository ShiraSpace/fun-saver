'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { Header } from '@/components/Header';
import { Column, Screen } from '@/components/Screen';
import { AccountManagement } from '@/components/AccountManagement';
import { AccountsProvider } from '@/components/Home/accounts-context';
import { useAccountNavigation } from '@/hooks/use-account-navigation';
import { SetupSection } from './SetupSection';
import { LimitsSection } from './LimitsSection';
import { MethodIntro } from './MethodIntro';
import { PromiseSection } from './PromiseSection';
import { ScriptsSection } from './ScriptsSection';
import { SourcesSection } from './SourcesSection';
import { WalletsSection } from './WalletsSection';
import { WhySection } from './WhySection';
import { METHOD_COPY } from './copy';

interface MethodProps {
  accounts: AccountSummary[];
  initialAccount: AccountSummary;
}

export function Method({ accounts, initialAccount }: MethodProps): JSX.Element {
  const navigation = useAccountNavigation(accounts, initialAccount.id);
  const { currentAccount, switchAccount } = navigation;

  return (
    <AccountManagement navigation={navigation}>
      <AccountsProvider
        value={{
          accounts,
          currentAccount: currentAccount ?? initialAccount,
          switchAccount,
        }}
      >
        <Screen align="top">
          <Column>
            <Header
              title={METHOD_COPY.title}
              account={currentAccount ?? initialAccount}
            />
            <MethodIntro />
            <WhySection />
            <WalletsSection />
            <PromiseSection />
            <SetupSection />
            <ScriptsSection />
            <LimitsSection />
            <SourcesSection />
          </Column>
        </Screen>
      </AccountsProvider>
    </AccountManagement>
  );
}
