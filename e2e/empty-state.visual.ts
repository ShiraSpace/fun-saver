import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { COLORS } from '@/theme/palette';
import { GRADIENTS } from '@/theme/gradients';
import { ACTION_BUTTON } from '@/components/ActionButton/constants';
import { hexToRgb } from './support/css-color';
import { useDriver } from './driver/use-driver';

describe('empty state', () => {
  const { emptyState, session } = useDriver();

  it('renders the create-account CTA in the purple action colour', async () => {
    assert.equal(await emptyState.ctaColor(), hexToRgb(COLORS.primary));
  });

  it('fits the viewport without vertical scroll', async () => {
    assert.equal(await session.hasVerticalScroll(), false);
  });

  it('paints the screen with the sunset gradient', async () => {
    const expected = GRADIENTS.screen.replace(/#[0-9a-fA-F]{6}/g, hexToRgb);
    assert.equal(await emptyState.background(), expected);
  });

  it('lifts the action button on hover', async () => {
    await emptyState.hoverCreateAccount();
    await emptyState.waitForCtaTransform(
      `matrix(1, 0, 0, 1, 0, -${ACTION_BUTTON.hoverLift})`
    );
  });
});
