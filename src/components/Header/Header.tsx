'use client';

import { JSX, useState } from 'react';
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
import { HeaderEndSlot } from './HeaderEndSlot';
import { HEADER_TEST_IDS } from './constants';
import { Bar } from './Header.styles';
import { ProgressLine } from './ProgressLine';
import { PendingLinksProvider } from './navigation-pending-context';

export interface HeaderProps {
  title: string;
  account?: Pick<Account, 'name' | 'avatarId'>;
}

export function Header({ title, account }: HeaderProps): JSX.Element {
  const menu = useMenuState();
  const isHome = usePathname() === HOME_ROUTE;
  const [pendingLinks, setPendingLinks] = useState(0);
  const isNavigating = pendingLinks > 0;

  return (
    <PendingLinksProvider value={setPendingLinks}>
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
        {isNavigating && (
          <ProgressLine data-testid={HEADER_TEST_IDS.progress} />
        )}
      </Bar>
      <MenuOverlay
        isOpen={menu.isOpen}
        onClose={menu.close}
        isAccountListOpen={menu.isAccountListOpen}
        onAccountListToggle={menu.setAccountListOpen}
      />
    </PendingLinksProvider>
  );
}
