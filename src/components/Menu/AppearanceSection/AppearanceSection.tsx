'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { useThemeId, useSetThemeId } from '@/theme/ThemeController';
import { MenuLabel } from '../MenuLabel';
import {
  APPEARANCE_SECTION_CONTENT,
  APPEARANCE_SECTION_STYLE,
  APPEARANCE_SECTION_TEST_IDS,
} from './constants';

const Row = styled.div`
  display: flex;
  gap: ${APPEARANCE_SECTION_STYLE.rowGap}px;
`;

const Swatch = styled.button<{ background: string }>`
  width: ${APPEARANCE_SECTION_STYLE.swatchSize}px;
  height: ${APPEARANCE_SECTION_STYLE.swatchSize}px;
  border: none;
  border-radius: ${APPEARANCE_SECTION_STYLE.swatchRadius}px;
  background: ${({ background }): string => background};
  cursor: pointer;

  &[data-selected='true'] {
    outline: ${APPEARANCE_SECTION_STYLE.ringWidth}px solid
      ${APPEARANCE_SECTION_STYLE.ringColor};
    outline-offset: ${APPEARANCE_SECTION_STYLE.ringOffset}px;
  }
`;

export function AppearanceSection(): JSX.Element {
  const selectedId = useThemeId();
  const setThemeId = useSetThemeId();

  const themeSelectorComponents = APPEARANCE_SECTION_CONTENT.themes.map(
    ({ id, label, background }) => (
      <Swatch
        key={id}
        type="button"
        aria-label={label}
        title={label}
        background={background}
        data-testid={APPEARANCE_SECTION_TEST_IDS.swatch}
        data-selected={id === selectedId}
        onClick={(): void => setThemeId(id)}
      />
    )
  );

  return (
    <section data-testid={APPEARANCE_SECTION_TEST_IDS.section}>
      <MenuLabel>{APPEARANCE_SECTION_CONTENT.label}</MenuLabel>
      <Row>{themeSelectorComponents}</Row>
    </section>
  );
}
