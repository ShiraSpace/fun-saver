import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockUser } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

describe('the driver session', () => {
  const { session } = useDriver();

  it('opens the app signed in as the seeded owner', async () => {
    assert.equal(await session.signedInUserId(), mockUser.id);
  });
});
