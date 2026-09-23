'use client';

import { JSX } from 'react';
import { getThemeTokens } from '@/theme/registry';
import { MenuLabel } from '../MenuLabel';
import { useAccountTheme } from './use-account-theme';
import {
  APPEARANCE_SECTION_CONTENT,
  APPEARANCE_SECTION_TEST_IDS,
} from './constants';
import { Row, Swatch, SaveError } from './AppearanceSection.styles';

export function AppearanceSection(): JSX.Element {
  const { activeThemeId, chooseTheme, saveFailed } = useAccountTheme();

  const themeSelectorComponents = APPEARANCE_SECTION_CONTENT.themes.map(
    ({ id, label }) => (
      <Swatch
        key={id}
        type="button"
        aria-label={label}
        title={label}
        background={getThemeTokens(id).gradients.screen}
        data-testid={APPEARANCE_SECTION_TEST_IDS.swatch}
        data-selected={id === activeThemeId}
        onClick={(): void => chooseTheme(id)}
      />
    )
  );

  return (
    <section data-testid={APPEARANCE_SECTION_TEST_IDS.section}>
      <MenuLabel>{APPEARANCE_SECTION_CONTENT.label}</MenuLabel>
      <Row>{themeSelectorComponents}</Row>
      {saveFailed && (
        <SaveError data-testid={APPEARANCE_SECTION_TEST_IDS.saveError}>
          {APPEARANCE_SECTION_CONTENT.saveError}
        </SaveError>
      )}
    </section>
  );
}
