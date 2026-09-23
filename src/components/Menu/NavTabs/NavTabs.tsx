'use client';

import { JSX } from 'react';
import { usePathname } from 'next/navigation';
import { useOptionalAccounts } from '@/components/Home/accounts-context';
import {
  MENU_SCREENS,
  MenuScreen,
  NAV_TABS_CONTENT,
  NAV_TABS_TEST_IDS,
} from './constants';
import { NavTab } from './NavTab';
import { Strip } from './NavTabs.styles';

interface NavTabsProps {
  onNavigate: () => void;
}

const asReachable = (screen: MenuScreen, hasAccount: boolean): MenuScreen =>
  hasAccount ? screen : { ...screen, href: undefined };

export function NavTabs({ onNavigate }: NavTabsProps): JSX.Element {
  const currentPath = usePathname();
  const hasAccount = Boolean(useOptionalAccounts());

  const tabComponents = MENU_SCREENS.map((screen) => (
    <NavTab
      key={screen.id}
      screen={asReachable(screen, hasAccount)}
      isCurrent={screen.href === currentPath}
      onNavigate={onNavigate}
    />
  ));

  return (
    <Strip
      aria-label={NAV_TABS_CONTENT.stripLabel}
      data-testid={NAV_TABS_TEST_IDS.strip}
    >
      {tabComponents}
    </Strip>
  );
}
