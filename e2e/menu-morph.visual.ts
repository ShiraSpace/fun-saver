import puppeteer, { type Page } from 'puppeteer';
import assert from 'node:assert/strict';
import { withServer } from './server';

const MENU_BUTTON = '[data-testid="menu-button"]';
const MENU_ICON = '[data-testid="menu-icon"]';
const MIDDLE_BAR = '[data-testid="menu-icon"] > span:nth-of-type(2)';
const NO_TRANSFORM = 'none';
const VISIBLE = '1';
const HIDDEN = '0';

async function main(): Promise<void> {
  await withServer(async ({ baseUrl }) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 420, height: 320 });
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });

      const transformClosed = await computedStyle(page, MENU_ICON, 'transform');
      assert.equal(transformClosed, NO_TRANSFORM, 'icon is not rotated when closed');
      assert.equal(
        await computedStyle(page, MIDDLE_BAR, 'opacity'),
        VISIBLE,
        'middle bar is visible when closed'
      );

      await page.click(MENU_BUTTON);
      await page.waitForFunction(
        (selector: string) =>
          getComputedStyle(document.querySelector(selector) as Element).opacity === '0',
        {},
        MIDDLE_BAR
      );

      const transformOpen = await computedStyle(page, MENU_ICON, 'transform');
      assert.notEqual(transformOpen, NO_TRANSFORM, 'icon spins when open');
      assert.notEqual(transformOpen, transformClosed, 'icon transform changes on open');
      assert.equal(
        await computedStyle(page, MIDDLE_BAR, 'opacity'),
        HIDDEN,
        'middle bar fades to form the cross'
      );

      console.log('VISUAL PASS: hamburger spins and morphs to a cross on open');
    } finally {
      await browser.close();
    }
  });
}

async function computedStyle(page: Page, selector: string, property: string): Promise<string> {
  return page.$eval(
    selector,
    (el, prop) => getComputedStyle(el).getPropertyValue(prop),
    property
  );
}

main().catch((error) => {
  console.error('VISUAL FAIL:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
