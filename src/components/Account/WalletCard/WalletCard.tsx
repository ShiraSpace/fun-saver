'use client';

import { JSX, ReactNode } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { Money } from '@/components/Money';
import { WALLET_CARD_COPY, WALLET_CARD_TEST_IDS } from './constants';
import { Card, Head, Illust, Name, Pill, SubLine } from './WalletCard.styles';

type CardWallet = Pick<
  WalletWithDerived,
  'name' | 'icon' | 'balance' | 'monthlyInterestRate' | 'openedAt'
>;

interface WalletCardProps {
  wallet: CardWallet;
  children?: ReactNode;
}

function subLineOf(wallet: CardWallet): string | undefined {
  if (wallet.name !== 'savings') {
    return;
  }

  return WALLET_CARD_COPY.savingsSubLine(wallet);
}

export function WalletCard({ wallet, children }: WalletCardProps): JSX.Element {
  const subLine = subLineOf(wallet);

  return (
    <Card data-testid={WALLET_CARD_TEST_IDS.card}>
      <Head>
        <Illust walletName={wallet.name}>{wallet.icon}</Illust>
        <Name>
          {WALLET_CARD_COPY.name[wallet.name]}
          {subLine && (
            <SubLine data-testid={WALLET_CARD_TEST_IDS.subLine}>
              {subLine}
            </SubLine>
          )}
        </Name>
        <Pill>
          <Money
            amountAgorot={wallet.balance}
            testId={WALLET_CARD_TEST_IDS.balance}
          />
        </Pill>
      </Head>
      {children}
    </Card>
  );
}
