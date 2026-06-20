import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useDriver } from './driver/use-driver';
import { BoundingBox } from 'puppeteer';

const EDGE_TOLERANCE = 24;
const CENTER_TOLERANCE = 24;
const HEADING_FONT_SIZE = '22px';

describe('header layout', () => {
  const driver = useDriver();

  let header: BoundingBox, menu: BoundingBox, name: BoundingBox;

  beforeEach(async () => {
    header = await driver.headerBox();
    menu = await driver.menuBox();
    name = await driver.headerNameBox();
  });

  it('places the menu at the start edge (right in RTL)', async () => {
    const headerRight = header.x + header.width;
    const menuRight = menu.x + menu.width;

    assert.ok(Math.abs(headerRight - menuRight) <= EDGE_TOLERANCE);
  });

  it('places the avatar at the end edge (left in RTL)', async () => {
    const avatar = await driver.headerAvatarBox();
    assert.ok(Math.abs(avatar.x - header.x) <= EDGE_TOLERANCE);
  });

  it('centers the account name', async () => {
    const headerCenter = header.x + header.width / 2;
    const nameCenter = name.x + name.width / 2;

    assert.ok(Math.abs(nameCenter - headerCenter) <= CENTER_TOLERANCE);
  });

  it('keeps the menu, name and avatar on the top row', async () => {
    assert.ok(menu.y < name.y + name.height && menu.y + menu.height > name.y);
  });
});

describe('header typography', () => {
  const driver = useDriver();

  it('renders the account name at the heading size from the type scale', async () => {
    assert.equal(await driver.headerNameFontSize(), HEADING_FONT_SIZE);
  });
});
