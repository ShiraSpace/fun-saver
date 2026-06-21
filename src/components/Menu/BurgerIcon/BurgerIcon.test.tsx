import { render, screen } from '@/test-support/render';
import { BurgerIcon } from './BurgerIcon';
import { BURGER_ICON_TEST_IDS } from './constants';

describe('BurgerIcon', () => {
  it('marks the icon closed when isOpen is false', () => {
    render(<BurgerIcon isOpen={false} testId={BURGER_ICON_TEST_IDS.icon} />);

    expect(screen.getByTestId(BURGER_ICON_TEST_IDS.icon)).toHaveAttribute(
      'data-open',
      'false'
    );
  });

  it('marks the icon open to drive the cross morph when isOpen is true', () => {
    render(<BurgerIcon isOpen testId={BURGER_ICON_TEST_IDS.icon} />);

    expect(screen.getByTestId(BURGER_ICON_TEST_IDS.icon)).toHaveAttribute(
      'data-open',
      'true'
    );
  });
});
