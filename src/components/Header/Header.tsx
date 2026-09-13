'use client';

import { JSX, useState } from 'react';
import { Menu } from '../Menu';
import { MENU_OVERLAY_CONTENT } from '../Menu/MenuOverlay/constants';
import { Title } from './CrossfadeTitle';
import { HEADER_AVATAR_PROPS, HEADER_TEST_IDS } from './constants';
import { Bar, HeaderAvatar } from './Header.styles';

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
