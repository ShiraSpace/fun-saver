import { fireEvent, render, screen } from '@/test-utils/render';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { HOME_ROUTE } from '@/components/Home/constants';
import { NavTabs } from './NavTabs';
import { MENU_SCREENS, NAV_TABS_TEST_IDS } from './constants';

const mockOnNavigate = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: (): string => '/method',
}));

describe('NavTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<NavTabs onNavigate={mockOnNavigate} />);
  });

  it('offers a tab for every screen the app has', () => {
    expect(screen.getByTestId(NAV_TABS_TEST_IDS.strip).children).toHaveLength(
      MENU_SCREENS.length
    );
  });

  it('marks the screen the reader is on, not the one the menu opened from', () => {
    expect(screen.getByTestId(NAV_TABS_TEST_IDS.methodTab)).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByTestId(NAV_TABS_TEST_IDS.homeTab)).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('sends the home tab to the home route', () => {
    expect(screen.getByTestId(NAV_TABS_TEST_IDS.homeTab)).toHaveAttribute(
      'href',
      HOME_ROUTE
    );
  });

  it('sends the method tab to the method route', () => {
    expect(screen.getByTestId(NAV_TABS_TEST_IDS.methodTab)).toHaveAttribute(
      'href',
      METHOD_ROUTE
    );
  });

  it('closes the menu on the way out, so returning does not land on an open one', () => {
    fireEvent.click(screen.getByTestId(NAV_TABS_TEST_IDS.homeTab));

    expect(mockOnNavigate).toHaveBeenCalled();
  });

  it('shows the screen that does not exist yet as a tab that cannot be taken', () => {
    expect(
      screen.getByTestId(NAV_TABS_TEST_IDS.transactionsTab)
    ).toBeDisabled();
  });
});
