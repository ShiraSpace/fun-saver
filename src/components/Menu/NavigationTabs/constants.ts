import { HOME_ROUTE } from '@/components/Home/constants';
import { METHOD_ROUTE } from '@/components/Method/constants';

export const NAVIGATION_TABS_TEST_IDS = {
  tabBar: 'menu-nav-tabs',
  homeTab: 'menu-nav-tab-home',
  transactionsTab: 'menu-nav-tab-transactions',
  methodTab: 'menu-nav-tab-method',
} as const;

export const NAVIGATION_TABS_COPY = {
  tabBarLabel: 'מסכים',
} as const;

export interface NavigationDestination {
  id: string;
  icon: string;
  label: string;
  testId: string;
  href?: string;
}

export const NAVIGATION_DESTINATIONS: readonly NavigationDestination[] = [
  {
    id: 'home',
    icon: '🏠',
    label: 'בית',
    testId: NAVIGATION_TABS_TEST_IDS.homeTab,
    href: HOME_ROUTE,
  },
  {
    id: 'transactions',
    icon: '📈',
    label: 'תנועות',
    testId: NAVIGATION_TABS_TEST_IDS.transactionsTab,
  },
  {
    id: 'method',
    icon: '📖',
    label: 'השיטה',
    testId: NAVIGATION_TABS_TEST_IDS.methodTab,
    href: METHOD_ROUTE,
  },
];
