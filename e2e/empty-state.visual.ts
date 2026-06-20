import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { COLORS } from '@/theme/palette';
import { useDriver } from './driver/use-driver';

function hexToRgb(hex: string): string {
  const value = parseInt(hex.slice(1), 16);
  return `rgb(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255})`;
}

describe('empty state', () => {
  const { emptyState, session } = useDriver();

  it('renders the create-account CTA in the purple action colour', async () => {
    assert.equal(await emptyState.ctaColor(), hexToRgb(COLORS.primary));
  });

  it('fits the viewport without vertical scroll', async () => {
    assert.equal(await session.hasVerticalScroll(), false);
  });
});
