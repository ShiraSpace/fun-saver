import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

const EDITED_NAME = 'רוני';

describe('edit account from the menu', () => {
  const { menu, editAccount, avatarPicker, header } = useDriver({
    accounts: [mockAccount],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.clickEditAccountChip();
  });

  it('opens the edit form pre-filled with the current account', async () => {
    assert.equal(await editAccount.isOpen(), true);
    assert.equal(await editAccount.nameValue(), mockAccount.name);
  });

  it('renames the account and shows the new name in the header', async () => {
    await editAccount.replaceName(EDITED_NAME);
    await editAccount.submit();

    await header.waitForName(EDITED_NAME);
    assert.equal(await header.name(), EDITED_NAME);
  });

  it('saves a new avatar without touching the name', async () => {
    await avatarPicker.selectFirst();
    await editAccount.submit();

    await header.waitForName(mockAccount.name);
    assert.equal(await header.name(), mockAccount.name);
  });

  it('keeps the current name when the edit is cancelled', async () => {
    await editAccount.replaceName(EDITED_NAME);
    await editAccount.cancel();

    await header.waitForName(mockAccount.name);
    assert.equal(await header.name(), mockAccount.name);
  });
});
