import styled from '@emotion/styled';
import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import { readByScreenReaderOnly } from '../../transactions-parts';
import { ChangeColumn } from '../transaction-list-parts';

export const Row = styled.li`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 12px;

  & + & {
    border-top: 1px solid ${({ theme }): string => theme.colors.divider};
  }
`;

export const TransactionRowDescription = styled.div`
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Name = styled.span`
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;

  &[data-transaction-type='${TRANSACTION_TYPE.interest}'] {
    font-weight: 600;
  }
`;

export const Days = styled.span`
  margin-inline-start: 6px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const ChangeAmount = styled(ChangeColumn)`
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.gainText};

  &[data-balance-fell='true'] {
    color: ${({ theme }): string => theme.colors.withdrawalText};
  }
`;

export const ColumnName = styled.span`
  ${readByScreenReaderOnly}
`;
