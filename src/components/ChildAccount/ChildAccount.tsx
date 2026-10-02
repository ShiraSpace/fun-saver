'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import type { WalletName, WalletSummary } from '@/lib/wallet/types';
import { Column, Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { ChildSavings } from './ChildSavings';
import { ChildWallet } from './ChildWallet';
import { CHILD_ACCOUNT_TEST_IDS } from './constants';
import { Wallets } from './ChildAccount.styles';

interface ChildAccountProps {
  account: AccountSummary;
}

type NamedWallet<Name extends WalletName> = WalletSummary & { name: Name };

function walletNamed<Name extends WalletName>(
  wallets: WalletSummary[],
  name: Name
): NamedWallet<Name> | undefined {
  return wallets.find(
    (wallet): wallet is NamedWallet<Name> => wallet.name === name
  );
}

export function ChildAccount({ account }: ChildAccountProps): JSX.Element {
  const savings = walletNamed(account.wallets, 'savings');
  const spending = walletNamed(account.wallets, 'spending');
  const goodDeeds = walletNamed(account.wallets, 'goodDeeds');

  return (
    <Screen align="top">
      <Column data-testid={CHILD_ACCOUNT_TEST_IDS.screen}>
        <Header title={account.name} account={account} />
        <Wallets>
          {savings && <ChildSavings savings={savings} />}
          {spending && <ChildWallet wallet={spending} />}
          {goodDeeds && <ChildWallet wallet={goodDeeds} />}
        </Wallets>
      </Column>
    </Screen>
  );
}
