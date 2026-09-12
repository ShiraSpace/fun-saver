import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-support/fixtures';
import { useDriver } from './driver/use-driver';

describe('page routing', () => {
  describe('with no accounts', () => {
    const { header, emptyState } = useDriver();

    it('shows the empty state and not the header', async () => {
      assert.equal(await emptyState.exists(), true);
      assert.equal(await header.exists(), false);
    });
  });

  describe('with an account', () => {
    const { header, emptyState } = useDriver({ accounts: [mockAccount] });

    it('shows the header and not the empty state', async () => {
      assert.equal(await header.exists(), true);
      assert.equal(await emptyState.exists(), false);
    });
  });
});
