import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { METHOD_COPY } from '@/components/Method/copy';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { HOME_ROUTE } from '@/components/Home/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '@/components/Account/TransactionDrawer/constants';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { splitDeposit } from '@/lib/transaction/transactions';
import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { useDriver, type AppDriver } from './driver/use-driver';

async function cameHomeFromTheMethodPage({
  menu,
  account,
}: AppDriver): Promise<void> {
  await menu.open();
  await menu.openMethodPage();
  await menu.open();
  await menu.tapHomeTab();
  await account.waitForOverview();
}

describe('a parent closes the transaction drawer, then presses back', () => {
  const driver = useDriver({ accounts: [mockAccount] });

  beforeEach(async () => {
    await cameHomeFromTheMethodPage(driver);
    await driver.account.openTransactionDrawer();
    await driver.account.closeTransactionDrawer();
    await driver.appBrowser.back();
    await driver.header.waitForTitle(METHOD_COPY.title);
  });

  it('goes back to the page before', () => {
    assert.equal(driver.appBrowser.currentPath(), METHOD_ROUTE);
  });
});

describe('a parent reloads with the drawer open, opens it again, then presses back', () => {
  const driver = useDriver({ accounts: [mockAccount] });

  beforeEach(async () => {
    await driver.account.openTransactionDrawer();
    await driver.appBrowser.reload();
    await driver.account.waitForOverview();
    await driver.account.openTransactionDrawer();
    await driver.appBrowser.back();
    await driver.appBrowser.waits.testIdGone(
      TRANSACTION_DRAWER_TEST_IDS.drawer
    );
  });

  it('stays on the home page', () => {
    assert.equal(driver.appBrowser.currentPath(), HOME_ROUTE);
  });
});

describe('a parent saves a deposit, then presses back', () => {
  const driver = useDriver({ accounts: [mockAccount] });

  beforeEach(async () => {
    await cameHomeFromTheMethodPage(driver);
    const mockDepositShekels = 50;
    await driver.account.deposit(mockDepositShekels);
    await driver.account.waitForSavingsPrincipal(
      String(
        agorotToShekels(
          splitDeposit(mockDepositShekels * AGOROT_PER_SHEKEL).savings
        )
      )
    );
    await driver.appBrowser.back();
    await driver.header.waitForTitle(METHOD_COPY.title);
  });

  it('goes back to the page before', () => {
    assert.equal(driver.appBrowser.currentPath(), METHOD_ROUTE);
  });
});
