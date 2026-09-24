import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  mockAccount,
  mockAccountEdits,
} from '@/test-utils/mocks/general.mocks';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { useDriver } from './driver/use-driver';
import { PHONE } from './driver/viewports';

const mockEditedName = 'רוני';
const mockLongestName = 'א'.repeat(MAX_ACCOUNT_NAME_LENGTH);

describe('edit account from the menu', () => {
  const { menu, editAccount, avatarPicker, header, appBrowser } = useDriver({
    accounts: [mockAccount],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.tapEditAccount();
  });

  it('opens the edit form pre-filled with the current account', async () => {
    assert.equal(await editAccount.isOpen(), true);
    assert.equal(await editAccount.nameValue(), mockAccount.name);
  });

  it('renames the account and shows the new name in the header', async () => {
    await editAccount.replaceName(mockEditedName);
    await editAccount.submit();

    await header.waitForTitle(mockEditedName);
    assert.equal(await header.title(), mockEditedName);
  });

  it('saves a new avatar without touching the name', async () => {
    assert.ok(
      (await header.avatarSource()).includes(mockAccount.avatarId),
      'header starts on the account avatar'
    );

    await avatarPicker.select(mockAccountEdits.avatarId);
    await editAccount.submit();

    await header.waitForAvatar(mockAccountEdits.avatarId);
    assert.equal(await header.title(), mockAccount.name);
  });

  it('keeps the edit button inside the menu for the longest name', async () => {
    await editAccount.replaceName(mockLongestName);
    await editAccount.submit();

    await header.waitForTitle(mockLongestName);
    await appBrowser.resize(PHONE);
    await menu.open();

    const scope = await menu.globalScopeBox();
    const editButton = await menu.editAccountButtonBox();

    assert.ok(
      editButton.width <= scope.width,
      `edit button is ${editButton.width}px wide inside a ${scope.width}px block`
    );
    assert.ok(
      editButton.x >= scope.x,
      `edit button starts at ${editButton.x}px, left of the ${scope.x}px block`
    );
  });

  it('closes the form when the edit is cancelled', async () => {
    await editAccount.replaceName(mockEditedName);
    await editAccount.cancel();

    await header.waitForTitle(mockAccount.name);
    assert.equal(await editAccount.isClosed(), true);
  });

  it('keeps the stored name when the edit is cancelled', async () => {
    await editAccount.replaceName(mockEditedName);
    await editAccount.cancel();
    await appBrowser.reload();

    assert.equal(await header.title(), mockAccount.name);
  });
});

describe('edit account from the menu on the method page', () => {
  const { menu, editAccount } = useDriver({ accounts: [mockAccount] });

  it('opens the edit form there too, on the account in view', async () => {
    await menu.open();
    await menu.openMethodPage();

    await menu.open();
    await menu.tapEditAccount();

    assert.equal(await editAccount.isOpen(), true);
    assert.equal(await editAccount.nameValue(), mockAccount.name);
  });
});
