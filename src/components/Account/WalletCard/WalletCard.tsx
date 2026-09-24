'use client';

import { JSX, ReactNode } from 'react';
import type { WalletName, WalletWithDerived } from '@/lib/types';
import { Money } from '@/components/Money';
import { WALLET_CARD_COPY, WALLET_CARD_TEST_IDS } from './constants';
import {
  Card,
  Head,
  WalletIcon,
  Name,
  Balance,
  Summary,
} from './WalletCard.styles';

type CardWallet = Pick<
  WalletWithDerived,
  | 'name'
  | 'icon'
  | 'balance'
  | 'monthlyInterestRate'
  | 'openedAt'
  | 'withdrawals'
>;

const WITHDRAWALS_SUMMARY: Record<
  Exclude<WalletName, 'savings'>,
  (wallet: CardWallet) => string
> = {
  spending: WALLET_CARD_COPY.spendingSummary,
  goodDeeds: WALLET_CARD_COPY.goodDeedsSummary,
};

interface WalletCardProps {
  wallet: CardWallet;
  children?: ReactNode;
}

function walletSummary(wallet: CardWallet): string | undefined {
  if (wallet.name === 'savings') {
    return WALLET_CARD_COPY.savingsSummary(wallet);
  }

  if (wallet.withdrawals === 0) {
    return;
  }

  return WITHDRAWALS_SUMMARY[wallet.name](wallet);
}

export function WalletCard({ wallet, children }: WalletCardProps): JSX.Element {
  const summary = walletSummary(wallet);

  return (
    <Card data-testid={WALLET_CARD_TEST_IDS.card}>
      <Head>
        <WalletIcon walletName={wallet.name}>{wallet.icon}</WalletIcon>
        <Name>
          {WALLET_CARD_COPY.name[wallet.name]}
          {summary && (
            <Summary data-testid={WALLET_CARD_TEST_IDS.summary}>
              {summary}
            </Summary>
          )}
        </Name>
        <Balance>
          <Money
            amountAgorot={wallet.balance}
            testId={WALLET_CARD_TEST_IDS.balance}
          />
        </Balance>
      </Head>
      {children}
    </Card>
  );
}
