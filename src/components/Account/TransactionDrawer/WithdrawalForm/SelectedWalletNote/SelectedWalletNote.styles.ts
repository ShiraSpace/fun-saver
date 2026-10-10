import styled from '@emotion/styled';

export const GoalCompletionNote = styled.span`
  padding: 7px 10px;
  border-radius: 12px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  text-align: center;
  background: ${({ theme }): string => theme.colors.gainSoftBg};
  color: ${({ theme }): string => theme.colors.gainText};
`;
