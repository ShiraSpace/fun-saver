import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { HOME_ROUTE } from '@/components/Home/constants';
import { LOGIN_PATH } from '@/lib/constants';
import { mockAccount } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

describe('signing out', () => {
  const { menu, session } = useDriver({ accounts: [mockAccount] });

  it('leaves the app for the login page', async () => {
    await menu.open();

    assert.equal(await menu.signOut(), LOGIN_PATH);
  });

  it('ends the session, so going back does not walk straight in', async () => {
    await menu.open();
    await menu.signOut();

    await session.visit(HOME_ROUTE);

    assert.equal(session.currentPath(), LOGIN_PATH);
  });
});
