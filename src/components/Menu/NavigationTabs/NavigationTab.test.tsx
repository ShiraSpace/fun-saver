import { render, screen } from '@/test-utils/render';
import { NAVIGATION_DESTINATIONS, NAVIGATION_TABS_TEST_IDS } from './constants';
import { NavigationTab } from './NavigationTab';

const unreachableScreen = NAVIGATION_DESTINATIONS.find(
  (screen) => !screen.href
)!;

describe('NavigationTab', () => {
  describe('for a screen that does not exist yet', () => {
    beforeEach(() => {
      render(
        <NavigationTab
          destination={unreachableScreen}
          isCurrent={false}
          onNavigate={jest.fn()}
        />
      );
    });

    it('dims the icon, so the tab reads as one that cannot be taken', () => {
      const icon = screen.getByTestId(
        NAVIGATION_TABS_TEST_IDS.transactionsTab
      ).firstElementChild;

      expect(icon).toHaveStyle('opacity: 0.45');
    });
  });
});
