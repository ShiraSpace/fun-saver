import styled from '@emotion/styled';
import { BalanceChangeHighlight } from '../../balance-change-parts';

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

export const ChangeOverRange = styled(BalanceChangeHighlight)`
  margin-inline-start: auto;

  &[data-balance-fell='true'] {
    background: ${({ theme }): string => theme.colors.depositBg};
    color: ${({ theme }): string => theme.colors.withdrawalText};
  }
`;
