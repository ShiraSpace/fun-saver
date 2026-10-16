import { CHILD_ACCOUNT_TEST_IDS } from '@/components/ChildAccount/constants';
import { PIGGY_BANK_TEST_IDS } from '@/components/ChildAccount/ChildSavings/PiggyBank/constants';
import { COIN_PILE_TEST_IDS } from '@/components/ChildAccount/ChildSavings/PiggyBank/CoinPile/constants';
import { type BoundingBox } from 'puppeteer';
import { GOAL_PROGRESS_TEST_IDS } from '@/components/Goal/GoalProgress/constants';
import { SAVED_OUT_OF_GOAL_TEST_IDS } from '@/components/Goal/SavedOutOfGoal/constants';
import { INTEREST_COINS_TEST_IDS } from '@/components/ChildAccount/ChildSavings/InterestCoins/constants';
import { SAVINGS_BALANCE_TEST_IDS } from '@/components/ChildAccount/ChildSavings/SavingsBalance/constants';
import { AppBrowser } from './app-browser';
import { bottomOf } from './box-geometry';

const NORMAL_LINE_HEIGHT = 1.2;
const INTEREST_COIN = `[data-testid="${INTEREST_COINS_TEST_IDS.coin}"]`;

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

  coinsDrawnInPile(): Promise<number> {
    return this.appBrowser.count(COIN_PILE_TEST_IDS.coin);
  }

  async walletsBottom(): Promise<number> {
    return bottomOf(await this.appBrowser.box(CHILD_ACCOUNT_TEST_IDS.wallets));
  }

  async waitForGoal(): Promise<void> {
    await this.appBrowser.waits.testId(GOAL_PROGRESS_TEST_IDS.heading);
  }

  goalAmountsBox(): Promise<BoundingBox> {
    return this.appBrowser.box(SAVED_OUT_OF_GOAL_TEST_IDS.amounts);
  }

  async goalAmountsLines(): Promise<number> {
    const amounts = await this.goalAmountsBox();
    const fontSize = await this.appBrowser.computedStyle(
      SAVED_OUT_OF_GOAL_TEST_IDS.amounts,
      'font-size'
    );

    return Math.round(amounts.height / (parseFloat(fontSize) * NORMAL_LINE_HEIGHT));
  }

  async waitForInterestCoins(): Promise<void> {
    await this.appBrowser.waits.anyTestId([INTEREST_COINS_TEST_IDS.coin]);
  }

  tapTheCoins(): Promise<string> {
    return this.appBrowser.text(INTEREST_COINS_TEST_IDS.copy);
  }

  interestCoinCount(): Promise<number> {
    return this.appBrowser.count(INTEREST_COINS_TEST_IDS.coin);
  }

  async tapInterestCoin(coinIndex: number): Promise<void> {
    const coinsBefore = await this.interestCoinCount();
    await this.appBrowser.clickNth(INTEREST_COIN, coinIndex);
    await this.appBrowser.waits.count(INTEREST_COINS_TEST_IDS.coin, coinsBefore - 1);
  }

  savingsBalance(): Promise<string> {
    return this.appBrowser.text(SAVINGS_BALANCE_TEST_IDS.balance);
  }
}
