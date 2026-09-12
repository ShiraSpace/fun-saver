import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-support/fixtures';
import { MENU_OVERLAY_CONTENT } from '@/components/Menu/MenuOverlay/constants';
import { useDriver } from './driver/use-driver';

const NO_TRANSFORM = 'none';
const VISIBLE = '1';
const HIDDEN = '0';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';
const WHITE = 'rgb(255, 255, 255)';

describe('menu morph', () => {
  const { menu, header } = useDriver({ accounts: [mockAccount] });

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

  it('shows the opaque header with the account name when closed', async () => {
    assert.notEqual(await header.background(), TRANSPARENT);
    assert.equal(await header.name(), mockAccount.name);
  });

  it('fades the header transparent and swaps in the menu title when opened', async () => {
    await menu.open();
    await header.waitForTransparentBar();

    assert.equal(await header.background(), TRANSPARENT);
    assert.equal(await header.shadow(), NO_TRANSFORM);
    assert.equal(await header.name(), MENU_OVERLAY_CONTENT.title);
    assert.equal(await header.titleColor(), WHITE);
  });
});
