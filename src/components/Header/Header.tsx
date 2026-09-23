'use client';

import { Fragment, JSX } from 'react';
import { usePathname } from 'next/navigation';
import type { Account } from '@/lib/types';
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
  account?: Pick<Account, 'name' | 'avatarId'>;
}

export function Header({ title, account }: HeaderProps): JSX.Element {
  const menu = useMenuState();
  const isHome = usePathname() === HOME_ROUTE;

  const avatar = account && (
    <HeaderAvatar
      avatarId={account.avatarId}
      alt={account.name}
      size={HEADER_AVATAR_PROPS.size}
      testId={HEADER_TEST_IDS.avatar}
      isHidden={menu.isOpen}
    />
  );

  const homeLink = account && (
    <HomeAvatarLink
      avatarId={account.avatarId}
      name={account.name}
      isHidden={menu.isOpen}
    />
  );

  const endSlot = isHome ? avatar : homeLink;

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
