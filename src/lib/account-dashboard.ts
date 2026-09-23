import type { DataStore } from '@/db/data-store';
import type {
  Account,
  AccountWithDerivedWallets,
  Transaction,
  Wallet,
  WalletName,
  WalletWithDerived,
} from './types';
import { deriveWallet } from './derive-wallet';
import { addDailyInterest } from './interest';

const WALLET_ORDER: Record<WalletName, number> = {
  savings: 0,
  spending: 1,
  goodDeeds: 2,
};

interface AccountsQuery {
  store: DataStore;
  accounts: Account[];
  asOf: string;
}

interface AccountQuery {
  store: DataStore;
  account: Account;
  asOf: string;
}

export interface AccountLedger {
  account: AccountWithDerivedWallets;
  transactions: Transaction[];
}

interface WalletQuery {
  stored: Transaction[];
  accountId: string;
  asOf: string;
}

interface WalletSettlement {
  accrued: Transaction[];
  wallet: WalletWithDerived;
}

function settleWallet(
  wallet: Wallet,
  { stored, accountId, asOf }: WalletQuery
): WalletSettlement {
  const transactions = stored.filter(
    (transaction) => transaction.walletId === wallet.id
  );
  const accrued = addDailyInterest({ wallet, transactions, asOf, accountId });

  return {
    accrued,
    wallet: deriveWallet({
      wallet,
      transactions: [...transactions, ...accrued],
      asOf,
    }),
  };
}

async function settleAccount({
  store,
  account,
  asOf,
}: AccountQuery): Promise<AccountLedger> {
  const stored = await store.listTransactionsByAccount(account.id);
  const settlements = account.wallets.map((wallet) =>
    settleWallet(wallet, { stored, accountId: account.id, asOf })
  );
  const accrued = settlements.flatMap((settlement) => settlement.accrued);

  if (accrued.length > 0) {
    await store.insertTransactions(accrued);
  }

  const wallets = settlements
    .map((settlement) => settlement.wallet)
    .sort((a, b) => WALLET_ORDER[a.name] - WALLET_ORDER[b.name]);

  return {
    account: { ...account, wallets },
    transactions: [...stored, ...accrued],
  };
}

export function accountLedgers({
  store,
  accounts,
  asOf,
}: AccountsQuery): Promise<AccountLedger[]> {
  return Promise.all(
    accounts.map((account) => settleAccount({ store, account, asOf }))
  );
}

export async function withDerivedWallets(
  query: AccountsQuery
): Promise<AccountWithDerivedWallets[]> {
  const ledgers = await accountLedgers(query);

  return ledgers.map((ledger) => ledger.account);
}
