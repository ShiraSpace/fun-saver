import styled from '@emotion/styled';
import { BalanceChangeHighlight } from '../../balance-change-parts';
import { Amounts } from '../transaction-list-parts';

export const Heading = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 12px 6px;
  background: ${({ theme }): string => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }): string => theme.colors.divider};
`;

export const MonthName = styled.h3`
  min-width: 0;
  margin: 0;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
`;

export const InterestThisMonth = styled(BalanceChangeHighlight)`
  white-space: nowrap;
`;

export const ColumnNames = styled(Amounts)`
  margin-inline-start: auto;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Rows = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
