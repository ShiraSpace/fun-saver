'use client';

import { JSX, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Account } from '@/lib/types';
import {
  MenuHeaderBackdrop,
  MenuOverlay,
  MenuProvider,
  MenuToggle,
  useMenuState,
} from '../Menu';
import { MENU_HEADER_BACKDROP_TEST_IDS } from '../Menu/MenuHeaderBackdrop/constants';
import { HOME_ROUTE } from '../Home/constants';
import { HeaderTitle } from './HeaderTitle';
import { HeaderAccountAvatar } from './HeaderAccountAvatar';
import { HEADER_TEST_IDS } from './constants';
import { Bar } from './Header.styles';
import { NavigationProgress } from './NavigationProgress';
import { PendingNavigationsProvider } from './navigation-pending-context';

export interface HeaderProps {
  title: string;
  account?: Pick<Account, 'name' | 'avatarId'>;
}

export function Header({ title, account }: HeaderProps): JSX.Element {
  const menu = useMenuState();
  const isHome = usePathname() === HOME_ROUTE;
  const [pendingNavigationCount, setPendingNavigationCount] = useState(0);
  const isNavigating = pendingNavigationCount > 0;

  return (
    <PendingNavigationsProvider value={setPendingNavigationCount}>
      <MenuHeaderBackdrop
        data-open={menu.isOpen}
        data-testid={MENU_HEADER_BACKDROP_TEST_IDS.backdrop}
      />
      <Bar data-testid={HEADER_TEST_IDS.bar}>
        <MenuToggle isOpen={menu.isOpen} onToggle={menu.toggle} />
        <HeaderTitle text={title} />
        {account && (
          <HeaderAccountAvatar
            account={account}
            isHome={isHome}
            isHidden={menu.isOpen}
          />
        )}
        {isNavigating && (
          <NavigationProgress data-testid={HEADER_TEST_IDS.progress} />
        )}
      </Bar>
      <MenuProvider value={menu}>
        <MenuOverlay />
      </MenuProvider>
    </PendingNavigationsProvider>
  );
}
