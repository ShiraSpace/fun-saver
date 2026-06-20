import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { COLORS } from '@/theme/palette';
import { GRADIENTS } from '@/theme/gradients';
import { hexToRgb, gradientToRgb } from './support/css-color';
import { useDriver } from './driver/use-driver';

describe('empty state', () => {
  const { emptyState, session } = useDriver();
  const expectedGradient = gradientToRgb(GRADIENTS.screen);

  describe('the screen', () => {
    it('fits within the viewport', async () => {
      assert.equal(await session.hasVerticalScroll(), false);
    });

    it('is painted with the sunset gradient', async () => {
      assert.equal(await emptyState.background(), expectedGradient);
    });
  });

  describe('the create-account call to action', () => {
    it('wears the purple action colour', async () => {
      assert.equal(await emptyState.ctaColor(), hexToRgb(COLORS.primary));
    });

    it('lifts on hover', async () => {
      await emptyState.hoverCreateAccount();
      await emptyState.waitForCtaToLift();
    });

    it('makes the pig oink when clicked', async () => {
      await emptyState.clickCreateAccount();
      await emptyState.waitForPigToOink();
    });
  });
});
