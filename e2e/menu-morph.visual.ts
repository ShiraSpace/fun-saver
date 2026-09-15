import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-utils/fixtures';
import { COLORS } from '@/theme/palette';
import { MENU_OVERLAY_CONTENT } from '@/components/Menu/MenuOverlay/constants';
import { hexToRgb } from './test-utils/css-color';
import { useDriver } from './driver/use-driver';

const NO_TRANSFORM = 'none';
const VISIBLE = '1';
const HIDDEN = '0';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';
const SHEET = hexToRgb(COLORS.softBg);
const ON_SHEET = hexToRgb(COLORS.textStrong);

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
    assert.equal(await header.titleColor(), ON_SHEET);
  });

  it('opens onto a soft sheet rather than the screen gradient', async () => {
    await menu.open();

    assert.equal(await menu.panelBackground(), SHEET);
  });
});
