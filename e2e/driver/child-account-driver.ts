import { CHILD_ACCOUNT_TEST_IDS } from '@/components/ChildAccount/constants';
import { PIGGY_BANK_TEST_IDS } from '@/components/ChildAccount/ChildSavings/PiggyBank/constants';
import { COIN_PILE_TEST_IDS } from '@/components/ChildAccount/ChildSavings/PiggyBank/CoinPile/constants';
import { AppBrowser } from './app-browser';

export class ChildAccountDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  screenExists(): Promise<boolean> {
    return this.appBrowser.exists(CHILD_ACCOUNT_TEST_IDS.screen);
  }

  async waitForScreen(): Promise<void> {
    await this.appBrowser.waits.testId(CHILD_ACCOUNT_TEST_IDS.screen);
  }

  piggyBankExists(): Promise<boolean> {
    return this.appBrowser.exists(PIGGY_BANK_TEST_IDS.art);
  }

  coinsInPile(): Promise<number> {
    return this.appBrowser.count(COIN_PILE_TEST_IDS.coin);
  }
}
