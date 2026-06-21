'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { WalletWithDerived } from '@/lib/types';
import { COLORS } from '@/theme/palette';
import { Money } from '../Money/Money';
import {
  WALLET_CARD_COPY,
  WALLET_CARD_STYLE,
  WALLET_CARD_TEST_IDS,
} from './constants';

type CardWallet = Pick<WalletWithDerived, 'name' | 'icon' | 'balance'>;

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: ${WALLET_CARD_STYLE.gap}px;
  padding: ${WALLET_CARD_STYLE.paddingY}px ${WALLET_CARD_STYLE.paddingX}px;
  background: ${COLORS.surface};
  border-radius: ${WALLET_CARD_STYLE.radius}px;
  box-shadow: ${WALLET_CARD_STYLE.shadow};
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
  background: ${({ name }) => WALLET_CARD_STYLE.illustGradient[name]};
`;

const Name = styled.span`
  flex: 1;
  text-align: start;
  font-size: ${WALLET_CARD_STYLE.nameSize}px;
  font-weight: 600;
  color: ${COLORS.ink};
`;

const Pill = styled.span`
  padding: ${WALLET_CARD_STYLE.pillPaddingY}px
    ${WALLET_CARD_STYLE.pillPaddingX}px;
  border-radius: 999px;
  background: ${WALLET_CARD_STYLE.pillBg};
  border: ${WALLET_CARD_STYLE.pillBorder};
  font-size: ${WALLET_CARD_STYLE.pillFontSize}px;
  color: ${COLORS.ink};
`;

interface WalletCardProps {
  wallet: CardWallet;
}

export function WalletCard({ wallet }: WalletCardProps): JSX.Element {
  return (
    <Card data-testid={WALLET_CARD_TEST_IDS.card}>
      <Illust name={wallet.name}>{wallet.icon}</Illust>
      <Name>{WALLET_CARD_COPY.name[wallet.name]}</Name>
      <Pill>
        <Money
          amountAgorot={wallet.balance}
          testId={WALLET_CARD_TEST_IDS.balance}
        />
      </Pill>
    </Card>
  );
}
