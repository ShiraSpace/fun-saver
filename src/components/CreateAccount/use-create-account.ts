import type { Account } from '@/lib/account/types';
import type { CreateAccountRequest } from '@/lib/account/accounts-store';
import { fetchJson } from '@/lib/fetch-json';

const ACCOUNTS_ENDPOINT = '/api/accounts';

interface AccountCreator {
  createAccount: (input: CreateAccountRequest) => Promise<Account>;
}

export function useCreateAccount(): AccountCreator {
  const createAccount = (input: CreateAccountRequest): Promise<Account> =>
    fetchJson<Account>({
      url: ACCOUNTS_ENDPOINT,
      method: 'POST',
      body: input,
    });

  return { createAccount };
}
