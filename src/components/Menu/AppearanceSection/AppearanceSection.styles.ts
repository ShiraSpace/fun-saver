import styled from '@emotion/styled';
import { APPEARANCE_SECTION_STYLE } from './constants';

export const Row = styled.div`
  display: flex;
  gap: ${APPEARANCE_SECTION_STYLE.rowGap}px;
`;

export const Swatch = styled.button<{ background: string }>`
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

export const SaveError = styled.span`
  display: block;
  margin-top: ${APPEARANCE_SECTION_STYLE.rowGap}px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.alert};
`;
