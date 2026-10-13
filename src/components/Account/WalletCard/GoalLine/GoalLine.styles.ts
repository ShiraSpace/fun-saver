import styled from '@emotion/styled';

export const Line = styled.button`
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-top: 10px;
  padding: 10px 0 4px;
  border: none;
  border-top: 1.5px dashed ${({ theme }): string => theme.colors.divider};
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
`;

export const SetGoalPrompt = styled.span`
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
`;
