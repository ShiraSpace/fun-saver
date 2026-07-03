import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { type BoundingBox } from 'puppeteer';
import { TYPE_SCALE } from '@/theme/typography';
import { mockAccount } from '@/test-support/fixtures';
import { useDriver } from './driver/use-driver';

const EDGE_TOLERANCE = 24;
const HEADING_FONT_SIZE = `${TYPE_SCALE.title}px`;

describe('header', () => {
  const { header, menu } = useDriver({ accounts: [mockAccount] });

  describe('layout', () => {
    let bar: BoundingBox;
    let menuButton: BoundingBox;
    let name: BoundingBox;
    let chip: BoundingBox;
    let avatar: BoundingBox;

    beforeEach(async () => {
      bar = await header.box();
      menuButton = await menu.buttonBox();
      name = await header.nameBox();
      chip = await header.totalChipBox();
      avatar = await header.avatarBox();
    });

    it('places the menu at the start edge (right in RTL)', () => {
      assert.ok(
        Math.abs(bar.x + bar.width - (menuButton.x + menuButton.width)) <=
          EDGE_TOLERANCE
      );
    });

    it('places the avatar at the end edge (left in RTL)', () => {
      assert.ok(Math.abs(avatar.x - bar.x) <= EDGE_TOLERANCE);
    });

    it('anchors the account name to the start, beside the menu', () => {
      assert.ok(Math.abs(name.x + name.width - menuButton.x) <= EDGE_TOLERANCE);
    });

    it('places the total chip between the name and the avatar', () => {
      assert.ok(chip.x + chip.width <= name.x + EDGE_TOLERANCE);
      assert.ok(avatar.x + avatar.width <= chip.x + EDGE_TOLERANCE);
    });

    it('keeps the menu, name, chip and avatar on the top row', () => {
      const onNameRow = (box: BoundingBox): boolean =>
        box.y < name.y + name.height && box.y + box.height > name.y;

      assert.ok(onNameRow(menuButton));
      assert.ok(onNameRow(chip));
      assert.ok(onNameRow(avatar));
    });
  });

  describe('typography', () => {
    it('renders the account name at the heading size from the type scale', async () => {
      assert.equal(await header.nameFontSize(), HEADING_FONT_SIZE);
    });
  });
});
