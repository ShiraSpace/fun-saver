import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-utils/fixtures';
import { THEME_ID } from '@/theme/registry';
import { useDriver } from './driver/use-driver';

describe('the theme at first paint', () => {
  const { appBrowser } = useDriver({ accounts: [mockAccount] });

  beforeEach(async () => {
    await appBrowser.storeTheme(THEME_ID.midnightBlue);
    await appBrowser.reload();
  });

  it('paints the stored theme before the app takes over', async () => {
    assert.equal(await appBrowser.firstPaintThemeId(), THEME_ID.midnightBlue);
  });
});
