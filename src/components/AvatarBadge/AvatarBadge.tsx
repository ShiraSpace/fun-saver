'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { Avatar } from '../Avatar';
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

const Badge = styled.span<BadgeStyle>`
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

export interface AvatarBadgeProps {
  avatarId: string;
  alt: string;
  size: number;
  background?: string;
  testId?: string;
  className?: string;
}

export function AvatarBadge({
  avatarId,
  alt,
  size,
  background,
  testId,
  className,
}: AvatarBadgeProps): JSX.Element {
  return (
    <Badge className={className} size={size} background={background}>
      <Avatar avatarId={avatarId} alt={alt} size={size} testId={testId} />
    </Badge>
  );
}
