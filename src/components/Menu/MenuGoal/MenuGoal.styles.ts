import styled from '@emotion/styled';
import { Row } from '../row-parts';

export const GoalRow = styled(Row)`
  margin-top: 10px;
  border-color: ${({ theme }): string => theme.colors.softBorder};
`;

export const Chevron = styled.span`
  font-size: ${({ theme }): number => theme.typography.body}px;
  color: ${({ theme }): string => theme.colors.textMuted};
`;
