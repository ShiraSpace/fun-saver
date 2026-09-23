import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { type BoundingBox } from 'puppeteer';
import { mockAccount } from '@/test-utils/fixtures';
import { COLORS } from '@/theme/palette';
import { hexToRgb } from './test-utils/css-color';
import { useDriver } from './driver/use-driver';

const bottomOf = (box: BoundingBox): number => box.y + box.height;
const centreX = (box: BoundingBox): number => box.x + box.width / 2;
const justInsideTop = (box: BoundingBox): number => box.y + 1;
const spanOf = (box: BoundingBox): string => `${box.y}-${bottomOf(box)}`;

const overlapVertically = (a: BoundingBox, b: BoundingBox): boolean =>
  a.y < bottomOf(b) && bottomOf(a) > b.y;

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

    it('leaves the appearance section where it was when the list opens', async () => {
      const before = await menu.appearanceSectionBox();

      await menu.openAccountPicker();

      const after = await menu.appearanceSectionBox();

      assert.equal(after.y, before.y);
    });

    describe('with the account list open', () => {
      let accountScope: BoundingBox;
      let list: BoundingBox;

      beforeEach(async () => {
        await menu.openAccountPicker();

        accountScope = await menu.accountScopeBox();
        list = await menu.accountListBox();
      });

      it('reaches down over the per-account block', () => {
        const listReachesOverIt = overlapVertically(list, accountScope);

        assert.ok(
          listReachesOverIt,
          `list spans ${spanOf(list)}, per-account block spans ${spanOf(accountScope)}`
        );
      });

      it('takes a tap meant for the per-account block underneath', async () => {
        const whereTheyOverlap = {
          x: centreX(accountScope),
          y: justInsideTop(accountScope),
        };
        const listTakesTheTap =
          await menu.accountListReceivesTapAt(whereTheyOverlap);

        assert.ok(
          listTakesTheTap,
          `the per-account block takes the tap at ${whereTheyOverlap.x},${whereTheyOverlap.y}`
        );
      });
    });
  });
});
