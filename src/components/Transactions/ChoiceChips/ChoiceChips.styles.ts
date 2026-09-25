import { css } from '@emotion/react';
import styled from '@emotion/styled';

const readByScreenReaderOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

export const Group = styled.fieldset`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0;
  padding: 0;
  border: none;
  min-width: 0;
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

  &:has(input:focus-visible) {
    outline: 2px solid ${({ theme }): string => theme.colors.selectionRing};
    outline-offset: 2px;
  }
`;
