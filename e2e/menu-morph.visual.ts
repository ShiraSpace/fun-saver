import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useDriver } from './driver/use-driver';

const NO_TRANSFORM = 'none';
const VISIBLE = '1';
const HIDDEN = '0';

describe('menu morph', () => {
  const driver = useDriver();

  it('shows a hamburger when closed', async () => {
    assert.equal(await driver.menuIconTransform(), NO_TRANSFORM);
    assert.equal(await driver.menuMiddleBarOpacity(), VISIBLE);
  });

  it('spins and morphs to a cross when opened', async () => {
    const closedTransform = await driver.menuIconTransform();
    await driver.openMenu();
    const openTransform = await driver.menuIconTransform();

    assert.notEqual(openTransform, closedTransform);
    assert.notEqual(openTransform, NO_TRANSFORM);
    assert.equal(await driver.menuMiddleBarOpacity(), HIDDEN);
  });
});
