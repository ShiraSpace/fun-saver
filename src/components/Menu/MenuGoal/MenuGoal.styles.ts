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

export const CancelGoalButton = styled.button`
  display: block;
  min-height: 32px;
  margin-block: 0 -7px;
  margin-inline-start: auto;
  padding: 0 6px 4px;
  border: none;
  background: none;
  font-family: inherit;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.alertText};
  text-decoration: underline;
  cursor: pointer;
`;
