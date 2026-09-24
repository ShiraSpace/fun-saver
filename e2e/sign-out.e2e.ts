import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { HOME_ROUTE } from '@/components/Home/constants';
import { SIGN_IN_PATH } from '@/lib/constants';
import { mockAccount } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

describe('signing out', () => {
  const { menu, session } = useDriver({ accounts: [mockAccount] });

  it('leaves the app for the sign-in page', async () => {
    await menu.open();

    assert.equal(await menu.signOut(), SIGN_IN_PATH);
  });

  it('ends the session, so going back does not walk straight in', async () => {
    await menu.open();
    await menu.signOut();

    await session.visit(HOME_ROUTE);

    assert.equal(session.currentPath(), SIGN_IN_PATH);
  });
});
