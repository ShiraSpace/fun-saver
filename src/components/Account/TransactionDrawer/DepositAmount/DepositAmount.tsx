'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { Money } from '../../Money/Money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';

const Block = styled.div`
  text-align: center;
`;

const Value = styled.div`
  font-size: ${({ theme }): number => theme.typography.display}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.gainText};
`;

interface DepositAmountProps {
  amount: number;
}

export function DepositAmount({ amount }: DepositAmountProps): JSX.Element {
  return (
    <Block>
      <Value>
        <Money
          amountAgorot={amount * AGOROT_PER_SHEKEL}
          testId={TRANSACTION_DRAWER_TEST_IDS.amount}
        />
      </Value>
    </Block>
  );
}
