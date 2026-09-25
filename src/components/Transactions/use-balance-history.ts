import { useMemo } from 'react';
import {
  balanceHistory,
  type BalanceHistory,
  type BalanceHistoryInput,
} from '@/lib/wallet/balance-history';

export function useBalanceHistory({
  wallets,
  transactions,
  asOf,
}: BalanceHistoryInput): BalanceHistory {
  return useMemo(
    () => balanceHistory({ wallets, transactions, asOf }),
    [wallets, transactions, asOf]
  );
}
