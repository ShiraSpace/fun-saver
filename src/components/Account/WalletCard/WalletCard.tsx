'use client';

import { JSX, ReactNode } from 'react';
import type { SpendableWalletName, WalletSummary } from '@/lib/wallet/types';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { Money } from '@/components/Money';
import { MONEY_ROUNDING } from '@/components/Money/constants';
import { WALLET_CARD_COPY, WALLET_CARD_TEST_IDS } from './constants';
import {
  Card,
  Head,
  WalletIcon,
  Name,
  Balance,
  Summary,
  Lock,
} from './WalletCard.styles';

type CardWallet = Pick<
  WalletSummary,
  'name' | 'icon' | 'balance' | 'monthlyInterestRate' | 'openedAt' | 'withdrawn'
>;

const WITHDRAWALS_SUMMARY: Record<
  SpendableWalletName,
  (wallet: CardWallet) => string
> = {
  spending: WALLET_CARD_COPY.spendingSummary,
  goodDeeds: WALLET_CARD_COPY.goodDeedsSummary,
};

interface WalletCardProps {
  wallet: CardWallet;
  savedTowardGoal?: SavedTowardGoal;
  children?: ReactNode;
}

function walletSummaryText(wallet: CardWallet): string | undefined {
  if (wallet.name === WALLET_NAMES.savings) {
    return WALLET_CARD_COPY.savingsSummary(wallet);
  }

  if (wallet.withdrawn === 0) {
    return;
  }

  return WITHDRAWALS_SUMMARY[wallet.name](wallet);
}

export function WalletCard({
  wallet,
  savedTowardGoal,
  children,
}: WalletCardProps): JSX.Element {
  const summaryText = walletSummaryText(wallet);
  const isLocked = savedTowardGoal && !savedTowardGoal.reached;

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
          {isLocked && (
            <Lock aria-hidden="true" data-testid={WALLET_CARD_TEST_IDS.lock}>
              {WALLET_CARD_COPY.lock}
            </Lock>
          )}
          <Money
            amountAgorot={wallet.balance}
            testId={WALLET_CARD_TEST_IDS.balance}
            rounding={
              savedTowardGoal ? MONEY_ROUNDING.floorToShekels : undefined
            }
          />
        </Balance>
      </Head>
      {children}
    </Card>
  );
}
