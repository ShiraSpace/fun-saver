'use client';

import { JSX } from 'react';
import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import type { EnteredTransactionType } from '../constants';
import {
  TRANSACTION_TYPE_TOGGLE_COPY,
  TRANSACTION_TYPE_TOGGLE_TEST_IDS,
} from './constants';
import { Track, Pill, Arrow } from './TransactionTypeToggle.styles';

interface TransactionTypeToggleProps {
  transactionType: EnteredTransactionType;
  onChange: (transactionType: EnteredTransactionType) => void;
}

export function TransactionTypeToggle({
  transactionType,
  onChange,
}: TransactionTypeToggleProps): JSX.Element {
  return (
    <Track>
      <Pill
        type="button"
        data-testid={TRANSACTION_TYPE_TOGGLE_TEST_IDS.deposit}
        aria-pressed={transactionType === TRANSACTION_TYPE.deposit}
        active={transactionType === TRANSACTION_TYPE.deposit}
        onClick={(): void => onChange(TRANSACTION_TYPE.deposit)}
      >
        {TRANSACTION_TYPE_TOGGLE_COPY.deposit}
        <Arrow tone="in">{TRANSACTION_TYPE_TOGGLE_COPY.depositArrow}</Arrow>
      </Pill>
      <Pill
        type="button"
        data-testid={TRANSACTION_TYPE_TOGGLE_TEST_IDS.withdrawal}
        aria-pressed={transactionType === TRANSACTION_TYPE.withdrawal}
        active={transactionType === TRANSACTION_TYPE.withdrawal}
        onClick={(): void => onChange(TRANSACTION_TYPE.withdrawal)}
      >
        {TRANSACTION_TYPE_TOGGLE_COPY.withdrawal}
        <Arrow tone="out">{TRANSACTION_TYPE_TOGGLE_COPY.withdrawalArrow}</Arrow>
      </Pill>
    </Track>
  );
}
