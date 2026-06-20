import puppeteer from 'puppeteer';
import { getDocument, queries } from 'pptr-testing-library';
import assert from 'node:assert/strict';

const { getByTestId, getAllByTestId, findByTestId, findAllByTestId } = queries;
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3987';
const ACCOUNT_NAME = 'נועה';
const MIN_WALLETS = 3;
const ZERO_BALANCE = /(^|\D)0(\D|$)/;

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    const document = await getDocument(page);

    const menuButton = await findByTestId(document, 'menu-button');
    await menuButton.click();

    const createAccountButton = await findByTestId(document, 'menu-create-account');
    await createAccountButton.click();

    const nameInput = await findByTestId(document, 'account-name-input');
    await nameInput.type(ACCOUNT_NAME);

    const [firstAvatar] = await getAllByTestId(document, 'avatar-option');
    await firstAvatar.click();

    const submit = await getByTestId(document, 'create-account-submit');
    await submit.click();

    const ribbonName = await findByTestId(document, 'ribbon-name');
    const renderedName = await ribbonName.evaluate((el) => el.textContent?.trim());
    assert.equal(renderedName, ACCOUNT_NAME, 'ribbon shows account name');

    await findByTestId(document, 'ribbon-avatar');
    await findByTestId(document, 'wallet-hero');

    const balanceElements = await findAllByTestId(document, 'wallet-balance');
    assert.ok(balanceElements.length >= MIN_WALLETS, 'three wallets render');
    for (const element of balanceElements) {
      const text = await element.evaluate((el) => el.textContent ?? '');
      assert.ok(ZERO_BALANCE.test(text), `new wallet balance reads 0, got "${text}"`);
    }

    console.log('E2E PASS: open menu → create account → dashboard with 3 zero wallets');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('E2E FAIL:', err.message);
  process.exit(1);
});
