import { JSX, ReactElement } from 'react';
import {
  render as renderWithRtl,
  type RenderResult,
} from '@testing-library/react';
import { ThemeController } from '@/theme/ThemeController';
import { DEFAULT_THEME_ID } from '@/theme/registry';

function withProviders(ui: ReactElement): JSX.Element {
  return (
    <ThemeController initialThemeId={DEFAULT_THEME_ID}>{ui}</ThemeController>
  );
}

export function render(ui: ReactElement): RenderResult {
  return renderWithRtl(withProviders(ui));
}

export * from '@testing-library/react';
