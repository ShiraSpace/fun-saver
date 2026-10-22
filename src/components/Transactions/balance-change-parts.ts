import styled from '@emotion/styled';

export const BalanceChangeHighlight = styled.span`
  display: inline-flex;
  gap: 4px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  background: ${({ theme }): string => theme.colors.gainSoftBg};
  color: ${({ theme }): string => theme.colors.gainText};
`;
