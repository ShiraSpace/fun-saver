import { render, screen } from '@/test-utils/render';
import { MENU_SCREENS, NAV_TABS_TEST_IDS } from './constants';
import { NavTab } from './NavTab';

const unreachableScreen = MENU_SCREENS.find((screen) => !screen.href)!;

describe('NavTab', () => {
  describe('for a screen that does not exist yet', () => {
    beforeEach(() => {
      render(
        <NavTab
          screen={unreachableScreen}
          isCurrent={false}
          onNavigate={jest.fn()}
        />
      );
    });

    it('dims the icon, so the tab reads as one that cannot be taken', () => {
      const icon = screen.getByTestId(
        NAV_TABS_TEST_IDS.transactionsTab
      ).firstElementChild;

      expect(icon).toHaveStyle('opacity: 0.45');
    });
  });
});
