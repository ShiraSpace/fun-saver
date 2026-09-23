import { beforeEach, describe, it } from 'node:test';
import { type BoundingBox } from 'puppeteer';
import assert from 'node:assert/strict';
import { StatusCodes } from 'http-status-codes';
import { HOME_ROUTE } from '@/components/Home/constants';
import { LOGIN_PATH } from '@/lib/constants';
import { ACCOUNT_TEST_IDS } from '@/components/Account/constants';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { METHOD_COPY } from '@/components/Method/copy';
import { METHOD_SECTION_TEST_IDS } from '@/components/Method/MethodSection/constants';
import { mockAccount } from '@/test-utils/fixtures';
import { hexToRgb } from '@/test-utils/css-color';
import { THEMES, THEME_ID } from '@/theme/registry';
import type { HeldPage } from './driver/hold-next-page';
import { SESSION_COOKIE_NAME } from './driver/auth-session';
import { useDriver } from './driver/use-driver';

describe('waiting for a page', () => {
  const { session, menu, header, loadingShell } = useDriver({
    accounts: [mockAccount],
  });

  describe('on a first load', () => {
    it('sends the shell ahead of the page', async () => {
      const positions = await loadingShell.positionsOnFirstLoad(
        HOME_ROUTE,
        ACCOUNT_TEST_IDS.actionCta
      );

      assert.ok(positions.shell >= 0, 'the first load carries no shell');
      assert.ok(
        positions.page > positions.shell,
        'the page markup arrives before the shell'
      );
    });

    it('turns a bad session away with a redirect, before any shell is sent', async () => {
      const response = await session.rawResponse(
        HOME_ROUTE,
        `${SESSION_COOKIE_NAME}=not-a-session`
      );

      assert.equal(response.status, StatusCodes.TEMPORARY_REDIRECT);
      assert.equal(response.redirectPath, LOGIN_PATH);
    });
  });

  describe('the shell, held on screen', () => {
    let realHeader: BoundingBox;

    beforeEach(async () => {
      realHeader = await header.box();
      await loadingShell.keepOnScreen(HOME_ROUTE);
    });

    it('sits exactly where the header will land', async () => {
      assert.deepEqual(await loadingShell.cardBox(), realHeader);
    });

    it('paints the theme the document carries, not the default', async () => {
      await session.setDocumentTheme(THEME_ID.midnightBlue);

      assert.equal(
        await loadingShell.cardBackground(),
        hexToRgb(THEMES[THEME_ID.midnightBlue].colors.surface)
      );
    });
  });

  const journeys = [
    {
      name: 'from home to the method page',
      start: HOME_ROUTE,
      leavingPage: ACCOUNT_TEST_IDS.actionCta,
      arrivingTitle: METHOD_COPY.title,
      leave: async (): Promise<void> => {
        await menu.open();
        await menu.tapMethodTab();
      },
    },
    {
      name: 'from the method page back home',
      start: METHOD_ROUTE,
      leavingPage: METHOD_SECTION_TEST_IDS.section(1),
      arrivingTitle: mockAccount.name,
      leave: (): Promise<void> => header.tapHomeLink(),
    },
  ];

  describe('tapping home twice before the page lands', () => {
    beforeEach(async () => {
      await session.visit(METHOD_ROUTE);
      const nextPage = await session.holdNextPage();

      await menu.open();
      await menu.tapHomeTab();
      await nextPage.waiting;
      await header.tapHomeLink();
      await nextPage.settle();
    });

    it('keeps the line on the header', async () => {
      assert.equal(await header.hasProgressLine(), true);
    });
  });

  for (const journey of journeys) {
    describe(journey.name, () => {
      let nextPage: HeldPage;

      beforeEach(async () => {
        await session.visit(journey.start);
        nextPage = await session.holdNextPage();

        await journey.leave();
        await nextPage.waiting;
      });

      it('keeps the page it is leaving on screen', async () => {
        assert.equal(await session.exists(journey.leavingPage), true);
      });

      it('does not put the shell in its place', async () => {
        assert.equal(await loadingShell.exists(), false);
      });

      it('shows the line on the header', async () => {
        assert.equal(await header.hasProgressLine(), true);
      });

      it('takes the line away once the page lands', async () => {
        nextPage.release();
        await header.waitForName(journey.arrivingTitle);

        assert.equal(await header.hasProgressLine(), false);
      });
    });
  }
});
