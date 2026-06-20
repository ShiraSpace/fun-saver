import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GRADIENTS } from '@/theme/gradients';
import { hexToRgb } from './support/css-color';
import { useDriver } from './driver/use-driver';

describe('create account', () => {
  const { emptyState, createAccount } = useDriver();

  it('paints the screen with the sunset gradient', async () => {
    await emptyState.clickCreateAccount();
    await createAccount.isOpen();

    const expected = GRADIENTS.screen.replace(/#[0-9a-fA-F]{6}/g, hexToRgb);
    assert.equal(await createAccount.background(), expected);
  });
});
