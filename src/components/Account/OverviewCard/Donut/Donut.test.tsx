import { render, screen } from '@/test-utils/render';
import { mockDerivedWallets, mockWalletShares } from '@/test-utils/fixtures';
import { getThemeTokens } from '@/theme/registry';
import { Donut, type DonutSegment } from './Donut';
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

function arcSweepMs(arc: Element): number {
  return Number.parseFloat(getComputedStyle(arc).animationDuration);
}

function arcDelayMs(arc: Element): number {
  return Number.parseFloat(getComputedStyle(arc).animationDelay);
}

const DECIMAL_PLACES = 2;
const RING_TOP = 0;
const SAVINGS_ARC_LENGTH = 139.864;
const GOOD_DEEDS_ARC_LENGTH = 42.223;
const SAVINGS_ARC_COLOR = getThemeTokens().colors.walletSavings;
const SAVINGS_SWEEP_MS = 318;
const emptyWalletSegments: DonutSegment[] = [
  { name: 'savings', share: 60 },
  { name: 'spending', share: 40 },
  { name: 'goodDeeds', share: 0 },
];
const NO_SWEEP_MS = 0;

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

  it('sweeps the savings arc for its share of the ring', () => {
    expect(arcSweepMs(savingsArc)).toBe(SAVINGS_SWEEP_MS);
  });

  it('starts the spending arc when the savings arc has finished', () => {
    expect(arcDelayMs(spendingArc)).toBe(arcSweepMs(savingsArc));
  });

  it('colours the savings arc with its wallet token', () => {
    expect(savingsArc.getAttribute('stroke')).toBe(SAVINGS_ARC_COLOR);
  });
});

describe('Donut with an empty wallet', () => {
  let emptyWalletArc: Element;

  beforeEach(() => {
    render(<Donut segments={emptyWalletSegments} />);
    [, , emptyWalletArc] = getArcs();
  });

  it('gives a wallet with nothing in it no time in the sweep', () => {
    expect(arcSweepMs(emptyWalletArc)).toBe(NO_SWEEP_MS);
  });
});
