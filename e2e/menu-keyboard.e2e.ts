import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SIGNED_IN_USER_SECTION_TEST_IDS } from '@/components/Menu/SignedInUserSection/constants';
import { mockAccount } from '@/test-utils/mocks/general.mocks';
import { useDriver } from './driver/use-driver';

describe('the menu while it is closed', () => {
  const { menu, appBrowser } = useDriver({ accounts: [mockAccount] });

  it('keeps sign out away from the keyboard until the menu is opened', async () => {
    assert.equal(
      await appBrowser.canTakeFocus(SIGNED_IN_USER_SECTION_TEST_IDS.signOut),
      false
    );

    await menu.open();

    assert.equal(
      await appBrowser.canTakeFocus(SIGNED_IN_USER_SECTION_TEST_IDS.signOut),
      true
    );
  });
});
