'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { walletNamed } from '@/lib/wallet/wallet-named';
import { WALLET_NAME } from '@/lib/wallet/constants';
import { Column, Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { ChildSavings } from './ChildSavings';
import { ChildWallet } from './ChildWallet';
import { CHILD_ACCOUNT_TEST_IDS } from './constants';
import { Wallets } from './ChildAccount.styles';

interface ChildAccountProps {
  account: AccountSummary;
}

export function ChildAccount({ account }: ChildAccountProps): JSX.Element {
  const savings = walletNamed(account.wallets, WALLET_NAME.savings);
  const spending = walletNamed(account.wallets, WALLET_NAME.spending);
  const goodDeeds = walletNamed(account.wallets, WALLET_NAME.goodDeeds);
  const savingsCard = savings && <ChildSavings savings={savings} />;
  const spendingCard = spending && <ChildWallet wallet={spending} />;
  const goodDeedsCard = goodDeeds && <ChildWallet wallet={goodDeeds} />;

  return (
    <Screen align="top">
      <Column data-testid={CHILD_ACCOUNT_TEST_IDS.screen}>
        <Header title={account.name} account={account} />
        <Wallets data-testid={CHILD_ACCOUNT_TEST_IDS.wallets}>
          {savingsCard}
          {spendingCard}
          {goodDeedsCard}
        </Wallets>
      </Column>
    </Screen>
  );
}
