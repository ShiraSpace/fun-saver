'use client';

import { JSX, useState } from 'react';
import styled from '@emotion/styled';
import { Menu } from '../Menu';
import { MENU_OVERLAY_CONTENT } from '../Menu/MenuOverlay/constants';
import { AvatarBadge } from '../AvatarBadge';
import { Title } from './CrossfadeTitle';
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
  transition:
    background ${HEADER_LAYOUT.transitionMs}ms ease,
    box-shadow ${HEADER_LAYOUT.transitionMs}ms ease;

  &[data-open='true'] {
    background: transparent;
    box-shadow: none;
    color: ${COLORS.textOnPrimary};
  }
`;

const HeaderAvatar = styled(AvatarBadge)`
  z-index: ${HEADER_LAYOUT.foregroundZIndex};
`;

export interface HeaderProps {
  name: string;
  avatarId: string;
}

export function Header({ name, avatarId }: HeaderProps): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const title = isMenuOpen ? MENU_OVERLAY_CONTENT.title : name;

  return (
    <Bar data-testid={HEADER_TEST_IDS.bar} data-open={isMenuOpen}>
      <Menu isOpen={isMenuOpen} onToggle={setIsMenuOpen} />
      <Title text={title} />
      <HeaderAvatar
        avatarId={avatarId}
        alt={name}
        size={HEADER_AVATAR_PROPS.size}
        testId={HEADER_TEST_IDS.avatar}
      />
    </Bar>
  );
}
