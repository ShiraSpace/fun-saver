import styled from '@emotion/styled';
import { readByScreenReaderOnly } from '../transactions-parts';
import { CHOICE_CHIPS_VARIANT } from './constants';

export const Group = styled.fieldset`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0;
  padding: 0;
  border: none;
  min-width: 0;

  &[data-variant='${CHOICE_CHIPS_VARIANT.segmented}'] {
    display: inline-flex;
    flex-wrap: nowrap;
    gap: 0;
    border: 1.5px solid ${({ theme }): string => theme.colors.divider};
    border-radius: 999px;
    overflow: hidden;
  }
`;

export const GroupName = styled.legend`
  ${readByScreenReaderOnly}
`;

export const Radio = styled.input`
  ${readByScreenReaderOnly}
`;

export const Chip = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1.5px solid ${({ theme }): string => theme.colors.divider};
  color: ${({ theme }): string => theme.colors.textMuted};
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  cursor: pointer;

  &:has(input:checked) {
    background: ${({ theme }): string => theme.colors.depositBg};
    border-color: currentColor;
  }

  [data-variant='${CHOICE_CHIPS_VARIANT.segmented}'] > & {
    padding: 5px 12px;
    border: none;
    border-radius: 0;
  }

  [data-variant='${CHOICE_CHIPS_VARIANT.segmented}'] > &:has(input:checked) {
    background: ${({ theme }): string => theme.colors.textStrong};
    color: ${({ theme }): string => theme.colors.surface};
  }

  &:has(input:focus-visible) {
    outline: 2px solid ${({ theme }): string => theme.colors.selectionRing};
    outline-offset: 2px;
  }
`;
