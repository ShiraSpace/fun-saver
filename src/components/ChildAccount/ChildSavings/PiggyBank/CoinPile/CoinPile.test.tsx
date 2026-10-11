import { render, within } from '@/test-utils/render';
import { piggyBankPaintIds } from '../piggy-bank-paint-ids';
import { COIN_PILE_SPOTS } from '../coin-pile';
import { CoinPile } from './CoinPile';
import { COIN_PILE_TEST_IDS } from './constants';

const mockPaintIds = piggyBankPaintIds('mock-piggy-bank');

function renderPile(fill: number): HTMLElement {
  const { container } = render(
    <svg>
      <CoinPile fill={fill} paintIds={mockPaintIds} />
    </svg>
  );

  return container;
}

function coinsIn(pile: HTMLElement): number {
  return within(pile).queryAllByTestId(COIN_PILE_TEST_IDS.coin).length;
}

describe('CoinPile', () => {
  describe('an empty piggy bank', () => {
    let pile: HTMLElement;

    beforeEach(() => {
      pile = renderPile(0);
    });

    it('draws no coins', () => {
      expect(coinsIn(pile)).toBe(0);
    });
  });

  describe('a full piggy bank', () => {
    let pile: HTMLElement;

    beforeEach(() => {
      pile = renderPile(1);
    });

    it('draws a coin in every spot', () => {
      expect(coinsIn(pile)).toBe(COIN_PILE_SPOTS.length);
    });
  });

  describe('two piggy banks, one fuller', () => {
    let lessFull: HTMLElement;
    let fuller: HTMLElement;

    beforeEach(() => {
      lessFull = renderPile(0.3);
      fuller = renderPile(0.6);
    });

    it('draws more coins in the fuller one', () => {
      expect(coinsIn(fuller)).toBeGreaterThan(coinsIn(lessFull));
    });
  });
});
