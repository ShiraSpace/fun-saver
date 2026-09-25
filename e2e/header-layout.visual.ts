import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { type BoundingBox } from 'puppeteer';
import { TYPE_SCALE } from '@/theme/typography';
import { HEADER_LAYOUT, HEADER_TEST_IDS } from '@/components/Header/constants';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/account/constants';
import {
  createMockAccount,
  mockAccount,
} from '@/test-utils/mocks/general.mocks';
import { useDriver } from './driver/use-driver';

const EDGE_TOLERANCE = 24;
const HEADING_FONT_SIZE = `${TYPE_SCALE.title}px`;

const mockLongNamedAccount = createMockAccount({
  name: 'נועה '.repeat(20).trim().slice(0, MAX_ACCOUNT_NAME_LENGTH),
});

describe('header', () => {
  describe('on home', () => {
    const { header, menu } = useDriver({ accounts: [mockAccount] });

    describe('layout', () => {
      let bar: BoundingBox;
      let menuButton: BoundingBox;
      let title: BoundingBox;
      let avatar: BoundingBox;

      beforeEach(async () => {
        bar = await header.box();
        menuButton = await menu.buttonBox();
        title = await header.titleBox();
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
          Math.abs(title.x + title.width - menuButton.x) <= EDGE_TOLERANCE
        );
      });

      it('places the avatar after the name', () => {
        assert.ok(avatar.x + avatar.width <= title.x + EDGE_TOLERANCE);
      });

      it('keeps the menu, name and avatar on the top row', () => {
        const onNameRow = (box: BoundingBox): boolean =>
          box.y < title.y + title.height && box.y + box.height > title.y;

        assert.ok(onNameRow(menuButton));
        assert.ok(onNameRow(avatar));
      });
    });

    describe('typography', () => {
      it('renders the account name at the heading size from the type scale', async () => {
        assert.equal(await header.titleFontSize(), HEADING_FONT_SIZE);
      });
    });
  });

  describe('under a name long enough to wrap', () => {
    const { header, menu } = useDriver({ accounts: [mockLongNamedAccount] });

    it('stays one row rather than growing past the menu overlay', async () => {
      const bar = await header.box();

      assert.ok(
        bar.height <= HEADER_LAYOUT.height,
        `bar is ${bar.height}px tall against a ${HEADER_LAYOUT.height}px backdrop`
      );
    });

    it('leaves the open menu uncovered, the bar painting above it', async () => {
      await menu.open();

      const bar = await header.box();
      const overlay = await menu.overlayBox();

      assert.ok(
        bar.y + bar.height <= overlay.y,
        `bar reaches ${bar.y + bar.height}px, overlay starts at ${overlay.y}px`
      );
    });
  });

  describe('on a screen that is not home', () => {
    const { header, menu, method, appBrowser } = useDriver({
      accounts: [mockAccount],
    });

    beforeEach(async () => {
      await method.open();
    });

    it('carries the way home without growing the bar the backdrop is sized to', async () => {
      assert.equal(await header.homeLinkExists(), true);

      const bar = await header.box();

      assert.ok(
        bar.height <= HEADER_LAYOUT.height,
        `bar is ${bar.height}px tall against a ${HEADER_LAYOUT.height}px backdrop`
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

      const takesTap = await appBrowser.receivesTapAt({
        testId: HEADER_TEST_IDS.homeLink,
        x: homeLink.x + homeLink.width / 2,
        y: homeLink.y + homeLink.height / 2,
      });

      assert.equal(takesTap, false);
    });

    it('stops taking taps as the menu opens, not once it has finished', async () => {
      const homeLink = await header.homeLinkBox();

      await menu.startOpening();

      const takesTap = await appBrowser.receivesTapAt({
        testId: HEADER_TEST_IDS.homeLink,
        x: homeLink.x + homeLink.width / 2,
        y: homeLink.y + homeLink.height / 2,
      });

      assert.equal(takesTap, false);
    });
  });
});
