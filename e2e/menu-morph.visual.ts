import { beforeEach, describe, it } from 'node:test';
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

  describe('when closed', () => {
    it('shows a hamburger', async () => {
      assert.equal(await menu.iconTransform(), NO_TRANSFORM);
      assert.equal(await menu.middleBarOpacity(), VISIBLE);
    });

    it('shows the opaque header with the account name', async () => {
      assert.notEqual(await header.background(), TRANSPARENT);
      assert.equal(await header.name(), mockAccount.name);
    });
  });

  describe('when opened', () => {
    beforeEach(async () => {
      await menu.open();
    });

    it('spins and morphs the burger to a cross', async () => {
      assert.notEqual(await menu.iconTransform(), NO_TRANSFORM);
      assert.equal(await menu.middleBarOpacity(), HIDDEN);
    });

    it('fades the header transparent and swaps in the menu title', async () => {
      await header.waitForTransparentBar();

      assert.equal(await header.background(), TRANSPARENT);
      assert.equal(await header.shadow(), NO_TRANSFORM);
      assert.equal(await header.name(), MENU_OVERLAY_CONTENT.title);
      assert.equal(await header.titleColor(), ON_SHEET);
    });

    it('opens onto a soft sheet rather than the screen gradient', async () => {
      assert.equal(await menu.panelBackground(), SHEET);
    });
  });
});
