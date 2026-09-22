import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-utils/fixtures';
import { COLORS } from '@/theme/palette';
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

    it('leaves the header card standing', async () => {
      assert.notEqual(await header.background(), TRANSPARENT);
      assert.notEqual(await header.shadow(), NO_TRANSFORM);
      assert.equal(await header.name(), mockAccount.name);
      assert.equal(await header.titleColor(), ON_SHEET);
    });

    it('starts the panel below the header rather than over it', async () => {
      const bar = await header.box();
      const panel = await menu.panelBox();

      assert.equal(panel.y, bar.y + bar.height);
    });

    it('opens onto a soft sheet rather than the screen gradient', async () => {
      assert.equal(await menu.panelBackground(), SHEET);
    });

    it('floats the account list over the sections below rather than pushing them down', async () => {
      const settled = await menu.appearanceSectionBox();

      await menu.openAccountPicker();

      const appearance = await menu.appearanceSectionBox();
      const list = await menu.accountListBox();
      const overlapsAppearance =
        list.y < appearance.y + appearance.height &&
        list.y + list.height > appearance.y;

      assert.equal(appearance.y, settled.y);
      assert.ok(
        overlapsAppearance,
        `list spans ${list.y}-${list.y + list.height}, appearance ${appearance.y}-${appearance.y + appearance.height}`
      );
      assert.ok(
        await menu.accountListCovers(
          appearance.x + appearance.width / 2,
          appearance.y + 1
        ),
        'the appearance section is painted over the list where they overlap'
      );
    });
  });
});
