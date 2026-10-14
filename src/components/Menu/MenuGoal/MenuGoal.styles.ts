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

export const CancelGoalLink = styled.button`
  align-self: center;
  min-height: 44px;
  padding: 0 14px;
  border: none;
  background: none;
  font-family: inherit;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.alertText};
  text-decoration: underline;
  cursor: pointer;
`;
