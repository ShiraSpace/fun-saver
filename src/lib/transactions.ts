import type { DataStore } from '@/db/data-store';
import { DEPOSIT_SPLIT } from './constants';
import { balance } from './derivations';
import { newId } from './ids';
import { OverdraftError, ValidationError } from './errors';
import type { Account, Transaction, WalletName } from './types';

export type DepositSplit = Record<WalletName, number>;

function assertPositiveAmount(amountAgorot: number): void {
  if (!Number.isInteger(amountAgorot) || amountAgorot <= 0) {
    throw new ValidationError('amount must be a positive whole number');
  }
}

export function splitDeposit(totalAgorot: number): DepositSplit {
  const spending = Math.floor(totalAgorot * DEPOSIT_SPLIT.spending);
  const goodDeeds = Math.floor(totalAgorot * DEPOSIT_SPLIT.goodDeeds);
  const savings = totalAgorot - spending - goodDeeds;

  return { savings, spending, goodDeeds };
}

export interface AddDepositParams {
  store: DataStore;
  account: Account;
  amountAgorot: number;
  asOf: string;
}

export async function addDeposit({
  store,
  account,
  amountAgorot,
  asOf,
}: AddDepositParams): Promise<Transaction[]> {
  assertPositiveAmount(amountAgorot);

  const split = splitDeposit(amountAgorot);

  const transactions: Transaction[] = account.wallets.map((wallet) => ({
    id: newId(),
    walletId: wallet.id,
    accountId: account.id,
    type: 'deposit',
    amount: split[wallet.name],
    occurredAt: asOf,
  }));

  await store.insertTransactions(transactions);

  return transactions;
}

export interface AddWithdrawalParams {
  store: DataStore;
  account: Account;
  walletId: string;
  amountAgorot: number;
  asOf: string;
}

export async function addWithdrawal({
  store,
  account,
  walletId,
  amountAgorot,
  asOf,
}: AddWithdrawalParams): Promise<Transaction> {
  assertPositiveAmount(amountAgorot);

  const wallet = account.wallets.find((candidate) => candidate.id === walletId);

  if (!wallet) {
    throw new ValidationError('unknown wallet');
  }

  const existing = await store.listTransactionsByWallet(walletId);

  if (balance(existing) < amountAgorot) {
    throw new OverdraftError('cannot withdraw more than the pot balance');
  }

  const transaction: Transaction = {
    id: newId(),
    walletId,
    accountId: account.id,
    type: 'withdrawal',
    amount: amountAgorot,
    occurredAt: asOf,
  };

  await store.insertTransactions([transaction]);

  return transaction;
}
