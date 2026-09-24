import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getThemeTokens } from '@/theme/registry';
import { gradientToRgb } from '@/test-utils/css-color';
import { useDriver } from './driver/use-driver';

describe('empty state', () => {
  const { emptyState, appBrowser } = useDriver();
  const expectedGradient = gradientToRgb(getThemeTokens().gradients.screen);
  const expectedCtaGradient = gradientToRgb(
    getThemeTokens().gradients.primaryButton
  );

  describe('the screen', () => {
    it('fits within the viewport', async () => {
      assert.equal(await appBrowser.hasVerticalScroll(), false);
    });

    it('is painted with the sunset gradient', async () => {
      assert.equal(await emptyState.background(), expectedGradient);
    });
  });

  describe('the create-account call to action', () => {
    it('wears the purple primary-button gradient', async () => {
      assert.equal(await emptyState.ctaBackground(), expectedCtaGradient);
    });

    it('lifts on hover', async () => {
      await emptyState.hoverCreateAccount();
      await emptyState.waitForCtaToLift();
    });

    it('makes the pig oink when clicked', async () => {
      await emptyState.tapCreateAccount();
      await emptyState.waitForPigToOink();
    });
  });
});
