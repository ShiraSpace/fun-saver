import { JSX } from 'react';
import { SignIn } from '@/components/SignIn';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import { ThemedPage } from '@/theme/ThemedPage';

export default function LoginPage(): JSX.Element {
  return (
    <ThemedPage themeId={DEFAULT_THEME_ID}>
      <SignIn />
    </ThemedPage>
  );
}
