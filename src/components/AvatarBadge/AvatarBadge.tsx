'use client';

import { JSX } from 'react';
import { Avatar } from '../Avatar';
import { Badge } from './AvatarBadge.styles';

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
