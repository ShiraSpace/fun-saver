import { render, screen } from '@/test-utils/render';
import { moves, waitsForTheCelebration } from '@/test-utils/motion';
import { PiggyBank } from './PiggyBank';
import { PIGGY_BANK_TEST_IDS } from './constants';

describe('PiggyBank', () => {
  describe('half full, its goal not yet reached', () => {
    beforeEach(() => {
      render(<PiggyBank piggyBankFill={0.5} />);
    });

    it('hides the drawing from screen readers', () => {
      expect(screen.getByTestId(PIGGY_BANK_TEST_IDS.art)).toHaveAttribute('aria-hidden', 'true');
    });

    it('stands still', () => {
      expect(moves(screen.getByTestId(PIGGY_BANK_TEST_IDS.body))).toBe(false);
    });
  });

  it('hops for a reached goal', () => {
    render(<PiggyBank piggyBankFill={1} isGoalReached />);

    expect(moves(screen.getByTestId(PIGGY_BANK_TEST_IDS.body))).toBe(true);
  });

  it('holds its hop until the celebration has waited', () => {
    render(<PiggyBank piggyBankFill={1} isGoalReached />);

    expect(waitsForTheCelebration(screen.getByTestId(PIGGY_BANK_TEST_IDS.body))).toBe(true);
  });

  it('gives each piggy bank on a page its own paints', () => {
    const paintIdsIn = (drawing: HTMLElement): string[] =>
      Array.from(drawing.querySelectorAll('defs [id]'), (paint) => paint.id);
    render(
      <>
        <PiggyBank piggyBankFill={0.5} />
        <PiggyBank piggyBankFill={0.5} />
      </>
    );

    const [firstPaintIds, secondPaintIds] = screen
      .getAllByTestId(PIGGY_BANK_TEST_IDS.art)
      .map(paintIdsIn);
    const sharedPaintIds = firstPaintIds.filter((paintId) => secondPaintIds.includes(paintId));

    expect(sharedPaintIds).toEqual([]);
  });
});
