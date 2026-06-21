import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GRADIENTS } from '@/theme/gradients';
import { gradientToRgb } from './support/css-color';
import { useDriver } from './driver/use-driver';

describe('empty state', () => {
  const { emptyState, session } = useDriver();
  const expectedGradient = gradientToRgb(GRADIENTS.screen);
  const expectedCtaGradient = gradientToRgb(GRADIENTS.actionButton);

  describe('the screen', () => {
    it('fits within the viewport', async () => {
      assert.equal(await session.hasVerticalScroll(), false);
    });

    it('is painted with the sunset gradient', async () => {
      assert.equal(await emptyState.background(), expectedGradient);
    });
  });

  describe('the create-account call to action', () => {
    it('wears the purple action gradient', async () => {
      assert.equal(await emptyState.ctaBackground(), expectedCtaGradient);
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
