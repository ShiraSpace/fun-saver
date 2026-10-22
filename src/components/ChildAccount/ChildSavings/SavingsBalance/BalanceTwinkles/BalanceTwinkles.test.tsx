import { render, screen } from '@/test-utils/render';
import { waitsForTheCelebration } from '@/test-utils/motion';
import { BalanceTwinkles } from './BalanceTwinkles';
import { BALANCE_TWINKLES_TEST_IDS, TWINKLE_PLACES } from './constants';

describe('BalanceTwinkles', () => {
  beforeEach(() => {
    render(<BalanceTwinkles />);
  });

  it('twinkles at every place round the total', () => {
    expect(screen.getAllByTestId(BALANCE_TWINKLES_TEST_IDS.twinkle)).toHaveLength(
      TWINKLE_PLACES.length
    );
  });

  it('holds every twinkle until the celebration has waited', () => {
    expect(
      screen.getAllByTestId(BALANCE_TWINKLES_TEST_IDS.twinkle).every(waitsForTheCelebration)
    ).toBe(true);
  });

  it('hides the twinkles from screen readers', () => {
    expect(screen.getByTestId(BALANCE_TWINKLES_TEST_IDS.twinkles)).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
