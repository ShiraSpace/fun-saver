import type { WalletName } from '@/lib/wallet/types';
import { ACCOUNT_TEST_IDS } from '@/components/Account/constants';
import { WALLET_CARD_TEST_IDS } from '@/components/Account/WalletCard/constants';
import { GOAL_PROGRESS_TEST_IDS } from '@/components/Account/WalletCard/GoalProgress/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '@/components/Account/TransactionDrawer/constants';
import { TRANSACTION_TYPE_TOGGLE_TEST_IDS } from '@/components/Account/TransactionDrawer/TransactionTypeToggle/constants';
import { WALLET_PICKER_TEST_IDS } from '@/components/Account/TransactionDrawer/WalletPicker/constants';
import { WALLET_TILE_TEST_IDS } from '@/components/Account/TransactionDrawer/WalletTile/constants';
import { AMOUNT_KEYPAD_TEST_IDS } from '@/components/Account/TransactionDrawer/AmountKeypad/constants';
import { LOCKED_SAVINGS_TEST_IDS } from '@/components/Account/TransactionDrawer/WithdrawalForm/LockedSavings/constants';
import { WITHDRAWAL_FORM_TEST_IDS } from '@/components/Account/TransactionDrawer/WithdrawalForm/constants';
import { AppBrowser } from './app-browser';

export class GoalDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  goalLine(): Promise<string> {
    return this.appBrowser.text(GOAL_PROGRESS_TEST_IDS.line);
  }

  savingsLockExists(): Promise<boolean> {
    return this.appBrowser.exists(WALLET_CARD_TEST_IDS.lock);
  }

  async startWithdrawal(amountShekels: number): Promise<void> {
    await this.appBrowser.click(ACCOUNT_TEST_IDS.newTransaction);
    await this.appBrowser.click(TRANSACTION_TYPE_TOGGLE_TEST_IDS.withdrawal);

    for (const digit of String(amountShekels)) {
      await this.appBrowser.click(AMOUNT_KEYPAD_TEST_IDS.key(digit));
    }
  }

  pickWallet(walletName: WalletName): Promise<void> {
    return this.appBrowser.click(WALLET_PICKER_TEST_IDS.wallet(walletName));
  }

  async drawerHeight(): Promise<number> {
    return (await this.appBrowser.box(TRANSACTION_DRAWER_TEST_IDS.drawer))
      .height;
  }

  submit(): Promise<void> {
    return this.appBrowser.click(TRANSACTION_DRAWER_TEST_IDS.submit);
  }

  lockedWalletCount(): Promise<number> {
    return this.appBrowser.count(WALLET_TILE_TEST_IDS.lock);
  }

  waitForLockedSavings(): Promise<void> {
    return this.appBrowser.waitForAnyTestId([LOCKED_SAVINGS_TEST_IDS.panel]);
  }

  submitLabel(): Promise<string> {
    return this.appBrowser.text(TRANSACTION_DRAWER_TEST_IDS.submit);
  }

  completesGoalNoteExists(): Promise<boolean> {
    return this.appBrowser.exists(WITHDRAWAL_FORM_TEST_IDS.completesGoal);
  }
}
