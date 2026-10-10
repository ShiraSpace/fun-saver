import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signedInUser } from '@/auth';
import { getStore } from '@/db';
import { SIGN_IN_PATH } from '@/lib/user/constants';
import { CURRENT_ACCOUNT_COOKIE, VIEW_MODE_COOKIE } from '@/lib/cookies';
import { findCurrentAccount } from '@/lib/account/current-account';
import type { Account } from '@/lib/account/types';
import { resolveViewMode, type ViewMode } from '@/lib/view-mode';
import type { SignedInUser } from '@/lib/user/types';
import { resolveThemeId, type ThemeId } from '@/theme/registry';

export interface SignedInAccounts {
  user: SignedInUser;
  accounts: Account[];
  currentAccountId: string;
  themeId: ThemeId;
  viewMode: ViewMode;
}

export async function signedInAccounts(): Promise<SignedInAccounts> {
  const [user, cookieStore] = await Promise.all([signedInUser(), cookies()]);

  if (!user) {
    redirect(SIGN_IN_PATH);
  }

  const accounts = await getStore().listAccountsForUser(user.id);
  const currentAccount = findCurrentAccount(
    accounts,
    cookieStore.get(CURRENT_ACCOUNT_COOKIE)?.value ?? ''
  );

  return {
    user,
    accounts,
    currentAccountId: currentAccount?.id ?? '',
    themeId: resolveThemeId(currentAccount?.themeId),
    viewMode: resolveViewMode(cookieStore.get(VIEW_MODE_COOKIE)?.value),
  };
}
