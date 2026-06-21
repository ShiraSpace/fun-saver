'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { Menu } from '../Menu';
import { Avatar } from '../Avatar';
import { TYPE_SCALE } from '@/theme/typography';
import { COLORS } from '@/theme/palette';
import {
  HEADER_AVATAR_PROPS,
  HEADER_LAYOUT,
  HEADER_TEST_IDS,
} from './constants';

const Bar = styled.header`
  display: flex;
  align-items: center;
  gap: ${HEADER_LAYOUT.gap}px;
  width: 100%;
  padding: ${HEADER_LAYOUT.paddingY}px ${HEADER_LAYOUT.paddingX}px;
  background: ${COLORS.surface};
  border-radius: ${HEADER_LAYOUT.radius}px;
  box-shadow: ${HEADER_LAYOUT.shadow};
  color: ${COLORS.ink};
`;

const Name = styled.span`
  flex: 1;
  text-align: center;
  font-size: ${TYPE_SCALE.h2}px;
  font-weight: ${HEADER_LAYOUT.nameWeight};
  color: ${COLORS.ink};
`;

export interface HeaderProps {
  name: string;
  avatarId: string;
}

export function Header({ name, avatarId }: HeaderProps): JSX.Element {
  return (
    <Bar data-testid={HEADER_TEST_IDS.bar}>
      <Menu />
      <Name data-testid={HEADER_TEST_IDS.name}>{name}</Name>
      <Avatar
        avatarId={avatarId}
        alt={name}
        size={HEADER_AVATAR_PROPS.size}
        testId={HEADER_TEST_IDS.avatar}
      />
    </Bar>
  );
}
