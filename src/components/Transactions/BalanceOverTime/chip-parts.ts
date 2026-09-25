import styled from '@emotion/styled';

export const BalanceChip = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1.5px solid ${({ theme }): string => theme.colors.divider};
  background: transparent;
  color: ${({ theme }): string => theme.colors.textMuted};
  font: inherit;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  cursor: pointer;

  &[aria-pressed='true'] {
    background: ${({ theme }): string => theme.colors.depositBg};
    border-color: currentColor;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }): string => theme.colors.selectionRing};
    outline-offset: 2px;
  }
`;
