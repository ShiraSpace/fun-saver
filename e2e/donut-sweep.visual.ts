import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount, mockTransactions } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

const seed = { accounts: [mockAccount], transactions: mockTransactions };
const ARCS_PER_RING = 3;
const STILL = 'none';

describe('donut sweep', () => {
  const { dashboard } = useDriver(seed, 'no-preference');

  it('draws every arc of the ring', async () => {
    const animations = await dashboard.arcAnimations();
    const actualAnimationsLength = animations.filter(
      (animation) => animation !== STILL
    ).length;

    assert.equal(actualAnimationsLength, ARCS_PER_RING);
  });
});

describe('donut sweep under reduced motion', () => {
  const { dashboard } = useDriver(seed);

  it('leaves every arc of the ring still', async () => {
    const animations = await dashboard.arcAnimations();
    const actualNonAnimatedArcs = animations.filter(
      (animation) => animation === STILL
    ).length;

    assert.equal(actualNonAnimatedArcs, ARCS_PER_RING);
  });
});
