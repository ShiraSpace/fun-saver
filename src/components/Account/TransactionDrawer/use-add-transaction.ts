interface AddDepositTransaction {
  addDeposit: (amountShekels: number) => Promise<void>;
}

function depositsEndpoint(accountId: string): string {
  return `/api/accounts/${accountId}/deposits`;
}

export function useAddTransaction(accountId: string): AddDepositTransaction {
  const addDeposit = async (amountShekels: number): Promise<void> => {
    const response = await fetch(depositsEndpoint(accountId), {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountShekels }),
    });

    if (!response.ok) {
      throw new Error('failed to add deposit');
    }
  };

  return { addDeposit };
}
