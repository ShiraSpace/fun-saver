import { JSX } from 'react';
import { Method } from '@/components/Method';
import { ThemeController } from '@/theme/ThemeController';
import { signedInAccounts } from '../signed-in-accounts';

export const dynamic = 'force-dynamic';

export default async function MethodPage(): Promise<JSX.Element> {
  const { themeId } = await signedInAccounts();

  return (
    <main>
      <ThemeController initialThemeId={themeId}>
        <Method />
      </ThemeController>
    </main>
  );
}
