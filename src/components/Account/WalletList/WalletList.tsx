'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { WalletWithDerived } from '@/lib/types';
import { COLORS } from '@/theme/palette';
import { WalletCard } from '../WalletCard/WalletCard';
import {
  WALLET_LIST_COPY,
  WALLET_LIST_STYLE,
  WALLET_LIST_TEST_IDS,
} from './constants';

interface WalletListProps {
  wallets: ListWallet[];
}

type ListWallet = Pick<WalletWithDerived, 'id' | 'name' | 'icon' | 'balance'>;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${WALLET_LIST_STYLE.gap}px;
`;

const Label = styled.span`
  text-align: start;
  padding-inline: ${WALLET_LIST_STYLE.labelPaddingX}px;
  font-size: ${WALLET_LIST_STYLE.labelSize}px;
  font-weight: 700;
  color: ${COLORS.textOnPrimary};
  opacity: ${WALLET_LIST_STYLE.labelOpacity};
`;

export function WalletList({ wallets }: WalletListProps): JSX.Element {
  return (
    <List>
      <Label data-testid={WALLET_LIST_TEST_IDS.label}>
        {WALLET_LIST_COPY.label}
      </Label>
      {wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </List>
  );
}
