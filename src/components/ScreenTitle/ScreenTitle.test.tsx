import { render, screen } from '@/test-utils/render';
import { ScreenTitle } from './ScreenTitle';
import { SCREEN_TITLE_TEST_IDS } from './constants';

describe('ScreenTitle', () => {
  const mockTitle = 'עריכת חשבון';

  describe('without an icon', () => {
    beforeEach(() => {
      render(<ScreenTitle title={mockTitle} />);
    });

    it('shows the title', () => {
      expect(screen.getByTestId(SCREEN_TITLE_TEST_IDS.title)).toHaveTextContent(mockTitle);
    });

    it('leaves out the icon', () => {
      expect(screen.queryByTestId(SCREEN_TITLE_TEST_IDS.icon)).not.toBeInTheDocument();
    });
  });

  describe('with an icon', () => {
    const mockTitleIcon = '🎯';

    beforeEach(() => {
      render(<ScreenTitle title={mockTitle} titleIcon={mockTitleIcon} />);
    });

    it('shows the icon', () => {
      expect(screen.getByTestId(SCREEN_TITLE_TEST_IDS.icon)).toHaveTextContent(mockTitleIcon);
    });
  });
});
