import styled from '@emotion/styled';

export const Amounts = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  font-size: ${({ theme }): number => theme.typography.label}px;
`;

export const ChangeColumn = styled.span`
  width: 56px;
  text-align: center;
`;

export const BalanceColumn = styled.span`
  width: 46px;
  text-align: end;
  padding-inline-start: 4px;
  margin-inline-start: 4px;
  border-inline-start: 1px solid ${({ theme }): string => theme.colors.divider};
  color: ${({ theme }): string => theme.colors.textMuted};
`;
