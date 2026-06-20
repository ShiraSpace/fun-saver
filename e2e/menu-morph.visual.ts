import assert from 'node:assert/strict';
import { Driver } from './driver/driver';
import { withServer } from './server';

const NO_TRANSFORM = 'none';
const VISIBLE = '1';
const HIDDEN = '0';

async function main(): Promise<void> {
  await withServer(async ({ baseUrl }) => {
    const driver = await Driver.launch(baseUrl);
    try {
      const closedTransform = await driver.menuIconTransform();
      assert.equal(closedTransform, NO_TRANSFORM, 'icon is not rotated when closed');
      assert.equal(await driver.menuMiddleBarOpacity(), VISIBLE, 'middle bar is visible when closed');

      await driver.openMenu();

      const openTransform = await driver.menuIconTransform();
      assert.notEqual(openTransform, closedTransform, 'icon transform changes on open');
      assert.notEqual(openTransform, NO_TRANSFORM, 'icon spins when open');
      assert.equal(await driver.menuMiddleBarOpacity(), HIDDEN, 'middle bar fades to form the cross');

      console.log('VISUAL PASS: hamburger spins and morphs to a cross on open');
    } finally {
      await driver.leave();
    }
  });
}

main().catch((error) => {
  console.error('VISUAL FAIL:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
