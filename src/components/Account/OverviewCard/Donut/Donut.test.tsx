import { render, screen } from '@/test-utils/render';
import { mockDerivedWallets, mockWalletShares } from '@/test-utils/fixtures';
import { Donut } from './Donut';
import { OVERVIEW_CARD_TEST_IDS } from '../constants';

const walletSegments = mockDerivedWallets.map((wallet, index) => ({
  name: wallet.name,
  share: mockWalletShares[index],
}));

function getArcs(): Element[] {
  const circles = screen
    .getByTestId(OVERVIEW_CARD_TEST_IDS.donut)
    .querySelectorAll('circle');

  return Array.from(circles).slice(1);
}

function arcLength(arc: Element): number {
  const dashArray = arc.getAttribute('stroke-dasharray') ?? '';

  return Number(dashArray.split(' ')[0]);
}

function arcStart(arc: Element): number {
  return Number(arc.getAttribute('stroke-dashoffset'));
}

function arcEnd(arc: Element): number {
  return arcStart(arc) - arcLength(arc);
}

const DECIMAL_PLACES = 2;
const RING_TOP = 0;
const SAVINGS_ARC_LENGTH = 139.864;
const GOOD_DEEDS_ARC_LENGTH = 42.223;
const SAVINGS_ARC_COLOR = '#FFC34D';

describe('Donut', () => {
  let walletArcs: Element[];
  let savingsArc: Element;
  let spendingArc: Element;
  let goodDeedsArc: Element;

  beforeEach(() => {
    render(<Donut segments={walletSegments} />);
    walletArcs = getArcs();
    [savingsArc, spendingArc, goodDeedsArc] = walletArcs;
  });

  it('draws one arc per wallet on top of a track', () => {
    expect(walletArcs).toHaveLength(walletSegments.length);
  });

  it('sizes the savings arc to its share of the ring', () => {
    expect(arcLength(savingsArc)).toBeCloseTo(
      SAVINGS_ARC_LENGTH,
      DECIMAL_PLACES
    );
  });

  it('sizes the good-deeds arc to its smaller share', () => {
    expect(arcLength(goodDeedsArc)).toBeCloseTo(
      GOOD_DEEDS_ARC_LENGTH,
      DECIMAL_PLACES
    );
  });

  it('starts the savings arc at the top of the ring', () => {
    expect(arcStart(savingsArc)).toBe(RING_TOP);
  });

  it('starts the spending arc where the savings arc ended', () => {
    const savingsArcEnd = arcEnd(savingsArc);

    expect(arcStart(spendingArc)).toBeCloseTo(savingsArcEnd, DECIMAL_PLACES);
  });

  it('colours the savings arc with its wallet token', () => {
    expect(savingsArc.getAttribute('stroke')).toBe(SAVINGS_ARC_COLOR);
  });
});
