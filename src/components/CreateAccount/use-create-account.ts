import type { Account } from '@/lib/types';
import type { CreateAccountInput } from '@/lib/accounts-store';
import { fetchJson } from '@/lib/fetch-json';

const ACCOUNTS_ENDPOINT = '/api/accounts';

interface AccountCreator {
  createAccount: (input: CreateAccountInput) => Promise<Account>;
}

export function useCreateAccount(): AccountCreator {
  const createAccount = (input: CreateAccountInput): Promise<Account> =>
    fetchJson<Account>({
      url: ACCOUNTS_ENDPOINT,
      method: 'POST',
      body: input,
    });

  return { createAccount };
}
