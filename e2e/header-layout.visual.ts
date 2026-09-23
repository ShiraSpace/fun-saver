import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { type BoundingBox } from 'puppeteer';
import { TYPE_SCALE } from '@/theme/typography';
import { HEADER_LAYOUT, HEADER_TEST_IDS } from '@/components/Header/constants';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { createMockAccount, mockAccount } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

const EDGE_TOLERANCE = 24;
const HEADING_FONT_SIZE = `${TYPE_SCALE.title}px`;

const longNamedAccount = createMockAccount({
  name: 'נועה '.repeat(20).trim().slice(0, MAX_ACCOUNT_NAME_LENGTH),
});

describe('header', () => {
  describe('on home', () => {
    const { header, menu } = useDriver({ accounts: [mockAccount] });

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

      it('anchors the account name to the start, beside the menu', () => {
        assert.ok(
          Math.abs(name.x + name.width - menuButton.x) <= EDGE_TOLERANCE
        );
      });

      it('places the avatar after the name', () => {
        assert.ok(avatar.x + avatar.width <= name.x + EDGE_TOLERANCE);
      });

      it('keeps the menu, name and avatar on the top row', () => {
        const onNameRow = (box: BoundingBox): boolean =>
          box.y < name.y + name.height && box.y + box.height > name.y;

        assert.ok(onNameRow(menuButton));
        assert.ok(onNameRow(avatar));
      });
    });

    describe('typography', () => {
      it('renders the account name at the heading size from the type scale', async () => {
        assert.equal(await header.nameFontSize(), HEADING_FONT_SIZE);
      });
    });
  });

  describe('under a name long enough to wrap', () => {
    const { header, menu } = useDriver({ accounts: [longNamedAccount] });

    it('stays one row rather than growing past the menu sheet', async () => {
      const bar = await header.box();

      assert.ok(
        bar.height <= HEADER_LAYOUT.height,
        `bar is ${bar.height}px tall against a ${HEADER_LAYOUT.height}px sheet`
      );
    });

    it('leaves the open menu uncovered, the bar painting above it', async () => {
      await menu.open();

      const bar = await header.box();
      const panel = await menu.panelBox();

      assert.ok(
        bar.y + bar.height <= panel.y,
        `bar reaches ${bar.y + bar.height}px, panel starts at ${panel.y}px`
      );
    });
  });

  describe('on a screen that is not home', () => {
    const { header, menu, method, session } = useDriver({
      accounts: [mockAccount],
    });

    beforeEach(async () => {
      await method.open();
    });

    it('carries the way home without growing the bar the sheet is sized to', async () => {
      assert.equal(await header.homeLinkExists(), true);

      const bar = await header.box();

      assert.ok(
        bar.height <= HEADER_LAYOUT.height,
        `bar is ${bar.height}px tall against a ${HEADER_LAYOUT.height}px sheet`
      );
    });

    it('takes the end edge the avatar holds on home', async () => {
      const bar = await header.box();
      const homeLink = await header.homeLinkBox();
      const distanceFromEndEdge = Math.abs(homeLink.x - bar.x);

      assert.ok(distanceFromEndEdge <= EDGE_TOLERANCE);
    });

    it('stops taking taps once the open menu has hidden it', async () => {
      const homeLink = await header.homeLinkBox();

      await menu.open();

      const takesTap = await session.receivesTapAt({
        testId: HEADER_TEST_IDS.homeLink,
        x: homeLink.x + homeLink.width / 2,
        y: homeLink.y + homeLink.height / 2,
      });

      assert.equal(takesTap, false);
    });
  });
});
