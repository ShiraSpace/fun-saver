import { HOME_ROUTE } from '@/components/Home/constants';
import { METHOD_ROUTE } from '@/components/Method/constants';

export const NAV_TABS_TEST_IDS = {
  strip: 'menu-nav-tabs',
  homeTab: 'menu-nav-tab-home',
  transactionsTab: 'menu-nav-tab-transactions',
  methodTab: 'menu-nav-tab-method',
} as const;

export interface MenuScreen {
  id: string;
  icon: string;
  label: string;
  testId: string;
  href?: string;
}

export const MENU_SCREENS: MenuScreen[] = [
  {
    id: 'home',
    icon: '🏠',
    label: 'בית',
    testId: NAV_TABS_TEST_IDS.homeTab,
    href: HOME_ROUTE,
  },
  {
    id: 'transactions',
    icon: '📈',
    label: 'תנועות',
    testId: NAV_TABS_TEST_IDS.transactionsTab,
  },
  {
    id: 'method',
    icon: '📖',
    label: 'השיטה',
    testId: NAV_TABS_TEST_IDS.methodTab,
    href: METHOD_ROUTE,
  },
];

export const TABS_PER_ROW = 4;
