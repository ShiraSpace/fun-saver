import styled from '@emotion/styled';

export const Block = styled.div`
  text-align: center;
`;

export const Value = styled.div`
  font-size: ${({ theme }): number => theme.typography.amount}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.gainText};
`;
