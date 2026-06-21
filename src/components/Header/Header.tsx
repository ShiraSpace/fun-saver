'use client';

import { JSX } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { Menu } from '../Menu';
import { TYPE_SCALE } from '@/theme/typography';
import { avatarSource } from '@/lib/avatars';
import {
  HEADER_AVATAR_PROPS,
  HEADER_LAYOUT,
  HEADER_TEST_IDS,
} from './constants';

const Bar = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${HEADER_LAYOUT.paddingY}px ${HEADER_LAYOUT.paddingX}px;
`;

const Name = styled.span`
  flex: 1;
  text-align: center;
  font-size: ${TYPE_SCALE.h2}px;
`;

export interface HeaderProps {
  name: string;
  avatarId: string;
}

interface AvatarProps {
  avatarId: string;
  alt: string;
}

function Avatar({ avatarId, alt }: AvatarProps): JSX.Element {
  return (
    <Image
      data-testid={HEADER_TEST_IDS.avatar}
      src={avatarSource(avatarId)}
      alt={alt}
      width={HEADER_AVATAR_PROPS.size}
      height={HEADER_AVATAR_PROPS.size}
      unoptimized
    />
  );
}

export function Header({ name, avatarId }: HeaderProps): JSX.Element {
  return (
    <Bar data-testid={HEADER_TEST_IDS.bar}>
      <Menu />
      <Name data-testid={HEADER_TEST_IDS.name}>{name}</Name>
      <Avatar avatarId={avatarId} alt={name} />
    </Bar>
  );
}
