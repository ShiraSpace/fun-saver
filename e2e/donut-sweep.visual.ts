import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount, mockTransactions } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

const seed = { accounts: [mockAccount], transactions: mockTransactions };
const ARCS_PER_RING = 3;
const NOTHING_MOVES = 0;

describe('donut sweep', () => {
  const { dashboard } = useDriver(seed, 'no-preference');

  it('draws every arc of the ring', async () => {
    assert.deepEqual(await dashboard.arcsOnLoad(), {
      elements: ARCS_PER_RING,
      animations: ARCS_PER_RING,
    });
  });
});

describe('donut sweep under reduced motion', () => {
  const { dashboard } = useDriver(seed);

  it('leaves every arc of the ring still', async () => {
    assert.deepEqual(await dashboard.arcsOnLoad(), {
      elements: ARCS_PER_RING,
      animations: NOTHING_MOVES,
    });
  });
});
