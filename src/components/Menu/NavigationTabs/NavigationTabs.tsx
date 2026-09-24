'use client';

import { JSX } from 'react';
import { usePathname } from 'next/navigation';
import { useOptionalAccounts } from '@/components/Home/accounts-context';
import {
  NAVIGATION_DESTINATIONS,
  NavigationDestination,
  NAVIGATION_TABS_COPY,
  NAVIGATION_TABS_TEST_IDS,
} from './constants';
import { NavigationTab } from './NavigationTab';
import { TabBar } from './NavigationTabs.styles';

interface NavigationTabsProps {
  onNavigate: () => void;
}

const asReachable = (
  destination: NavigationDestination,
  hasAccount: boolean
): NavigationDestination =>
  hasAccount ? destination : { ...destination, href: undefined };

export function NavigationTabs({
  onNavigate,
}: NavigationTabsProps): JSX.Element {
  const currentPath = usePathname();
  const hasAccount = Boolean(useOptionalAccounts());

  const tabs = NAVIGATION_DESTINATIONS.map((destination) => (
    <NavigationTab
      key={destination.id}
      destination={asReachable(destination, hasAccount)}
      isCurrent={destination.href === currentPath}
      onNavigate={onNavigate}
    />
  ));

  return (
    <TabBar
      aria-label={NAVIGATION_TABS_COPY.tabBarLabel}
      data-testid={NAVIGATION_TABS_TEST_IDS.tabBar}
    >
      {tabs}
    </TabBar>
  );
}
