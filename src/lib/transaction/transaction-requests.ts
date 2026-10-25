import { fetchJson } from '@/lib/fetch-json';
import { accountEndpoint } from '@/lib/account/account-requests';

export interface WithdrawalRequest {
  accountId: string;
  walletId: string;
  amountShekels: number;
}

function accountTransactionUrl(accountId: string, transactionPath: string): string {
  return `${accountEndpoint(accountId)}/${transactionPath}`;
}

export function deposit(accountId: string, amountShekels: number): Promise<void> {
  return fetchJson({
    url: accountTransactionUrl(accountId, 'deposits'),
    method: 'POST',
    body: { amount: amountShekels },
  });
}

export function withdraw({ accountId, walletId, amountShekels }: WithdrawalRequest): Promise<void> {
  return fetchJson({
    url: accountTransactionUrl(accountId, 'withdrawals'),
    method: 'POST',
    body: { walletId, amount: amountShekels },
  });
}
