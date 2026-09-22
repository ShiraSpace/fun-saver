import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount, mockAccountEdit } from '@/test-utils/fixtures';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { useDriver } from './driver/use-driver';
import { PHONE } from './driver/viewports';

const EDITED_NAME = 'רוני';
const LONGEST_NAME = 'א'.repeat(MAX_ACCOUNT_NAME_LENGTH);

describe('edit account from the menu', () => {
  const { menu, editAccount, avatarPicker, header, session } = useDriver({
    accounts: [mockAccount],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.clickEditAccountButton();
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
    assert.ok(
      (await header.avatarSource()).includes(mockAccount.avatarId),
      'header starts on the account avatar'
    );

    await avatarPicker.select(mockAccountEdit.avatarId);
    await editAccount.submit();

    await header.waitForAvatar(mockAccountEdit.avatarId);
    assert.equal(await header.name(), mockAccount.name);
  });

  it('keeps the edit button inside the menu for the longest name', async () => {
    await editAccount.replaceName(LONGEST_NAME);
    await editAccount.submit();

    await header.waitForName(LONGEST_NAME);
    await session.resize(PHONE);
    await menu.open();

    const section = await menu.accountsSectionBox();
    const editButton = await menu.editAccountButtonBox();

    assert.ok(
      editButton.width <= section.width,
      `edit button is ${editButton.width}px wide inside a ${section.width}px menu`
    );
    assert.ok(
      editButton.x >= section.x,
      `edit button starts at ${editButton.x}px, left of the ${section.x}px menu`
    );
  });

  it('closes the form when the edit is cancelled', async () => {
    await editAccount.replaceName(EDITED_NAME);
    await editAccount.cancel();

    await header.waitForName(mockAccount.name);
    assert.equal(await editAccount.isClosed(), true);
  });

  it('keeps the stored name when the edit is cancelled', async () => {
    await editAccount.replaceName(EDITED_NAME);
    await editAccount.cancel();
    await session.reload();

    assert.equal(await header.name(), mockAccount.name);
  });
});

describe('edit account from the menu on the method page', () => {
  const { menu, editAccount } = useDriver({ accounts: [mockAccount] });

  it('opens the edit form there too, on the account in view', async () => {
    await menu.open();
    await menu.openMethodPage();

    await menu.open();
    await menu.clickEditAccountButton();

    assert.equal(await editAccount.isOpen(), true);
    assert.equal(await editAccount.nameValue(), mockAccount.name);
  });
});
