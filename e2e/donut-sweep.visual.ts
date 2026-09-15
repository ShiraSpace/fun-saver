import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount, mockTransactions } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

const ARCS_PER_RING = 3;
const NOTHING_MOVES = 0;
const MOTION_ALLOWED = true;
const MOTION_REDUCED = false;

describe('donut sweep', () => {
  const { dashboard } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
  });

  it('draws every arc when the browser allows motion', async () => {
    assert.equal(
      await dashboard.donutAnimationsOnLoad(MOTION_ALLOWED),
      ARCS_PER_RING
    );
  });

  it('draws nothing when the browser asks for reduced motion', async () => {
    assert.equal(
      await dashboard.donutAnimationsOnLoad(MOTION_REDUCED),
      NOTHING_MOVES
    );
  });
});
