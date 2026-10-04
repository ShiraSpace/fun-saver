import styled from '@emotion/styled';
import { Row, childMenuRow } from '../row-parts';

export const List = styled.div`
  display: grid;
  gap: 8px;
`;

export const AccountRow = styled(Row)`
  ${childMenuRow}
  border-radius: 18px;
  background: ${({ theme }): string => theme.colors.accountScopeBg};
`;

export const Arrow = styled.span`
  margin-inline-start: auto;
  font-size: 22px;
  color: ${({ theme }): string => theme.colors.primary};
`;
