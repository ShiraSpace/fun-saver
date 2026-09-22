import { JSX } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Method } from '@/components/Method';
import { SELECTED_ACCOUNT_COOKIE } from '@/components/Home/selected-account-cookie';
import { getStore } from '@/db';
import { listAccountsWithWallets } from '@/lib/account-dashboard';
import { today } from '@/lib/clock';
import { HOME_ROUTE } from '@/lib/routes';
import { selectedAccount } from '@/lib/selected-account';
import { resolveThemeId } from '@/theme/registry';
import { ThemeController } from '@/theme/ThemeController';

export const dynamic = 'force-dynamic';

export default async function MethodPage(): Promise<JSX.Element> {
  const [accounts, cookieStore] = await Promise.all([
    listAccountsWithWallets(getStore(), today()),
    cookies(),
  ]);

  const storedAccountId = cookieStore.get(SELECTED_ACCOUNT_COOKIE)?.value ?? '';
  const initialAccount = selectedAccount(accounts, storedAccountId);

  if (!initialAccount) {
    redirect(HOME_ROUTE);
  }

  return (
    <main>
      <ThemeController initialThemeId={resolveThemeId(initialAccount.themeId)}>
        <Method accounts={accounts} initialAccount={initialAccount} />
      </ThemeController>
    </main>
  );
}
