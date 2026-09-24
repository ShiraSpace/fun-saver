import { JSX } from 'react';
import { useThemeId } from '@/theme/AppThemeProvider';

export const THEME_ID_TESTID = 'theme-id';

export function CurrentThemeId(): JSX.Element {
  const themeId = useThemeId();
  return <span data-testid={THEME_ID_TESTID}>{themeId}</span>;
}
