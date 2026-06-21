import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { GRADIENTS } from '@/theme/gradients';
import { COLORS } from '@/theme/palette';
import { TYPE_SCALE } from '@/theme/typography';
import { SCREEN_LAYOUT } from '@/components/Screen/constants';
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

  it('anchors the form to the top of the screen', async () => {
    assert.equal(await createAccount.contentAlignment(), 'flex-start');
  });

  it('spaces the title equally from the top and the name field', async () => {
    const { fromTop, toNameField } = await createAccount.titleSpacing();
    assert.ok(
      Math.abs(fromTop - toNameField) <= 1,
      `top spacing ${fromTop} should match title→field spacing ${toNameField}`
    );
  });

  it('uses one uniform gap between every form element', async () => {
    const expected = SCREEN_LAYOUT.gap - 2;
    const gaps = await createAccount.formGaps();

    for (const gap of gaps) {
      assert.ok(
        Math.abs(gap - expected) <= 1,
        `gap ${gap} should equal ${expected}`
      );
    }
  });

  it('shows the title in white at the heading size', async () => {
    assert.equal(
      await createAccount.titleColor(),
      hexToRgb(COLORS.textOnPrimary)
    );
    assert.equal(await createAccount.titleFontSize(), `${TYPE_SCALE.h2}px`);
  });

  it('shows the name as a white card with a muted label and strong value', async () => {
    assert.equal(
      await createAccount.nameFieldBackground(),
      hexToRgb(COLORS.surface)
    );
    assert.equal(
      await createAccount.nameLabelColor(),
      hexToRgb(COLORS.textMuted)
    );
    assert.equal(
      await createAccount.nameInputColor(),
      hexToRgb(COLORS.textStrong)
    );
  });
});
