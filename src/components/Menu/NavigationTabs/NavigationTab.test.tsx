import { render, screen } from '@/test-utils/render';
import { NAVIGATION_TABS_TEST_IDS } from './constants';
import { NavigationTab } from './NavigationTab';

describe('NavigationTab', () => {
  describe('for a screen the parent cannot open yet', () => {
    beforeEach(() => {
      const mockUnreachableDestination = {
        id: 'transactions',
        icon: '📈',
        label: 'תנועות',
        testId: NAVIGATION_TABS_TEST_IDS.transactionsTab,
      };

      render(
        <NavigationTab
          destination={mockUnreachableDestination}
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
