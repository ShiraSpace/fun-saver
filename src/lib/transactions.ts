import type { DataStore } from '@/db/data-store';
import { DEPOSIT_SPLIT } from './constants';
import { newId } from './ids';
import { ValidationError } from './errors';
import type { Transaction, WalletName } from './types';

export type DepositSplit = Record<WalletName, number>;

export function splitDeposit(totalAgorot: number): DepositSplit {
  const spending = Math.floor(totalAgorot * DEPOSIT_SPLIT.spending);
  const goodDeeds = Math.floor(totalAgorot * DEPOSIT_SPLIT.goodDeeds);
  const savings = totalAgorot - spending - goodDeeds;

  return { savings, spending, goodDeeds };
}

export async function addDeposit(
  store: DataStore,
  accountId: string,
  amountAgorot: number,
  asOf: string
): Promise<Transaction[]> {
  if (!Number.isInteger(amountAgorot) || amountAgorot <= 0) {
    throw new ValidationError('deposit amount must be a positive whole number');
  }

  const wallets = await store.listWalletsByAccount(accountId);
  const split = splitDeposit(amountAgorot);

  const transactions: Transaction[] = wallets.map((wallet) => ({
    id: newId(),
    walletId: wallet.id,
    type: 'deposit',
    amount: split[wallet.name],
    occurredAt: asOf,
  }));

  await store.insertTransactions(transactions);

  return transactions;
}
