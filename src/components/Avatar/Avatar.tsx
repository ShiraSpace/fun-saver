'use client';

import { JSX } from 'react';
import { avatarSource } from '@/lib/avatars';
import { Circle } from './Avatar.styles';

interface AvatarBaseProps {
  avatarId: string;
  alt: string;
  testId?: string;
}

interface FixedAvatarProps extends AvatarBaseProps {
  size: number;
  fill?: false;
  sizes?: never;
}

interface FillAvatarProps extends AvatarBaseProps {
  fill: true;
  sizes: string;
  size?: never;
}

export type AvatarProps = FixedAvatarProps | FillAvatarProps;

export function Avatar(props: AvatarProps): JSX.Element {
  const { avatarId, alt, testId } = props;
  const src = avatarSource(avatarId);

  if (props.fill) {
    return (
      <Circle
        src={src}
        alt={alt}
        fill
        sizes={props.sizes}
        unoptimized
        data-testid={testId}
      />
    );
  }

  return (
    <Circle
      src={src}
      alt={alt}
      width={props.size}
      height={props.size}
      unoptimized
      data-testid={testId}
    />
  );
}
