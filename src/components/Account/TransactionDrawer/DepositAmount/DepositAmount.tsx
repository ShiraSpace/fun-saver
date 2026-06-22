'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { Money } from '../../Money/Money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import {
  TRANSACTION_DRAWER_STYLE,
  TRANSACTION_DRAWER_TEST_IDS,
} from '../constants';

const Block = styled.div`
  text-align: center;
`;

const Value = styled.div`
  font-size: ${TRANSACTION_DRAWER_STYLE.amountSize}px;
  font-weight: 700;
  color: ${TRANSACTION_DRAWER_STYLE.depositGreen};
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
