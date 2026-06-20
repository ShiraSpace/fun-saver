import puppeteer from 'puppeteer';
import { getDocument, queries } from 'pptr-testing-library';
import assert from 'node:assert/strict';

const { getByTestId, getAllByTestId, findByTestId, findAllByTestId } = queries;
const ACCOUNT_NAME = 'יעל';
const MIN_WALLETS = 3;
const ZERO_BALANCE = /(^|\D)0(\D|$)/;

export async function run(baseUrl: string): Promise<void> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    const documentHandle = await getDocument(page);

    const menuButton = await findByTestId(documentHandle, 'menu-button');
    await menuButton.click();

    const createAccountButton = await findByTestId(
      documentHandle,
      'menu-create-account'
    );
    await createAccountButton.click();

    const nameInput = await findByTestId(documentHandle, 'account-name-input');
    await nameInput.type(ACCOUNT_NAME);

    const [firstAvatar] = await getAllByTestId(documentHandle, 'avatar-option');
    await firstAvatar.click();

    const submit = await getByTestId(documentHandle, 'create-account-submit');
    await submit.click();

    const ribbonName = await findByTestId(documentHandle, 'ribbon-name');
    const renderedName = await ribbonName.evaluate((el) =>
      el.textContent?.trim()
    );
    assert.equal(renderedName, ACCOUNT_NAME, 'ribbon shows account name');

    await findByTestId(documentHandle, 'ribbon-avatar');
    await findByTestId(documentHandle, 'wallet-hero');

    const balanceElements = await findAllByTestId(
      documentHandle,
      'wallet-balance'
    );
    assert.ok(balanceElements.length >= MIN_WALLETS, 'three wallets render');

    for (const element of balanceElements) {
      const text = await element.evaluate((el) => el.textContent ?? '');
      assert.ok(
        ZERO_BALANCE.test(text),
        `new wallet balance reads 0, got "${text}"`
      );
    }
  } finally {
    await browser.close();
  }
}
