import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { AVATARS } from '@/lib/avatars';
import { AVATAR_PICKER_LAYOUT } from '@/components/AvatarPicker/constants';
import { hexToRgb } from './support/css-color';
import { useDriver } from './driver/use-driver';

describe('avatar picker', () => {
  const { emptyState, createAccount, avatarPicker } = useDriver();

  beforeEach(async () => {
    await emptyState.clickCreateAccount();
    await createAccount.isOpen();
  });

  it('lays the avatars out in a four-column grid', async () => {
    assert.equal(
      await avatarPicker.columnCount(),
      AVATAR_PICKER_LAYOUT.columns
    );
  });

  it('paints each option as a circle in its avatar colour', async () => {
    const option = await avatarPicker.firstOption();

    assert.equal(option.background, hexToRgb(AVATARS[0].background));
    assert.ok(
      Math.abs(option.width - option.height) < 1,
      `option should be square, got ${option.width}x${option.height}`
    );
    assert.equal(option.borderRadius, '50%');
  });

  it('caps the picker width so the avatars stay small', async () => {
    assert.equal(
      await avatarPicker.containerWidth(),
      AVATAR_PICKER_LAYOUT.maxWidth
    );
  });
});
