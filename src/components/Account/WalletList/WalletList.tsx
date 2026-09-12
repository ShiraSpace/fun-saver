'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { WalletWithDerived } from '@/lib/types';
import { WalletCard } from '../WalletCard/WalletCard';
import { StatStrip } from '../WalletCard/StatStrip';
import { WALLET_CARD_COPY } from '../WalletCard/constants';
import {
  WALLET_LIST_COPY,
  WALLET_LIST_STYLE,
  WALLET_LIST_TEST_IDS,
} from './constants';

interface WalletListProps {
  wallets: WalletWithDerived[];
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${WALLET_LIST_STYLE.gap}px;
`;

const Label = styled.span`
  text-align: start;
  padding-inline: ${WALLET_LIST_STYLE.labelPaddingX}px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textOnPrimary};
  opacity: ${WALLET_LIST_STYLE.labelOpacity};
`;

export function WalletList({ wallets }: WalletListProps): JSX.Element {
  return (
    <List>
      <Label data-testid={WALLET_LIST_TEST_IDS.label}>
        {WALLET_LIST_COPY.label}
      </Label>
      {wallets.map((wallet) => {
        const isSavings = wallet.name === 'savings';

        return (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            subLine={
              isSavings
                ? WALLET_CARD_COPY.savingsSubLine(
                    wallet.monthlyInterestRate,
                    wallet.openedAt
                  )
                : undefined
            }
          >
            {isSavings && (
              <StatStrip
                principal={wallet.principal}
                interestGain={wallet.interestGain}
                todayInterest={wallet.todayInterest}
              />
            )}
          </WalletCard>
        );
      })}
    </List>
  );
}
