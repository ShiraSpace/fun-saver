import { render, screen } from '@/test-utils/render';
import { ScreenTitle } from './ScreenTitle';
import { SCREEN_TITLE_TEST_IDS } from './constants';

describe('ScreenTitle', () => {
  describe('without an icon', () => {
    const mockTitle = 'עריכת חשבון';

    beforeEach(() => {
      render(<ScreenTitle title={mockTitle} />);
    });

    it('shows the title', () => {
      expect(screen.getByTestId(SCREEN_TITLE_TEST_IDS.title)).toHaveTextContent(
        mockTitle
      );
    });

    it('leaves out the icon', () => {
      expect(
        screen.queryByTestId(SCREEN_TITLE_TEST_IDS.icon)
      ).not.toBeInTheDocument();
    });
  });
});
