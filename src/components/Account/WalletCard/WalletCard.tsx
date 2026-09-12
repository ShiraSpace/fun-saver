'use client';

import { JSX, ReactNode } from 'react';
import styled from '@emotion/styled';
import type { WalletWithDerived } from '@/lib/types';
import { Money } from '@/components/Money';
import {
  WALLET_CARD_COPY,
  WALLET_CARD_STYLE,
  WALLET_CARD_TEST_IDS,
  WALLET_GRADIENT,
} from './constants';

type CardWallet = Pick<
  WalletWithDerived,
  'name' | 'icon' | 'balance' | 'monthlyInterestRate' | 'openedAt'
>;

function subLineOf(wallet: CardWallet): string | undefined {
  if (wallet.name !== 'savings') {
    return;
  }

  return WALLET_CARD_COPY.savingsSubLine(
    wallet.monthlyInterestRate,
    wallet.openedAt
  );
}

const Card = styled.div`
  padding: ${WALLET_CARD_STYLE.paddingY}px ${WALLET_CARD_STYLE.paddingX}px;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${WALLET_CARD_STYLE.radius}px;
  box-shadow: ${WALLET_CARD_STYLE.shadow};
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${WALLET_CARD_STYLE.gap}px;
`;

const Illust = styled.span<{ name: CardWallet['name'] }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${WALLET_CARD_STYLE.illustSize}px;
  height: ${WALLET_CARD_STYLE.illustSize}px;
  border-radius: ${WALLET_CARD_STYLE.illustRadius}px;
  font-size: ${WALLET_CARD_STYLE.illustFontSize}px;
  background: ${({ name, theme }): string =>
    theme.gradients[WALLET_GRADIENT[name]]};
`;

const Name = styled.span`
  flex: 1;
  text-align: start;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

const SubLine = styled.small`
  display: block;
  font-size: ${WALLET_CARD_STYLE.subLineSize}px;
  font-weight: 500;
  color: ${({ theme }): string => theme.colors.textMuted};
  margin-top: ${WALLET_CARD_STYLE.subLineGap}px;
`;

const Pill = styled.span`
  padding: ${WALLET_CARD_STYLE.pillPaddingY}px
    ${WALLET_CARD_STYLE.pillPaddingX}px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.depositBg};
  border: 1.5px solid ${({ theme }): string => theme.colors.softBorder};
  font-size: ${({ theme }): number => theme.typography.body}px;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

interface WalletCardProps {
  wallet: CardWallet;
  children?: ReactNode;
}

export function WalletCard({ wallet, children }: WalletCardProps): JSX.Element {
  const subLine = subLineOf(wallet);

  return (
    <Card data-testid={WALLET_CARD_TEST_IDS.card}>
      <Head>
        <Illust name={wallet.name}>{wallet.icon}</Illust>
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
