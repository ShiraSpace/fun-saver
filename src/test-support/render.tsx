import { JSX, ReactElement } from 'react';
import { ThemeProvider } from '@emotion/react';
import { getThemeTokens } from '@/theme/registry';
import {
  render as renderWithRtl,
  type RenderResult,
} from '@testing-library/react';

function withTheme(ui: ReactElement): JSX.Element {
  return <ThemeProvider theme={getThemeTokens()}>{ui}</ThemeProvider>;
}

export function render(ui: ReactElement): RenderResult {
  return renderWithRtl(withTheme(ui));
}

export * from '@testing-library/react';
