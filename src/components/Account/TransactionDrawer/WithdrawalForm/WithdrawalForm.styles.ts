import styled from '@emotion/styled';

export const AmountValue = styled.div<{ isDonation: boolean }>`
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.amount}px;
  font-weight: 700;
  color: ${({ theme, isDonation }): string =>
    isDonation ? theme.colors.gainText : theme.colors.withdrawalText};
`;
