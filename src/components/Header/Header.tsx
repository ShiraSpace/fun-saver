'use client';

import { Fragment, JSX } from 'react';
import { usePathname } from 'next/navigation';
import {
  MenuHeaderSheet,
  MenuOverlay,
  MenuToggle,
  useMenuState,
} from '../Menu';
import { MENU_HEADER_SHEET_TEST_IDS } from '../Menu/MenuHeaderSheet/constants';
import { HOME_ROUTE } from '../Home/constants';
import { Title } from './CrossfadeTitle';
import { HomeAvatarLink } from './HomeAvatarLink';
import { HEADER_AVATAR_PROPS, HEADER_TEST_IDS } from './constants';
import { Bar } from './Header.styles';
import { HeaderAvatar } from './header-parts';

export interface HeaderProps {
  title: string;
  avatarId?: string;
}

export function Header({ title, avatarId }: HeaderProps): JSX.Element {
  const menu = useMenuState();
  const isHome = usePathname() === HOME_ROUTE;

  const avatar = avatarId && (
    <HeaderAvatar
      avatarId={avatarId}
      alt={title}
      size={HEADER_AVATAR_PROPS.size}
      testId={HEADER_TEST_IDS.avatar}
      isHidden={menu.isOpen}
    />
  );
  const endSlot = isHome ? avatar : <HomeAvatarLink isHidden={menu.isOpen} />;

  return (
    <Fragment>
      <MenuHeaderSheet
        data-open={menu.isOpen}
        data-testid={MENU_HEADER_SHEET_TEST_IDS.sheet}
      />
      <Bar data-testid={HEADER_TEST_IDS.bar}>
        <MenuToggle isOpen={menu.isOpen} onToggle={menu.toggle} />
        <Title text={title} />
        {endSlot}
      </Bar>
      <MenuOverlay
        isOpen={menu.isOpen}
        onClose={menu.close}
        isAccountListOpen={menu.isAccountListOpen}
        onAccountListToggle={menu.setAccountListOpen}
      />
    </Fragment>
  );
}
