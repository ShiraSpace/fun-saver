import type { DataStore } from '@/db/data-store';
import { DEPOSIT_SHARES, TRANSACTION_TYPE } from './constants';
import { balance } from '@/lib/wallet/balance';
import { newId } from '@/lib/ids';
import { OverdraftError } from './errors';
import { ValidationError } from '@/lib/errors';
import type { Account } from '@/lib/account/types';
import type { WalletName } from '@/lib/wallet/types';
import type { Transaction } from './types';

interface AddWithdrawalParams {
  store: DataStore;
  account: Account;
  walletId: string;
  amountAgorot: number;
  asOf: string;
}

interface AddDepositParams {
  store: DataStore;
  account: Account;
  amountAgorot: number;
  asOf: string;
}

export type DepositSplit = Record<WalletName, number>;

function assertPositiveAmount(amountAgorot: number): void {
  if (!Number.isInteger(amountAgorot) || amountAgorot <= 0) {
    throw new ValidationError('amount must be a positive whole number');
  }
}

export function splitDeposit(amountAgorot: number): DepositSplit {
  const spending = Math.floor(amountAgorot * DEPOSIT_SHARES.spending);
  const goodDeeds = Math.floor(amountAgorot * DEPOSIT_SHARES.goodDeeds);
  const savings = amountAgorot - spending - goodDeeds;

  return { savings, spending, goodDeeds };
}

export async function addDeposit({
  store,
  account,
  amountAgorot,
  asOf,
}: AddDepositParams): Promise<Transaction[]> {
  assertPositiveAmount(amountAgorot);

  const split = splitDeposit(amountAgorot);

  const createdAt = new Date().toISOString();

  const transactions: Transaction[] = account.wallets.map((wallet) => ({
    id: newId(),
    walletId: wallet.id,
    accountId: account.id,
    type: TRANSACTION_TYPE.deposit,
    amount: split[wallet.name],
    occurredAt: asOf,
    createdAt,
  }));

  await store.insertTransactions(transactions);

  return transactions;
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

  const existing = await store.listTransactionsByWallet(account.id, walletId);

  if (balance(existing) < amountAgorot) {
    throw new OverdraftError('cannot withdraw more than the pot balance');
  }

  const withdrawal: Transaction = {
    id: newId(),
    walletId,
    accountId: account.id,
    type: TRANSACTION_TYPE.withdrawal,
    amount: amountAgorot,
    occurredAt: asOf,
    createdAt: new Date().toISOString(),
  };

  await store.insertTransactions([withdrawal]);

  return withdrawal;
}
