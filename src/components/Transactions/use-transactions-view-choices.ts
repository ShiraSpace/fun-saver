import { useState } from 'react';
import { DEFAULT_RANGE, type RangeId } from './BalanceOverTime/constants';

export interface TransactionsViewChoices {
  range: RangeId;
  setRange: (range: RangeId) => void;
}

export function useTransactionsViewChoices(): TransactionsViewChoices {
  const [range, setRange] = useState<RangeId>(DEFAULT_RANGE);

  return { range, setRange };
}
