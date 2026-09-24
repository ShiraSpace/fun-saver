import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  mockAccount,
  mockTransactions,
} from '@/test-utils/mocks/general.mocks';
import { useDriver } from './driver/use-driver';

const mockInitialStore = {
  accounts: [mockAccount],
  transactions: mockTransactions,
};
const ARCS_PER_RING = 3;
const STILL = 'none';

describe('donut sweep', () => {
  const { account } = useDriver(mockInitialStore, 'no-preference');

  it('draws every arc of the ring', async () => {
    const animations = await account.walletShareAnimations();
    const actualAnimationsLength = animations.filter(
      (animation) => animation !== STILL
    ).length;

    assert.equal(actualAnimationsLength, ARCS_PER_RING);
  });
});

describe('donut sweep under reduced motion', () => {
  const { account } = useDriver(mockInitialStore);

  it('leaves every arc of the ring still', async () => {
    const animations = await account.walletShareAnimations();
    const actualNonAnimatedArcs = animations.filter(
      (animation) => animation === STILL
    ).length;

    assert.equal(actualNonAnimatedArcs, ARCS_PER_RING);
  });
});
