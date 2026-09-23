'use client';

import { JSX } from 'react';
import { usePathname } from 'next/navigation';
import { MENU_SCREENS, NAV_TABS_CONTENT, NAV_TABS_TEST_IDS } from './constants';
import { NavTab } from './NavTab';
import { Strip } from './NavTabs.styles';

interface NavTabsProps {
  onNavigate: () => void;
}

export function NavTabs({ onNavigate }: NavTabsProps): JSX.Element {
  const currentPath = usePathname();

  const tabComponents = MENU_SCREENS.map((screen) => (
    <NavTab
      key={screen.id}
      screen={screen}
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
