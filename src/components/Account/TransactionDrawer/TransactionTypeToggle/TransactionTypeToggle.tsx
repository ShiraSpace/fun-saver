'use client';

import { JSX } from 'react';
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
        aria-pressed={transactionType === 'deposit'}
        active={transactionType === 'deposit'}
        onClick={(): void => onChange('deposit')}
      >
        {TRANSACTION_TYPE_TOGGLE_COPY.deposit}
        <Arrow tone="in">{TRANSACTION_TYPE_TOGGLE_COPY.depositArrow}</Arrow>
      </Pill>
      <Pill
        type="button"
        data-testid={TRANSACTION_TYPE_TOGGLE_TEST_IDS.withdrawal}
        aria-pressed={transactionType === 'withdrawal'}
        active={transactionType === 'withdrawal'}
        onClick={(): void => onChange('withdrawal')}
      >
        {TRANSACTION_TYPE_TOGGLE_COPY.withdrawal}
        <Arrow tone="out">{TRANSACTION_TYPE_TOGGLE_COPY.withdrawalArrow}</Arrow>
      </Pill>
    </Track>
  );
}
