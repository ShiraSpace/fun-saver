import { JSX } from 'react';
import { SignIn } from '@/components/SignIn';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import { ThemeController } from '@/theme/ThemeController';

export default function LoginPage(): JSX.Element {
  return (
    <main>
      <ThemeController initialThemeId={DEFAULT_THEME_ID}>
        <SignIn />
      </ThemeController>
    </main>
  );
}
