import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3987';

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    await page.waitForSelector('[data-testid="empty-state"]');
    await page.type('[data-testid="account-name-input"]', 'נועה');
    await page.click('[data-testid="avatar-option"]');
    await page.click('[data-testid="create-account-submit"]');

    await page.waitForSelector('[data-testid="ribbon-name"]');
    const name = await page.$eval('[data-testid="ribbon-name"]', (el) => el.textContent);
    assert.equal(name?.trim(), 'נועה', 'ribbon shows account name');

    await page.waitForSelector('[data-testid="ribbon-avatar"]');
    await page.waitForSelector('[data-testid="wallet-hero"]');

    const balances = await page.$$eval('[data-testid="wallet-balance"]', (els) =>
      els.map((el) => el.textContent ?? ''),
    );
    assert.ok(balances.length >= 3, 'three wallets render');
    for (const b of balances) {
      assert.ok(/(^|\D)0(\D|$)/.test(b), `new wallet balance reads 0, got "${b}"`);
    }
    console.log('E2E PASS: create account → dashboard with 3 zero wallets');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('E2E FAIL:', err.message);
  process.exit(1);
});
