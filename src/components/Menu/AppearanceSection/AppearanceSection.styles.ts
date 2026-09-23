import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { APPEARANCE_SECTION_STYLE } from './constants';

const selectedRing = ({ theme }: { theme: Theme }): string =>
  theme.colors.textStrong;

export const Row = styled.div`
  display: flex;
  gap: ${APPEARANCE_SECTION_STYLE.rowGap}px;
`;

export const Swatch = styled.button<{ background: string }>`
  width: ${APPEARANCE_SECTION_STYLE.swatchSize}px;
  height: ${APPEARANCE_SECTION_STYLE.swatchSize}px;
  box-sizing: border-box;
  border: ${APPEARANCE_SECTION_STYLE.ringWidth}px solid transparent;
  border-radius: ${APPEARANCE_SECTION_STYLE.swatchRadius}px;
  background: ${({ background }): string => background};
  cursor: pointer;

  &[data-selected='true'] {
    border-color: ${selectedRing};
  }
`;

export const SaveError = styled.span`
  display: block;
  margin-top: ${APPEARANCE_SECTION_STYLE.rowGap}px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.alertText};
`;
