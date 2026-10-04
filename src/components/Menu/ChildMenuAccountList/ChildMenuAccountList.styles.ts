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

export const TitleIcon = styled.span`
  margin-inline-end: 6px;
`;

export const Arrow = styled.span`
  width: 9px;
  height: 9px;
  margin-inline-start: auto;
  border-bottom: 3px solid ${({ theme }): string => theme.colors.primary};
  border-inline-end: 3px solid ${({ theme }): string => theme.colors.primary};
  border-radius: 1px;
  transform: rotate(45deg);
`;
