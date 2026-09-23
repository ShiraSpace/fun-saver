import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PROFILE_SECTION_TEST_IDS } from '@/components/Menu/ProfileSection/constants';
import { mockAccount } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

describe('the menu while it is closed', () => {
  const { menu, session } = useDriver({ accounts: [mockAccount] });

  it('keeps sign out away from the keyboard until the menu is opened', async () => {
    assert.equal(
      await session.canTakeFocus(PROFILE_SECTION_TEST_IDS.signOut),
      false
    );

    await menu.open();

    assert.equal(
      await session.canTakeFocus(PROFILE_SECTION_TEST_IDS.signOut),
      true
    );
  });
});
