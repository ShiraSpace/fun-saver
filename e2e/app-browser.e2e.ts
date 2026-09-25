import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { useDriver } from './driver/use-driver';

describe('the app browser', () => {
  const { appBrowser } = useDriver();

  it('opens the app signed in as the seeded owner', async () => {
    assert.equal(await appBrowser.signedInUserId(), mockUser.id);
  });
});
