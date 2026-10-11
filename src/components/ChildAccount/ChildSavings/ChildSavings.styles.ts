import styled from '@emotion/styled';

export const Card = styled.section`
  padding: 22px 18px 18px;
  text-align: center;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: 22px;
  box-shadow: 0 5px 0 ${({ theme }): string => theme.shadows.faint};
`;

export const PiggyBankSpace = styled.div`
  width: 50%;
  margin: 0 auto 4px;
`;

export const Total = styled.div`
  margin: 2px 0 0;
  font-size: ${({ theme }): number => theme.typography.display}px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textStrong};
`;
