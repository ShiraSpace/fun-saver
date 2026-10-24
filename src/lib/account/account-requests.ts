import type { Account, AccountEdits, CreateAccountRequest } from './types';
import { fetchJson } from '@/lib/fetch-json';

const ACCOUNTS_ENDPOINT = '/api/accounts';

function accountEndpoint(accountId: string): string {
  return `${ACCOUNTS_ENDPOINT}/${accountId}`;
}

export function createAccount(input: CreateAccountRequest): Promise<Account> {
  return fetchJson<Account>({ url: ACCOUNTS_ENDPOINT, method: 'POST', body: input });
}

export function updateAccount(accountId: string, edits: AccountEdits): Promise<Account> {
  return fetchJson<Account>({ url: accountEndpoint(accountId), method: 'PUT', body: edits });
}
