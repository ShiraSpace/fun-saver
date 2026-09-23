import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signedInUser } from '@/auth';
import { getStore } from '@/db';
import { LOGIN_PATH } from '@/lib/constants';
import { SELECTED_ACCOUNT_COOKIE } from '@/lib/cookies';
import { selectedAccount } from '@/lib/selected-account';
import type { Account, SignedInUser } from '@/lib/types';
import { resolveThemeId, type ThemeId } from '@/theme/registry';

export interface SignedInAccounts {
  user: SignedInUser;
  accounts: Account[];
  selectedAccountId: string;
  themeId: ThemeId;
}

export async function signedInAccounts(): Promise<SignedInAccounts> {
  const [user, cookieStore] = await Promise.all([signedInUser(), cookies()]);

  if (!user) {
    redirect(LOGIN_PATH);
  }

  const accounts = await getStore().listAccountsForUser(user.id);
  const selected = selectedAccount(
    accounts,
    cookieStore.get(SELECTED_ACCOUNT_COOKIE)?.value ?? ''
  );

  return {
    user,
    accounts,
    selectedAccountId: selected?.id ?? '',
    themeId: resolveThemeId(selected?.themeId),
  };
}
