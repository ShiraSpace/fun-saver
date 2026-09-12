import styled from '@emotion/styled';

export const AmountValue = styled.div<{ donation: boolean }>`
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.amount}px;
  font-weight: 700;
  color: ${({ theme, donation }): string =>
    donation ? theme.colors.gainText : theme.colors.withdrawText};
`;
