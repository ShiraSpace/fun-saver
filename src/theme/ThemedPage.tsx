import { JSX, ReactNode } from 'react';
import { ThemeController } from './ThemeController';
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
      <ThemeController initialThemeId={themeId}>{children}</ThemeController>
    </main>
  );
}
