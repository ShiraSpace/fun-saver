import type { DataStore } from '@/db/data-store';
import { oldestFirst } from '@/db/transaction-order';
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

interface SettleInterestParams {
  store: DataStore;
  accounts: Account[];
  asOf: string;
}

interface SettleAccountInterestParams {
  store: DataStore;
  account: Account;
  asOf: string;
}

export interface SettledAccount {
  account: AccountWithDerivedWallets;
  transactions: Transaction[];
}

interface SettleWalletInterestParams {
  accountTransactions: Transaction[];
  accountId: string;
  asOf: string;
}

interface SettledWallet {
  settledInterest: Transaction[];
  wallet: WalletWithDerived;
}

function settleWalletInterest(
  wallet: Wallet,
  { accountTransactions, accountId, asOf }: SettleWalletInterestParams
): SettledWallet {
  const walletTransactions = accountTransactions.filter(
    (transaction) => transaction.walletId === wallet.id
  );
  const settledInterest = addDailyInterest({
    wallet,
    transactions: walletTransactions,
    asOf,
    accountId,
  });

  const settledWalletTransactions = [...walletTransactions, ...settledInterest];

  return {
    settledInterest,
    wallet: deriveWallet({
      wallet,
      transactions: settledWalletTransactions,
      asOf,
    }),
  };
}

async function settleAccountInterest({
  store,
  account,
  asOf,
}: SettleAccountInterestParams): Promise<SettledAccount> {
  const accountTransactions = await store.listTransactionsByAccount(account.id);
  const settledWallets = account.wallets.map((wallet) =>
    settleWalletInterest(wallet, {
      accountTransactions,
      accountId: account.id,
      asOf,
    })
  );
  const settledInterest = settledWallets.flatMap(
    (settledWallet) => settledWallet.settledInterest
  );

  if (settledInterest.length > 0) {
    await store.insertTransactions(settledInterest);
  }

  const unorderedWallets = settledWallets.map(
    (settledWallet) => settledWallet.wallet
  );
  const wallets = unorderedWallets.sort(
    (left, right) => WALLET_ORDER[left.name] - WALLET_ORDER[right.name]
  );
  const settledTransactions = oldestFirst([
    ...accountTransactions,
    ...settledInterest,
  ]);

  return {
    account: { ...account, wallets },
    transactions: settledTransactions,
  };
}

export function settleInterest({
  store,
  accounts,
  asOf,
}: SettleInterestParams): Promise<SettledAccount[]> {
  return Promise.all(
    accounts.map((account) => settleAccountInterest({ store, account, asOf }))
  );
}

export async function withDerivedWallets(
  query: SettleInterestParams
): Promise<AccountWithDerivedWallets[]> {
  const settledAccounts = await settleInterest(query);

  return settledAccounts.map((settledAccount) => settledAccount.account);
}
