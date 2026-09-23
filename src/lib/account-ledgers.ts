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

export interface Ledger {
  account: AccountWithDerivedWallets;
  transactions: Transaction[];
}

interface WalletHistory {
  history: Transaction[];
  accountId: string;
  asOf: string;
}

interface WalletPayout {
  interestPaid: Transaction[];
  wallet: WalletWithDerived;
}

function payWalletInterest(
  wallet: Wallet,
  { history, accountId, asOf }: WalletHistory
): WalletPayout {
  const transactions = history.filter(
    (transaction) => transaction.walletId === wallet.id
  );
  const interestPaid = addDailyInterest({
    wallet,
    transactions,
    asOf,
    accountId,
  });

  return {
    interestPaid,
    wallet: deriveWallet({
      wallet,
      transactions: [...transactions, ...interestPaid],
      asOf,
    }),
  };
}

async function payOwedInterest({
  store,
  account,
  asOf,
}: AccountQuery): Promise<Ledger> {
  const history = await store.listTransactionsByAccount(account.id);
  const payouts = account.wallets.map((wallet) =>
    payWalletInterest(wallet, { history, accountId: account.id, asOf })
  );
  const interestPaid = payouts.flatMap((payout) => payout.interestPaid);

  if (interestPaid.length > 0) {
    await store.insertTransactions(interestPaid);
  }

  const wallets = payouts
    .map((payout) => payout.wallet)
    .sort((a, b) => WALLET_ORDER[a.name] - WALLET_ORDER[b.name]);

  return {
    account: { ...account, wallets },
    transactions: [...history, ...interestPaid],
  };
}

export function settledLedgers({
  store,
  accounts,
  asOf,
}: AccountsQuery): Promise<Ledger[]> {
  return Promise.all(
    accounts.map((account) => payOwedInterest({ store, account, asOf }))
  );
}

export async function withDerivedWallets(
  query: AccountsQuery
): Promise<AccountWithDerivedWallets[]> {
  const ledgers = await settledLedgers(query);

  return ledgers.map((ledger) => ledger.account);
}
