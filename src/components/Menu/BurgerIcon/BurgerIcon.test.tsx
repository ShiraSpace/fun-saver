import { render, screen } from '@/test-support/render';
import { BurgerIcon } from './BurgerIcon';
import { BURGER_ICON_TEST_IDS } from './constants';

describe('BurgerIcon', () => {
  describe('when closed', () => {
    beforeEach(() => {
      render(<BurgerIcon isOpen={false} testId={BURGER_ICON_TEST_IDS.icon} />);
    });

    it('marks the icon closed', () => {
      expect(screen.getByTestId(BURGER_ICON_TEST_IDS.icon)).toHaveAttribute(
        'data-open',
        'false'
      );
    });
  });

  describe('when open', () => {
    beforeEach(() => {
      render(<BurgerIcon isOpen testId={BURGER_ICON_TEST_IDS.icon} />);
    });

    it('marks the icon open to drive the cross morph', () => {
      expect(screen.getByTestId(BURGER_ICON_TEST_IDS.icon)).toHaveAttribute(
        'data-open',
        'true'
      );
    });
  });
});
