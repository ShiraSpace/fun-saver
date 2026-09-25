import { render, screen } from '@/test-utils/render';
import {
  mockWalletSummaries,
  mockWalletShares,
} from '@/test-utils/mocks/wallet.mocks';
import { getThemeTokens } from '@/theme/registry';
import { Donut, type DonutSegment } from './Donut';
import { BALANCE_BREAKDOWN_TEST_IDS } from '../constants';

const walletSegments = mockWalletSummaries.map((wallet, index) => ({
  name: wallet.name,
  share: mockWalletShares[index],
}));

function getArcs(): Element[] {
  const circles = screen
    .getByTestId(BALANCE_BREAKDOWN_TEST_IDS.donut)
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
    const savingsArcLength = 139.864;

    expect(arcLength(savingsArc)).toBeCloseTo(savingsArcLength, DECIMAL_PLACES);
  });

  it('sizes the good-deeds arc to its smaller share', () => {
    const goodDeedsArcLength = 42.223;

    expect(arcLength(goodDeedsArc)).toBeCloseTo(
      goodDeedsArcLength,
      DECIMAL_PLACES
    );
  });

  it('starts the savings arc at the top of the ring', () => {
    const ringTop = 0;

    expect(arcStart(savingsArc)).toBe(ringTop);
  });

  it('starts the spending arc where the savings arc ended', () => {
    const savingsArcEnd = arcEnd(savingsArc);

    expect(arcStart(spendingArc)).toBeCloseTo(savingsArcEnd, DECIMAL_PLACES);
  });

  it('sweeps the savings arc for its share of the ring', () => {
    const savingsSweepMs = 318;

    expect(arcSweepMs(savingsArc)).toBe(savingsSweepMs);
  });

  it('starts the spending arc when the savings arc has finished', () => {
    expect(arcDelayMs(spendingArc)).toBe(arcSweepMs(savingsArc));
  });

  it('colours the savings arc with its wallet token', () => {
    const savingsArcColor = getThemeTokens().colors.walletSavings;

    expect(savingsArc.getAttribute('stroke')).toBe(savingsArcColor);
  });
});

describe('Donut with an empty wallet', () => {
  const emptyWalletSegments: DonutSegment[] = [
    { name: 'savings', share: 60 },
    { name: 'spending', share: 40 },
    { name: 'goodDeeds', share: 0 },
  ];
  let emptyWalletArc: Element;

  beforeEach(() => {
    render(<Donut segments={emptyWalletSegments} />);
    [, , emptyWalletArc] = getArcs();
  });

  it('gives a wallet with nothing in it no time in the sweep', () => {
    const noSweepMs = 0;

    expect(arcSweepMs(emptyWalletArc)).toBe(noSweepMs);
  });
});
