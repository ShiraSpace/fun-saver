'use client';

import { Fragment, JSX } from 'react';
import { usePathname } from 'next/navigation';
import type { Account } from '@/lib/types';
import {
  MenuHeaderSheet,
  MenuOverlay,
  MenuProvider,
  MenuToggle,
  useMenuState,
} from '../Menu';
import { MENU_HEADER_SHEET_TEST_IDS } from '../Menu/MenuHeaderSheet/constants';
import { HOME_ROUTE } from '../Home/constants';
import { Title } from './CrossfadeTitle';
import { HeaderEndSlot } from './HeaderEndSlot';
import { HEADER_TEST_IDS } from './constants';
import { Bar } from './Header.styles';

export interface HeaderProps {
  title: string;
  account?: Pick<Account, 'name' | 'avatarId'>;
}

export function Header({ title, account }: HeaderProps): JSX.Element {
  const menu = useMenuState();
  const isHome = usePathname() === HOME_ROUTE;

  return (
    <Fragment>
      <MenuHeaderSheet
        data-open={menu.isOpen}
        data-testid={MENU_HEADER_SHEET_TEST_IDS.sheet}
      />
      <Bar data-testid={HEADER_TEST_IDS.bar}>
        <MenuToggle isOpen={menu.isOpen} onToggle={menu.toggle} />
        <Title text={title} />
        {account && (
          <HeaderEndSlot
            account={account}
            isHome={isHome}
            isHidden={menu.isOpen}
          />
        )}
      </Bar>
      <MenuProvider value={menu}>
        <MenuOverlay />
      </MenuProvider>
    </Fragment>
  );
}
