import { JSX, ReactNode } from 'react';
import { AppThemeProvider } from './AppThemeProvider';
import type { ThemeId } from './registry';

interface ThemedPageProps {
  themeId: ThemeId;
  children: ReactNode;
}

export function ThemedPage({
  themeId,
  children,
}: ThemedPageProps): JSX.Element {
  return (
    <main>
      <AppThemeProvider initialThemeId={themeId}>{children}</AppThemeProvider>
    </main>
  );
}
