interface AddTransaction {
  addDeposit: (amountShekels: number) => Promise<void>;
  withdraw: (walletId: string, amountShekels: number) => Promise<void>;
}

function accountEndpoint(accountId: string, action: string): string {
  return `/api/accounts/${accountId}/${action}`;
}

async function postTransaction(
  url: string,
  body: Record<string, unknown>
): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('transaction failed');
  }
}

export function useAddTransaction(accountId: string): AddTransaction {
  return {
    addDeposit: (amountShekels): Promise<void> =>
      postTransaction(accountEndpoint(accountId, 'deposits'), {
        amount: amountShekels,
      }),
    withdraw: (walletId, amountShekels): Promise<void> =>
      postTransaction(accountEndpoint(accountId, 'withdrawals'), {
        walletId,
        amount: amountShekels,
      }),
  };
}
