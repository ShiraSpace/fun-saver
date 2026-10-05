import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { type BoundingBox } from 'puppeteer';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { VIEW_MODE } from '@/lib/account/view-mode';
import { THEMES, THEME_ID } from '@/theme/registry';
import { hexToRgb } from '@/test-utils/css-color';
import { useDriver } from './driver/use-driver';
import { PHONE } from './driver/viewports';

const bottomOf = (box: BoundingBox): number => box.y + box.height;
const rightOf = (box: BoundingBox): number => box.x + box.width;

const holds = (outer: BoundingBox, inner: BoundingBox): boolean =>
  inner.x >= outer.x &&
  rightOf(inner) <= rightOf(outer) &&
  inner.y >= outer.y &&
  bottomOf(inner) <= bottomOf(outer);

const mockMidnightAccount = { ...mockAccount, themeId: THEME_ID.midnightBlue };
const MIDNIGHT_PRIMARY = hexToRgb(THEMES[THEME_ID.midnightBlue].colors.primary);
const MIDNIGHT_DIVIDER = hexToRgb(THEMES[THEME_ID.midnightBlue].colors.divider);

describe('the parent menu at phone size', () => {
  const { appBrowser, menu } = useDriver({ accounts: [mockMidnightAccount] });

  beforeEach(async () => {
    await appBrowser.resize(PHONE);
    await menu.open();
  });

  it("puts «הגדרות כלליות» below the account's settings", async () => {
    const accountSettings = await menu.accountScopeBox();
    const globalSettings = await menu.globalSettingsBox();

    assert.ok(
      globalSettings.y >= bottomOf(accountSettings),
      `global settings start at ${globalSettings.y}, account settings end at ${bottomOf(accountSettings)}`
    );
  });

  it('keeps the whole track inside «הגדרות כלליות»', async () => {
    const globalSettings = await menu.globalSettingsBox();
    const track = await menu.viewModeSwitchTrackBox();

    assert.ok(holds(globalSettings, track));
  });

  it("leaves the track off, in the account's theme", async () => {
    assert.equal(await menu.viewModeSwitchTrackBackground(), MIDNIGHT_DIVIDER);
  });
});

describe('the child menu at phone size', () => {
  const { appBrowser, menu } = useDriver(
    { accounts: [mockMidnightAccount] },
    { viewMode: VIEW_MODE.child }
  );

  beforeEach(async () => {
    await appBrowser.resize(PHONE);
    await menu.open();
  });

  it('puts the switch card below «מראה»', async () => {
    const appearance = await menu.appearanceSectionBox();
    const viewModeSwitch = await menu.viewModeSwitchBox();

    assert.ok(viewModeSwitch.y >= bottomOf(appearance));
  });

  it('keeps the switch on screen without scrolling', async () => {
    const viewModeSwitch = await menu.viewModeSwitchBox();

    assert.ok(
      bottomOf(viewModeSwitch) <= PHONE.height,
      `the switch ends at ${bottomOf(viewModeSwitch)}, the screen at ${PHONE.height}`
    );
  });

  it("turns the track on, in the account's theme", async () => {
    assert.equal(await menu.viewModeSwitchTrackBackground(), MIDNIGHT_PRIMARY);
  });
});
