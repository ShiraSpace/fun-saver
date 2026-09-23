'use client';

import { JSX, ReactNode, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { createRequiredContext } from '@/hooks/create-required-context';
import { getThemeTokens, type ThemeId } from './registry';

interface AppThemeProviderProps {
  initialThemeId: ThemeId;
  children: ReactNode;
}

const [ThemeIdProvider, useThemeId] =
  createRequiredContext<ThemeId>('AppThemeProvider');
const [SetThemeIdProvider, useSetThemeId] =
  createRequiredContext<(id: ThemeId) => void>('AppThemeProvider');

export { useSetThemeId, useThemeId };

export function AppThemeProvider({
  initialThemeId,
  children,
}: AppThemeProviderProps): JSX.Element {
  const [themeId, setThemeId] = useState<ThemeId>(initialThemeId);

  const theme = useMemo(() => getThemeTokens(themeId), [themeId]);

  useEffect((): void => {
    document.documentElement.dataset.theme = themeId;
  }, [themeId]);

  return (
    <ThemeIdProvider value={themeId}>
      <SetThemeIdProvider value={setThemeId}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </SetThemeIdProvider>
    </ThemeIdProvider>
  );
}
