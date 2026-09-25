import { useState } from 'react';
import {
  ALL_TRANSACTION_TYPES,
  INTEREST_MODE,
} from '@/lib/transaction/constants';
import type {
  InterestMode,
  TransactionTypeFilter,
} from '@/lib/transaction/transaction-rows';
import { DEFAULT_RANGE, type RangeId } from './BalanceOverTime/constants';

export interface TransactionsViewChoices {
  range: RangeId;
  setRange: (range: RangeId) => void;
  transactionTypeFilter: TransactionTypeFilter;
  setTransactionTypeFilter: (
    transactionTypeFilter: TransactionTypeFilter
  ) => void;
  interestMode: InterestMode;
  setInterestMode: (interestMode: InterestMode) => void;
}

export function useTransactionsViewChoices(): TransactionsViewChoices {
  const [range, setRange] = useState<RangeId>(DEFAULT_RANGE);
  const [transactionTypeFilter, setTransactionTypeFilter] =
    useState<TransactionTypeFilter>(ALL_TRANSACTION_TYPES);
  const [interestMode, setInterestMode] = useState<InterestMode>(
    INTEREST_MODE.monthly
  );

  return {
    range,
    setRange,
    transactionTypeFilter,
    setTransactionTypeFilter,
    interestMode,
    setInterestMode,
  };
}
