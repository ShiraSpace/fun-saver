import styled from '@emotion/styled';
import type { SerializedStyles, Theme } from '@emotion/react';
import type { ThemeTypography } from '@/theme/typography';
import { wobble } from '../Celebration/celebration-parts';
import type { GoalProgressSize } from './constants';

interface PictureProps {
  progressSize: GoalProgressSize;
  glowing: boolean;
  isGoalReached: boolean;
  celebrating: boolean;
}

interface GoalHeadingProps {
  progressSize: GoalProgressSize;
  isGoalReached: boolean;
}

interface SizeStyle {
  pictureSide: number;
  pictureCorner: number;
  emoji: number;
  heading: (typography: ThemeTypography) => number;
  thinBar: boolean;
}

const SIZE_STYLE: Record<GoalProgressSize, SizeStyle> = {
  small: {
    pictureSide: 34,
    pictureCorner: 10,
    emoji: 20,
    heading: (typography) => typography.label + 1,
    thinBar: true,
  },
  large: {
    pictureSide: 44,
    pictureCorner: 14,
    emoji: 26,
    heading: (typography) => typography.body,
    thinBar: false,
  },
};

export const barIsThin = (size: GoalProgressSize): boolean => SIZE_STYLE[size].thinBar;

function pictureRing({ glowing, isGoalReached, theme }: PictureProps & { theme: Theme }): string {
  if (glowing) {
    return `0 0 0 4px ${theme.colors.gainSoftBg}, 0 0 18px 4px ${theme.colors.gainText}`;
  }

  return isGoalReached ? `0 0 0 2px ${theme.colors.celebrationOutline}` : 'none';
}

const headingSize = ({ progressSize, theme }: GoalHeadingProps & { theme: Theme }): number =>
  SIZE_STYLE[progressSize].heading(theme.typography);

export const Progress = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

export const Picture = styled.span<PictureProps>`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: ${({ progressSize }): number => SIZE_STYLE[progressSize].pictureSide}px;
  height: ${({ progressSize }): number => SIZE_STYLE[progressSize].pictureSide}px;
  border-radius: ${({ progressSize }): number => SIZE_STYLE[progressSize].pictureCorner}px;
  font-size: ${({ progressSize }): number => SIZE_STYLE[progressSize].emoji}px;
  background: ${({ theme }): string => theme.gradients.walletSavings};
  box-shadow: ${pictureRing};
  ${({ celebrating }): SerializedStyles | false => celebrating && wobble(400)}
`;

export const Body = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const GoalHeading = styled.span<GoalHeadingProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: ${headingSize}px;
  font-weight: 700;
  color: ${({ isGoalReached, theme }): string =>
    isGoalReached ? theme.colors.gainText : theme.colors.textStrong};
`;

export const GoalHeadingText = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
`;
