import { fireEvent, render, screen } from '@/test-utils/render';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { HOME_ROUTE } from '@/components/Home/constants';
import { TRANSACTIONS_ROUTE } from '@/components/Transactions/constants';
import { mockAccountsContext } from '@/test-utils/mocks/account.mocks';
import { NavigationTabs } from './NavigationTabs';
import {
  NAVIGATION_DESTINATIONS,
  NAVIGATION_TABS_COPY,
  NAVIGATION_TABS_TEST_IDS,
} from './constants';

const mockOnNavigate = jest.fn();

function renderTabsWithoutAccount(route: string): void {
  jest.clearAllMocks();
  render(<NavigationTabs onNavigate={mockOnNavigate} />, { route });
}

function renderTabs(route: string): void {
  jest.clearAllMocks();
  render(<NavigationTabs onNavigate={mockOnNavigate} />, {
    route,
    accounts: mockAccountsContext,
  });
}

describe('NavigationTabs', () => {
  describe('on the home screen', () => {
    beforeEach(() => {
      renderTabs(HOME_ROUTE);
    });

    it('names the landmark, so it is not an unlabelled region in the dialog', () => {
      expect(
        screen.getByRole('navigation', {
          name: NAVIGATION_TABS_COPY.tabBarLabel,
        })
      ).toBeInTheDocument();
    });

    it('offers a tab for every screen the app has', () => {
      expect(
        screen.getByTestId(NAVIGATION_TABS_TEST_IDS.tabBar).children
      ).toHaveLength(NAVIGATION_DESTINATIONS.length);
    });

    it('marks the screen the reader is on', () => {
      expect(
        screen.getByTestId(NAVIGATION_TABS_TEST_IDS.homeTab)
      ).toHaveAttribute('aria-current', 'page');
    });

    it('offers no way to travel to the screen already on display', () => {
      expect(
        screen.getByTestId(NAVIGATION_TABS_TEST_IDS.homeTab)
      ).not.toHaveAttribute('href');
    });

    it('sends the method tab to its route', () => {
      const methodTab = screen.getByTestId(NAVIGATION_TABS_TEST_IDS.methodTab);

      expect(methodTab).toHaveAttribute('href', METHOD_ROUTE);
      expect(methodTab).not.toHaveAttribute('aria-current');
    });

    it('closes the menu on the way out, so returning does not land on an open one', () => {
      fireEvent.click(screen.getByTestId(NAVIGATION_TABS_TEST_IDS.methodTab));

      expect(mockOnNavigate).toHaveBeenCalled();
    });

    it('links the transactions tab to its screen', () => {
      expect(
        screen.getByTestId(NAVIGATION_TABS_TEST_IDS.transactionsTab)
      ).toHaveAttribute('href', TRANSACTIONS_ROUTE);
    });
  });

  describe('on the method screen', () => {
    beforeEach(() => {
      renderTabs(METHOD_ROUTE);
    });

    it('moves the mark to the screen the reader travelled to', () => {
      expect(
        screen.getByTestId(NAVIGATION_TABS_TEST_IDS.methodTab)
      ).toHaveAttribute('aria-current', 'page');
    });

    it('stops offering the method route once the reader is on it', () => {
      expect(
        screen.getByTestId(NAVIGATION_TABS_TEST_IDS.methodTab)
      ).not.toHaveAttribute('href');
    });

    it('offers the way back home', () => {
      expect(
        screen.getByTestId(NAVIGATION_TABS_TEST_IDS.homeTab)
      ).toHaveAttribute('href', HOME_ROUTE);
    });
  });

  describe('for a parent who has no account yet', () => {
    beforeEach(() => {
      renderTabsWithoutAccount(HOME_ROUTE);
    });

    it('cannot send them to the method, which needs an account to open', () => {
      expect(
        screen.getByTestId(NAVIGATION_TABS_TEST_IDS.methodTab)
      ).toBeDisabled();
    });

    it('cannot send them to the transactions, which needs an account to open', () => {
      expect(
        screen.getByTestId(NAVIGATION_TABS_TEST_IDS.transactionsTab)
      ).toBeDisabled();
    });
  });
});
