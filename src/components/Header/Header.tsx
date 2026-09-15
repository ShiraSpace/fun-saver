'use client';

import { JSX, useState } from 'react';
import { Menu } from '../Menu';
import { Title } from './CrossfadeTitle';
import { HEADER_AVATAR_PROPS, HEADER_TEST_IDS } from './constants';
import { Bar, HeaderAvatar } from './Header.styles';

export interface HeaderProps {
  title: string;
  avatarId?: string;
}

export function Header({ title, avatarId }: HeaderProps): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const avatar = avatarId && (
    <HeaderAvatar
      avatarId={avatarId}
      alt={title}
      size={HEADER_AVATAR_PROPS.size}
      testId={HEADER_TEST_IDS.avatar}
    />
  );

  return (
    <Bar data-testid={HEADER_TEST_IDS.bar}>
      <Menu isOpen={isMenuOpen} onToggle={setIsMenuOpen} />
      <Title text={title} />
      {avatar}
    </Bar>
  );
}
