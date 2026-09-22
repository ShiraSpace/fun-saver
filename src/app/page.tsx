import { JSX } from 'react';
import { cookies } from 'next/headers';
import { Home } from '@/components/Home';
import { SELECTED_ACCOUNT_COOKIE } from '@/components/Home/selected-account-cookie';
import { getStore } from '@/db';
import { listAccountsWithWallets } from '@/lib/account-dashboard';
import { today } from '@/lib/clock';
import { selectedAccount } from '@/lib/selected-account';
import { resolveThemeId } from '@/theme/registry';
import { ThemeController } from '@/theme/ThemeController';

export const dynamic = 'force-dynamic';

export default async function HomePage(): Promise<JSX.Element> {
  const [accounts, cookieStore] = await Promise.all([
    listAccountsWithWallets(getStore(), today()),
    cookies(),
  ]);

  const storedAccountId = cookieStore.get(SELECTED_ACCOUNT_COOKIE)?.value ?? '';
  const initialAccount = selectedAccount(accounts, storedAccountId);
  const initialThemeId = resolveThemeId(initialAccount?.themeId);

  return (
    <main>
      <ThemeController initialThemeId={initialThemeId}>
        <Home accounts={accounts} initialAccountId={initialAccount?.id ?? ''} />
      </ThemeController>
    </main>
  );
}
