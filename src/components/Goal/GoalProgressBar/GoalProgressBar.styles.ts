import styled from '@emotion/styled';

export const Track = styled.span<{ thin: boolean }>`
  display: block;
  height: ${({ thin }): number => (thin ? 8 : 14)}px;
  border-radius: 999px;
  overflow: hidden;
  background: ${({ theme }): string => theme.colors.walletTrack};
`;

export const Fill = styled.span<{ reached: boolean }>`
  display: block;
  height: 100%;
  border-radius: 999px;
  background: ${({ reached, theme }): string =>
    reached ? theme.colors.gainText : theme.gradients.walletSavings};
`;
