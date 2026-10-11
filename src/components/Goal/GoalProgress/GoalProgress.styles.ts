import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { GOAL_PROGRESS_SIZE, type GoalProgressSize } from './constants';

interface PictureStyle {
  progressSize: GoalProgressSize;
  glowing: boolean;
  theme: Theme;
}

interface GoalHeadingStyle {
  progressSize: GoalProgressSize;
  reached: boolean;
  theme: Theme;
}

const PICTURE_SIZE: Record<GoalProgressSize, { side: number; emoji: number; corner: number }> = {
  small: { side: 34, emoji: 20, corner: 10 },
  large: { side: 44, emoji: 26, corner: 14 },
};

const pictureGlow = ({ glowing, theme }: PictureStyle): string =>
  glowing ? `0 0 0 4px ${theme.colors.gainSoftBg}, 0 0 18px 4px ${theme.colors.gainText}` : 'none';

const headingSize = ({ progressSize, theme }: GoalHeadingStyle): number =>
  progressSize === GOAL_PROGRESS_SIZE.large ? theme.typography.body : theme.typography.label + 1;

export const Progress = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

export const Picture = styled.span<{ progressSize: GoalProgressSize; glowing: boolean }>`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: ${({ progressSize }): number => PICTURE_SIZE[progressSize].side}px;
  height: ${({ progressSize }): number => PICTURE_SIZE[progressSize].side}px;
  border-radius: ${({ progressSize }): number => PICTURE_SIZE[progressSize].corner}px;
  font-size: ${({ progressSize }): number => PICTURE_SIZE[progressSize].emoji}px;
  background: ${({ theme }): string => theme.gradients.walletSavings};
  box-shadow: ${pictureGlow};
`;

export const Body = styled.span`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const GoalHeading = styled.span<{ reached: boolean; progressSize: GoalProgressSize }>`
  display: flex;
  justify-content: space-between;
  font-size: ${headingSize}px;
  font-weight: 700;
  color: ${({ reached, theme }): string =>
    reached ? theme.colors.gainText : theme.colors.textStrong};
`;
