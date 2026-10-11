import { render, screen } from '@/test-utils/render';
import { PiggyBank } from './PiggyBank';
import { PIGGY_BANK_TEST_IDS } from './constants';

function paintIdsIn(drawing: HTMLElement): string[] {
  return Array.from(drawing.querySelectorAll('defs [id]'), (paint) => paint.id);
}

describe('PiggyBank', () => {
  describe('one piggy bank', () => {
    beforeEach(() => {
      render(<PiggyBank piggyBankFill={0.5} />);
    });

    it('hides the drawing from screen readers', () => {
      expect(screen.getByTestId(PIGGY_BANK_TEST_IDS.art)).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('two piggy banks on one page', () => {
    beforeEach(() => {
      render(
        <>
          <PiggyBank piggyBankFill={0.5} />
          <PiggyBank piggyBankFill={0.5} />
        </>
      );
    });

    it('gives each its own paints', () => {
      const [first, second] = screen.getAllByTestId(PIGGY_BANK_TEST_IDS.art).map(paintIdsIn);

      expect(first.filter((paintId) => second.includes(paintId))).toEqual([]);
    });
  });
});
