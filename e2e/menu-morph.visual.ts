import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ACCOUNT } from '@/test-support/fixtures';
import { useDriver } from './driver/use-driver';

const NO_TRANSFORM = 'none';
const VISIBLE = '1';
const HIDDEN = '0';

describe('menu morph', () => {
  const { menu } = useDriver({ accounts: [ACCOUNT] });

  it('shows a hamburger when closed', async () => {
    assert.equal(await menu.iconTransform(), NO_TRANSFORM);
    assert.equal(await menu.middleBarOpacity(), VISIBLE);
  });

  it('spins and morphs to a cross when opened', async () => {
    const closedTransform = await menu.iconTransform();
    await menu.open();
    const openTransform = await menu.iconTransform();
    assert.notEqual(openTransform, closedTransform);
    assert.notEqual(openTransform, NO_TRANSFORM);
    assert.equal(await menu.middleBarOpacity(), HIDDEN);
  });
});
