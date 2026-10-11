import type { WalletName } from '@/lib/wallet/types';
import { ACCOUNT_TEST_IDS } from '@/components/Account/constants';
import { WALLET_CARD_TEST_IDS } from '@/components/Account/WalletCard/constants';
import { GOAL_LINE_TEST_IDS } from '@/components/Account/WalletCard/GoalLine/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '@/components/Account/TransactionDrawer/constants';
import { TRANSACTION_TYPE_TOGGLE_TEST_IDS } from '@/components/Account/TransactionDrawer/TransactionTypeToggle/constants';
import { WALLET_PICKER_TEST_IDS } from '@/components/Account/TransactionDrawer/WalletPicker/constants';
import { WALLET_TILE_TEST_IDS } from '@/components/Account/TransactionDrawer/WalletTile/constants';
import { AMOUNT_KEYPAD_TEST_IDS } from '@/components/Account/TransactionDrawer/AmountKeypad/constants';
import { LOCKED_SAVINGS_TEST_IDS } from '@/components/Account/TransactionDrawer/WithdrawalForm/LockedSavings/constants';
import { WITHDRAWAL_FORM_TEST_IDS } from '@/components/Account/TransactionDrawer/WithdrawalForm/constants';
import { MENU_GOAL_TEST_IDS } from '@/components/Menu/MenuGoal/constants';
import { VIEW_GOAL_TEST_IDS } from '@/components/Goal/ViewGoal/constants';
import { SAVINGS_LOCK_TEST_IDS } from '@/components/Goal/ViewGoal/SavingsLock/constants';
import { CLOSE_BUTTON_TEST_IDS } from '@/components/CloseButton/constants';
import { AppBrowser } from './app-browser';
import { holds } from './box-geometry';

export class GoalDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  goalLine(): Promise<string> {
    return this.appBrowser.text(GOAL_LINE_TEST_IDS.line);
  }

  tapGoalLine(): Promise<void> {
    return this.appBrowser.click(GOAL_LINE_TEST_IDS.line);
  }

  tapMenuGoal(): Promise<void> {
    return this.appBrowser.click(MENU_GOAL_TEST_IDS.row);
  }

  waitForGoalScreen(): Promise<void> {
    return this.appBrowser.waits.testId(VIEW_GOAL_TEST_IDS.container);
  }

  waitForGoalScreenGone(): Promise<void> {
    return this.appBrowser.waits.testIdGone(VIEW_GOAL_TEST_IDS.container);
  }

  goalScreenExists(): Promise<boolean> {
    return this.appBrowser.exists(VIEW_GOAL_TEST_IDS.container);
  }

  tapCloseGoalScreen(): Promise<void> {
    return this.appBrowser.click(CLOSE_BUTTON_TEST_IDS.button);
  }

  goalScreenSavingsLock(): Promise<string> {
    return this.appBrowser.text(SAVINGS_LOCK_TEST_IDS.label);
  }

  savingsLockExists(): Promise<boolean> {
    return this.appBrowser.exists(WALLET_CARD_TEST_IDS.lock);
  }

  async startWithdrawal(amountShekels: number): Promise<void> {
    await this.appBrowser.click(ACCOUNT_TEST_IDS.newTransaction);
    await this.appBrowser.click(TRANSACTION_TYPE_TOGGLE_TEST_IDS.withdrawal);
    await this.typeAmount(amountShekels);
  }

  async typeAmount(digits: number | string): Promise<void> {
    for (const digit of String(digits)) {
      await this.appBrowser.click(AMOUNT_KEYPAD_TEST_IDS.key(digit));
    }
  }

  pickWallet(walletName: WalletName): Promise<void> {
    return this.appBrowser.click(WALLET_PICKER_TEST_IDS.wallet(walletName));
  }

  async drawerHeight(): Promise<number> {
    return (await this.appBrowser.box(TRANSACTION_DRAWER_TEST_IDS.drawer)).height;
  }

  submit(): Promise<void> {
    return this.appBrowser.click(TRANSACTION_DRAWER_TEST_IDS.submit);
  }

  lockedWalletCount(): Promise<number> {
    return this.appBrowser.count(WALLET_TILE_TEST_IDS.lock);
  }

  waitForLockedSavings(): Promise<void> {
    return this.appBrowser.waits.testId(LOCKED_SAVINGS_TEST_IDS.panel);
  }

  submitLabel(): Promise<string> {
    return this.appBrowser.text(TRANSACTION_DRAWER_TEST_IDS.submit);
  }

  completesGoalNoteExists(): Promise<boolean> {
    return this.appBrowser.exists(WITHDRAWAL_FORM_TEST_IDS.completesGoal);
  }

  waitForCompletesGoalNote(): Promise<void> {
    return this.appBrowser.waits.testId(WITHDRAWAL_FORM_TEST_IDS.completesGoal);
  }

  waitForOverdraft(): Promise<void> {
    return this.appBrowser.waits.testId(WITHDRAWAL_FORM_TEST_IDS.overdraft);
  }

  async submitShowsWhole(): Promise<boolean> {
    const drawer = await this.appBrowser.box(TRANSACTION_DRAWER_TEST_IDS.drawer);
    const submit = await this.appBrowser.box(TRANSACTION_DRAWER_TEST_IDS.submit);

    return holds(drawer, submit);
  }
}
