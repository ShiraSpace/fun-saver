import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { AVATAR_BADGE_DEFAULTS } from './constants';

interface BadgeStyle {
  size: number;
  background?: string;
}

const badgeSize = ({ size }: BadgeStyle): number => size;

const badgeBackground = ({
  theme,
  background,
}: BadgeStyle & { theme: Theme }): string =>
  background ?? theme.gradients.sunnyTile;

export const Badge = styled.span<BadgeStyle>`
  position: relative;
  display: inline-flex;
  width: ${badgeSize}px;
  height: ${badgeSize}px;
  border: ${AVATAR_BADGE_DEFAULTS.borderWidth}px solid
    ${({ theme }): string => theme.colors.surface};
  border-radius: 50%;
  overflow: hidden;
  background: ${badgeBackground};
`;
