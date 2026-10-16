import styled from '@emotion/styled';
import type { SerializedStyles } from '@emotion/react';
import { shine } from '../Celebration/celebration-parts';

export const Track = styled.span<{ thin: boolean; celebrating: boolean }>`
  display: block;
  height: ${({ thin }): number => (thin ? 8 : 14)}px;
  border-radius: 999px;
  overflow: hidden;
  background: ${({ theme }): string => theme.colors.walletTrack};
  ${({ celebrating, theme }): SerializedStyles | false => celebrating && shine(theme)}
`;

export const Fill = styled.span<{ isGoalReached: boolean }>`
  display: block;
  height: 100%;
  border-radius: 999px;
  background: ${({ isGoalReached, theme }): string =>
    isGoalReached ? theme.colors.gainText : theme.gradients.walletSavings};
`;
