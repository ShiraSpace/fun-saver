import { fireEvent, render, screen } from '@/test-utils/render';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { HOME_ROUTE } from '@/components/Home/constants';
import { NavTabs } from './NavTabs';
import { MENU_SCREENS, NAV_TABS_CONTENT, NAV_TABS_TEST_IDS } from './constants';

const mockOnNavigate = jest.fn();

function renderTabs(route: string): void {
  jest.clearAllMocks();
  render(<NavTabs onNavigate={mockOnNavigate} />, { route });
}

describe('NavTabs', () => {
  describe('on the home screen', () => {
    beforeEach(() => {
      renderTabs(HOME_ROUTE);
    });

    it('names the landmark, so it is not an unlabelled region in the dialog', () => {
      expect(
        screen.getByRole('navigation', { name: NAV_TABS_CONTENT.stripLabel })
      ).toBeInTheDocument();
    });

    it('offers a tab for every screen the app has', () => {
      expect(screen.getByTestId(NAV_TABS_TEST_IDS.strip).children).toHaveLength(
        MENU_SCREENS.length
      );
    });

    it('marks the screen the reader is on', () => {
      expect(screen.getByTestId(NAV_TABS_TEST_IDS.homeTab)).toHaveAttribute(
        'aria-current',
        'page'
      );
    });

    it('offers no way to travel to the screen already on display', () => {
      expect(screen.getByTestId(NAV_TABS_TEST_IDS.homeTab)).not.toHaveAttribute(
        'href'
      );
    });

    it('sends the other screen to its route', () => {
      const methodTab = screen.getByTestId(NAV_TABS_TEST_IDS.methodTab);

      expect(methodTab).toHaveAttribute('href', METHOD_ROUTE);
      expect(methodTab).not.toHaveAttribute('aria-current');
    });

    it('closes the menu on the way out, so returning does not land on an open one', () => {
      fireEvent.click(screen.getByTestId(NAV_TABS_TEST_IDS.methodTab));

      expect(mockOnNavigate).toHaveBeenCalled();
    });

    it('shows the screen that does not exist yet as a tab that cannot be taken', () => {
      expect(
        screen.getByTestId(NAV_TABS_TEST_IDS.transactionsTab)
      ).toBeDisabled();
    });
  });

  describe('on the method screen', () => {
    beforeEach(() => {
      renderTabs(METHOD_ROUTE);
    });

    it('moves the mark to the screen the reader travelled to', () => {
      expect(screen.getByTestId(NAV_TABS_TEST_IDS.methodTab)).toHaveAttribute(
        'aria-current',
        'page'
      );
    });

    it('stops offering the method route once the reader is on it', () => {
      expect(
        screen.getByTestId(NAV_TABS_TEST_IDS.methodTab)
      ).not.toHaveAttribute('href');
    });

    it('offers the way back home', () => {
      expect(screen.getByTestId(NAV_TABS_TEST_IDS.homeTab)).toHaveAttribute(
        'href',
        HOME_ROUTE
      );
    });
  });
});
