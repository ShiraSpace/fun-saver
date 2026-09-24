import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-utils/fixtures';
import { SUNSHINE_QUEST_COLORS } from '@/theme/palette';
import { hexToRgb } from '@/test-utils/css-color';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { HOME_ROUTE } from '@/components/Home/constants';
import { useDriver } from './driver/use-driver';

describe('page routing', () => {
  describe('with no accounts', () => {
    const { header, emptyState } = useDriver();

    it('shows the empty state, and the header that carries the way out', async () => {
      assert.equal(await emptyState.exists(), true);
      assert.equal(await header.exists(), true);
    });
  });

  describe('with an account', () => {
    const { header, emptyState } = useDriver({ accounts: [mockAccount] });

    it('shows the header and not the empty state', async () => {
      assert.equal(await header.exists(), true);
      assert.equal(await emptyState.exists(), false);
    });
  });

  describe('the method page', () => {
    const { menu } = useDriver({ accounts: [mockAccount] });

    it('is where the menu link takes the parent', async () => {
      await menu.open();

      assert.equal(await menu.openMethodPage(), METHOD_ROUTE);
    });

    it('tells the parent which screen they are on once they are there', async () => {
      await menu.open();
      await menu.openMethodPage();
      await menu.open();

      assert.equal(
        await menu.methodTabBackground(),
        hexToRgb(SUNSHINE_QUEST_COLORS.textStrong)
      );
    });
  });

  describe('the method page with no account to show', () => {
    const { appBrowser } = useDriver();

    it('sends the parent home, where the empty state asks for one', async () => {
      await appBrowser.visit(METHOD_ROUTE);

      assert.equal(appBrowser.currentPath(), HOME_ROUTE);
    });
  });
});
