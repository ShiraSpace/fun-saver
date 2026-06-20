import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useDriver } from './driver/use-driver';

const ACCOUNT_NAME = 'יעל';
const MIN_WALLETS = 3;
const ZERO_BALANCE = /(^|\D)0(\D|$)/;

describe('create account', () => {
  const driver = useDriver();

  it('opens the dashboard with the new account and three zero wallets', async () => {
    await driver.createAccount({ name: ACCOUNT_NAME });

    assert.equal(
      await driver.readHeaderName(),
      ACCOUNT_NAME,
      'header shows account name'
    );

    const balances = await driver.readWalletBalances();

    assert.ok(balances.length >= MIN_WALLETS, 'three wallets render');

    for (const balance of balances) {
      assert.ok(
        ZERO_BALANCE.test(balance),
        `wallet balance reads 0, got "${balance}"`
      );
    }
  });
});
