import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { GRADIENTS } from '@/theme/gradients';
import { gradientToRgb } from './support/css-color';
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
});
