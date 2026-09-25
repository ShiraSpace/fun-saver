import styled from '@emotion/styled';

export const Head = styled.div`
  display: flex;
  align-items: baseline;
  gap: 9px;
`;

export const TotalBalanceLabel = styled.span`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const TotalBalanceAmount = styled.span`
  font-size: ${({ theme }): number => theme.typography.amount}px;
`;

export const ChangeOverRange = styled.span`
  display: inline-flex;
  gap: 4px;
  margin-inline-start: auto;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  background: ${({ theme }): string => theme.colors.gainSoftBg};
  color: ${({ theme }): string => theme.colors.gainText};

  &[data-balance-fell='true'] {
    background: ${({ theme }): string => theme.colors.depositBg};
    color: ${({ theme }): string => theme.colors.withdrawalText};
  }
`;
