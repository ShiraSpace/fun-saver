import type { TRANSACTION_TYPE } from './constants';

export type TransactionType =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export interface Transaction {
  id: string;
  walletId: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  occurredAt: string;
  createdAt: string;
}
