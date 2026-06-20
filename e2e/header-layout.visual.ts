import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { type BoundingBox } from 'puppeteer';
import { TYPE_SCALE } from '@/theme/typography';
import { ACCOUNT } from '@/test-support/fixtures';
import { useDriver } from './driver/use-driver';

const EDGE_TOLERANCE = 24;
const CENTER_TOLERANCE = 24;
const HEADING_FONT_SIZE = `${TYPE_SCALE.h2}px`;

describe('header', () => {
  const { header, menu } = useDriver({ accounts: [ACCOUNT] });

  describe('layout', () => {
    let bar: BoundingBox;
    let menuButton: BoundingBox;
    let name: BoundingBox;
    let avatar: BoundingBox;

    beforeEach(async () => {
      bar = await header.box();
      menuButton = await menu.buttonBox();
      name = await header.nameBox();
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

    it('centers the account name', () => {
      const barCenter = bar.x + bar.width / 2;
      const nameCenter = name.x + name.width / 2;

      assert.ok(Math.abs(nameCenter - barCenter) <= CENTER_TOLERANCE);
    });

    it('keeps the menu, name and avatar on the top row', () => {
      assert.ok(
        menuButton.y < name.y + name.height &&
          menuButton.y + menuButton.height > name.y
      );
    });
  });

  describe('typography', () => {
    it('renders the account name at the heading size from the type scale', async () => {
      assert.equal(await header.nameFontSize(), HEADING_FONT_SIZE);
    });
  });
});
