'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
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
  return (
    <section data-testid={APPEARANCE_SECTION_TEST_IDS.section}>
      <MenuLabel>{APPEARANCE_SECTION_CONTENT.label}</MenuLabel>
      <Row>
        {APPEARANCE_SECTION_CONTENT.themes.map((theme) => (
          <Swatch
            key={theme.id}
            type="button"
            aria-label={theme.label}
            title={theme.label}
            background={theme.background}
            data-testid={APPEARANCE_SECTION_TEST_IDS.swatch}
            data-selected={theme.id === APPEARANCE_SECTION_CONTENT.selectedId}
          />
        ))}
      </Row>
    </section>
  );
}
