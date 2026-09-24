import { fetchJson } from '@/lib/fetch-json';
interface AddTransaction {
  addDeposit: (amountShekels: number) => Promise<void>;
  addWithdrawal: (walletId: string, amountShekels: number) => Promise<void>;
}

function accountTransactionUrl(
  accountId: string,
  transactionPath: string
): string {
  return `/api/accounts/${accountId}/${transactionPath}`;
}

export function useAddTransaction(accountId: string): AddTransaction {
  return {
    addDeposit: (amountShekels): Promise<void> =>
      fetchJson({
        url: accountTransactionUrl(accountId, 'deposits'),
        method: 'POST',
        body: { amount: amountShekels },
      }),
    addWithdrawal: (walletId, amountShekels): Promise<void> =>
      fetchJson({
        url: accountTransactionUrl(accountId, 'withdrawals'),
        method: 'POST',
        body: { walletId, amount: amountShekels },
      }),
  };
}
