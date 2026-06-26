'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { Money } from '../../Money/Money';
import { DEFAULT_WALLETS } from '@/lib/constants';
import type { DepositSplit as DepositSplitValue } from '@/lib/transactions';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';

const Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  background: ${({ theme }): string => theme.colors.softBg};
  border: 1.5px dashed ${({ theme }): string => theme.colors.softBorder};
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.softText};
`;

const Share = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

interface DepositSplitProps {
  split: DepositSplitValue;
}

export function DepositSplit({ split }: DepositSplitProps): JSX.Element {
  return (
    <Line data-testid={TRANSACTION_DRAWER_TEST_IDS.split}>
      {DEFAULT_WALLETS.map((wallet) => (
        <Share key={wallet.name}>
          <span>{wallet.icon}</span>
          <Money
            amountAgorot={split[wallet.name]}
            testId={TRANSACTION_DRAWER_TEST_IDS.splitShare(wallet.name)}
          />
        </Share>
      ))}
    </Line>
  );
}
