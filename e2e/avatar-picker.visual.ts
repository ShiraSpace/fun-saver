import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { AVATARS } from '@/lib/avatars';
import { AVATAR_PICKER_LAYOUT } from '@/components/AvatarPicker/constants';
import { getThemeTokens } from '@/theme/registry';
import { hexToRgb } from '@/test-utils/css-color';
import { useDriver } from './driver/use-driver';

describe('avatar picker', () => {
  const { emptyState, createAccount, avatarPicker } = useDriver();

  beforeEach(async () => {
    await emptyState.tapCreateAccount();
    await createAccount.isOpen();
  });

  it('lays the avatars out in a four-column grid', async () => {
    assert.equal(
      await avatarPicker.columnCount(),
      AVATAR_PICKER_LAYOUT.columns
    );
  });

  it('paints each option as a circle in its avatar colour', async () => {
    const option = await avatarPicker.firstAvatar();

    assert.equal(option.background, hexToRgb(AVATARS[0].background));
    assert.ok(
      Math.abs(option.width - option.height) < 1,
      `option should be square, got ${option.width}x${option.height}`
    );
    assert.equal(option.borderRadius, '50%');
  });

  it('caps the picker width so the avatars stay small', async () => {
    assert.equal(
      await avatarPicker.pickerWidth(),
      AVATAR_PICKER_LAYOUT.maxWidth
    );
  });

  it('rings the selected option in a colour the gradient does not hide', async () => {
    await avatarPicker.selectFirst();
    const option = await avatarPicker.selectedAvatar();

    assert.equal(
      option.borderColor,
      hexToRgb(getThemeTokens().colors.textOnPrimary)
    );
    assert.ok(
      option.boxShadow.includes(
        hexToRgb(getThemeTokens().colors.selectionRing)
      ),
      `expected ring colour ${hexToRgb(getThemeTokens().colors.selectionRing)} in "${option.boxShadow}"`
    );
  });

  it('lifts an option on hover', async () => {
    await avatarPicker.hoverFirst();
    await avatarPicker.waitForAvatarToLift();
  });
});
