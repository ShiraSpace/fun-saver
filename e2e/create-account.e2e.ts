import assert from 'node:assert/strict';
import { Driver } from './driver/driver';

const ACCOUNT_NAME = 'יעל';
const MIN_WALLETS = 3;
const ZERO_BALANCE = /(^|\D)0(\D|$)/;

export async function run(baseUrl: string): Promise<void> {
  const driver = await Driver.launch(baseUrl);
  try {
    await driver.createAccount({ name: ACCOUNT_NAME });

    assert.equal(await driver.readHeaderName(), ACCOUNT_NAME, 'header shows account name');
    await driver.waitForHeaderAvatar();
    await driver.waitForSavingsHero();

    const balances = await driver.readWalletBalances();
    assert.ok(balances.length >= MIN_WALLETS, 'three wallets render');
    for (const balance of balances) {
      assert.ok(ZERO_BALANCE.test(balance), `new wallet balance reads 0, got "${balance}"`);
    }
  } finally {
    await driver.leave();
  }
}
