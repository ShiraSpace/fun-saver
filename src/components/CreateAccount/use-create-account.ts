import type { Account } from '@/lib/types';
import type { CreateAccountInput } from '@/lib/accounts-store';

const ACCOUNTS_ENDPOINT = '/api/accounts';

export function useCreateAccount(): {
  createAccount: (input: CreateAccountInput) => Promise<Account>;
} {
  const createAccount = async (input: CreateAccountInput): Promise<Account> => {
    const response = await fetch(ACCOUNTS_ENDPOINT, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('failed to create account');
    }

    return response.json();
  };

  return { createAccount };
}
