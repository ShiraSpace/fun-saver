'use client';

import { JSX, ReactNode } from 'react';
import type { WalletName, WalletSummary } from '@/lib/wallet/types';
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
  WalletSummary,
  'name' | 'icon' | 'balance' | 'monthlyInterestRate' | 'openedAt' | 'withdrawn'
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

function walletSummaryText(wallet: CardWallet): string | undefined {
  if (wallet.name === 'savings') {
    return WALLET_CARD_COPY.savingsSummary(wallet);
  }

  if (wallet.withdrawn === 0) {
    return;
  }

  return WITHDRAWALS_SUMMARY[wallet.name](wallet);
}

export function WalletCard({ wallet, children }: WalletCardProps): JSX.Element {
  const summaryText = walletSummaryText(wallet);

  return (
    <Card data-testid={WALLET_CARD_TEST_IDS.card}>
      <Head>
        <WalletIcon walletName={wallet.name}>{wallet.icon}</WalletIcon>
        <Name>
          {WALLET_CARD_COPY.name[wallet.name]}
          {summaryText && (
            <Summary data-testid={WALLET_CARD_TEST_IDS.summary}>
              {summaryText}
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
