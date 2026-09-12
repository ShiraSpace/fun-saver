import { fetchJson } from '@/lib/fetch-json';
interface AddTransaction {
  addDeposit: (amountShekels: number) => Promise<void>;
  withdraw: (walletId: string, amountShekels: number) => Promise<void>;
}

function accountEndpoint(accountId: string, action: string): string {
  return `/api/accounts/${accountId}/${action}`;
}

export function useAddTransaction(accountId: string): AddTransaction {
  return {
    addDeposit: (amountShekels): Promise<void> =>
      fetchJson({
        url: accountEndpoint(accountId, 'deposits'),
        method: 'POST',
        body: { amount: amountShekels },
      }),
    withdraw: (walletId, amountShekels): Promise<void> =>
      fetchJson({
        url: accountEndpoint(accountId, 'withdrawals'),
        method: 'POST',
        body: { walletId, amount: amountShekels },
      }),
  };
}
