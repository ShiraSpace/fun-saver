import { JSX } from 'react';
import { useThemeId } from '@/theme/ThemeController';

export const THEME_ID_TESTID = 'theme-id';

export function ThemeDisplay(): JSX.Element {
  const id = useThemeId();
  return <span data-testid={THEME_ID_TESTID}>{id}</span>;
}
