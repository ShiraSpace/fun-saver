'use client';

import { JSX } from 'react';
import { Money } from '@/components/Money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { Block, Value } from './DepositAmount.styles';

interface DepositAmountProps {
  amountShekels: number;
}

export function DepositAmount({
  amountShekels,
}: DepositAmountProps): JSX.Element {
  return (
    <Block>
      <Value>
        <Money
          amountAgorot={amountShekels * AGOROT_PER_SHEKEL}
          testId={TRANSACTION_DRAWER_TEST_IDS.amount}
        />
      </Value>
    </Block>
  );
}
