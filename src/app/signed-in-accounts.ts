import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signedInUserId } from '@/auth';
import { SELECTED_ACCOUNT_COOKIE } from '@/components/Home/selected-account-cookie';
import { getStore } from '@/db';
import { LOGIN_PATH } from '@/lib/constants';
import { selectedAccount } from '@/lib/selected-account';
import type { Account } from '@/lib/types';
import { resolveThemeId, type ThemeId } from '@/theme/registry';

export interface SignedInAccounts {
  accounts: Account[];
  selectedAccountId: string;
  themeId: ThemeId;
}

export async function signedInAccounts(): Promise<SignedInAccounts> {
  const [userId, cookieStore] = await Promise.all([
    signedInUserId(),
    cookies(),
  ]);

  if (!userId) {
    redirect(LOGIN_PATH);
  }

  const accounts = await getStore().listAccountsForUser(userId);
  const selected = selectedAccount(
    accounts,
    cookieStore.get(SELECTED_ACCOUNT_COOKIE)?.value ?? ''
  );

  return {
    accounts,
    selectedAccountId: selected?.id ?? '',
    themeId: resolveThemeId(selected?.themeId),
  };
}
