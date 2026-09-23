'use client';

import { JSX } from 'react';
import { usePathname } from 'next/navigation';
import { MENU_SCREENS, MenuScreen, NAV_TABS_TEST_IDS } from './constants';
import { tabColumns } from './tab-columns';
import { InertTab, Strip, Tab, TabIcon } from './NavTabs.styles';

interface NavTabsProps {
  onNavigate: () => void;
}

export function NavTabs({ onNavigate }: NavTabsProps): JSX.Element {
  const currentPath = usePathname();

  const tabComponents = MENU_SCREENS.map((screen: MenuScreen) => {
    const face = (
      <>
        <TabIcon aria-hidden>{screen.icon}</TabIcon>
        {screen.label}
      </>
    );

    return screen.href ? (
      <Tab
        key={screen.id}
        href={screen.href}
        data-testid={screen.testId}
        aria-current={screen.href === currentPath ? 'page' : undefined}
        onClick={onNavigate}
      >
        {face}
      </Tab>
    ) : (
      <InertTab
        key={screen.id}
        type="button"
        data-testid={screen.testId}
        disabled
      >
        {face}
      </InertTab>
    );
  });

  return (
    <Strip
      data-testid={NAV_TABS_TEST_IDS.strip}
      columnCount={tabColumns(MENU_SCREENS.length)}
    >
      {tabComponents}
    </Strip>
  );
}
