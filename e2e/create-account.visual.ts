import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { GRADIENTS } from '@/theme/gradients';
import { COLORS } from '@/theme/palette';
import { TYPE_SCALE } from '@/theme/typography';
import { gradientToRgb, hexToRgb } from './support/css-color';
import { useDriver } from './driver/use-driver';

describe('create account', () => {
  const { emptyState, createAccount } = useDriver();
  const expectedGradient = gradientToRgb(GRADIENTS.screen);

  beforeEach(async () => {
    await emptyState.clickCreateAccount();
    await createAccount.isOpen();
  });

  it('paints the screen with the sunset gradient', async () => {
    assert.equal(await createAccount.background(), expectedGradient);
  });

  it('shows the title in white at the heading size', async () => {
    assert.equal(
      await createAccount.titleColor(),
      hexToRgb(COLORS.textOnPrimary)
    );
    assert.equal(await createAccount.titleFontSize(), `${TYPE_SCALE.h2}px`);
  });
});
