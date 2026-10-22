import styled from '@emotion/styled';

export const Card = styled.section`
  padding: 8px 18px 18px;
  text-align: center;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: 22px;
  box-shadow: 0 5px 0 ${({ theme }): string => theme.shadows.faint};
`;

export const GoalSpace = styled.div`
  margin: 8px 2px 0;
  text-align: start;
`;
