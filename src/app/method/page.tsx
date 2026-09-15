import { JSX } from 'react';
import { cookies } from 'next/headers';
import { Method } from '@/components/Method';
import { SELECTED_ACCOUNT_COOKIE } from '@/components/Home/selected-account-cookie';
import { getStore } from '@/db';
import { selectedAccount } from '@/lib/selected-account';
import { resolveThemeId } from '@/theme/registry';
import { ThemeController } from '@/theme/ThemeController';

export const dynamic = 'force-dynamic';

export default async function MethodPage(): Promise<JSX.Element> {
  const [accounts, cookieStore] = await Promise.all([
    getStore().listAccounts(),
    cookies(),
  ]);

  const storedAccountId = cookieStore.get(SELECTED_ACCOUNT_COOKIE)?.value ?? '';
  const themeId = resolveThemeId(
    selectedAccount(accounts, storedAccountId)?.themeId
  );

  return (
    <main>
      <ThemeController initialThemeId={themeId}>
        <Method />
      </ThemeController>
    </main>
  );
}
