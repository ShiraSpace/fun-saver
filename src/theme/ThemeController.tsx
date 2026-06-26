'use client';

import { createContext, JSX, ReactNode, useCallback, useContext, useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { getThemeTokens, type ThemeId } from './registry';
import { THEME_COOKIE } from '@/lib/theme-cookie';

const ThemeIdContext = createContext<ThemeId | null>(null);
const SetThemeIdContext = createContext<((id: ThemeId) => void) | null>(null);

interface ThemeControllerProps {
  initialThemeId: ThemeId;
  children: ReactNode;
}

export function ThemeController({ initialThemeId, children }: ThemeControllerProps): JSX.Element {
  const [themeId, setThemeId] = useState<ThemeId>(initialThemeId);

  const select = useCallback((id: ThemeId): void => {
    setThemeId(id);
    document.cookie = `${THEME_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  return (
    <ThemeIdContext.Provider value={themeId}>
      <SetThemeIdContext.Provider value={select}>
        <ThemeProvider theme={getThemeTokens(themeId)}>{children}</ThemeProvider>
      </SetThemeIdContext.Provider>
    </ThemeIdContext.Provider>
  );
}

export function useThemeId(): ThemeId {
  const id = useContext(ThemeIdContext);
  if (id === null) throw new Error('useThemeId must be used within ThemeController');
  return id;
}

export function useSetThemeId(): (id: ThemeId) => void {
  const set = useContext(SetThemeIdContext);
  if (set === null) throw new Error('useSetThemeId must be used within ThemeController');
  return set;
}
