import type { WalletName } from '@/lib/wallet/types';
import { BALANCE_BREAKDOWN_TEST_IDS } from '@/components/Account/BalanceBreakdown/constants';
import { INTEREST_STATS_TEST_IDS } from '@/components/Account/WalletCard/InterestStats/constants';
import { WALLET_LIST_TEST_IDS } from '@/components/Account/WalletList/constants';
import { WALLET_CARD_TEST_IDS } from '@/components/Account/WalletCard/constants';
import { ACCOUNT_TEST_IDS } from '@/components/Account/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '@/components/Account/TransactionDrawer/constants';
import { TRANSACTION_TYPE_TOGGLE_TEST_IDS } from '@/components/Account/TransactionDrawer/TransactionTypeToggle/constants';
import { WALLET_PICKER_TEST_IDS } from '@/components/Account/TransactionDrawer/WalletPicker/constants';
import { AMOUNT_KEYPAD_TEST_IDS } from '@/components/Account/TransactionDrawer/AmountKeypad/constants';
import { AppBrowser } from './app-browser';

export class AccountDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  overviewExists(): Promise<boolean> {
    return this.appBrowser.exists(BALANCE_BREAKDOWN_TEST_IDS.card);
  }

  savingsTodayInterest(): Promise<string> {
    return this.appBrowser.text(INTEREST_STATS_TEST_IDS.interestEarnedToday);
  }

  walletListLabel(): Promise<string> {
    return this.appBrowser.text(WALLET_LIST_TEST_IDS.label);
  }

  walletCardCount(): Promise<number> {
    return this.appBrowser.count(WALLET_CARD_TEST_IDS.card);
  }

  walletShareAnimations(): Promise<string[]> {
    return this.appBrowser.styleValues(
      BALANCE_BREAKDOWN_TEST_IDS.arc,
      'animation-name'
    );
  }

  walletSummaries(): Promise<string[]> {
    return this.appBrowser.texts(WALLET_CARD_TEST_IDS.summary);
  }

  walletBalances(): Promise<string[]> {
    return this.appBrowser.texts(WALLET_CARD_TEST_IDS.balance);
  }

  savingsPrincipal(): Promise<string> {
    return this.appBrowser.text(INTEREST_STATS_TEST_IDS.principal);
  }

  async deposit(amountShekels: number): Promise<void> {
    await this.appBrowser.click(ACCOUNT_TEST_IDS.newTransaction);
    for (const digit of String(amountShekels)) {
      await this.appBrowser.click(AMOUNT_KEYPAD_TEST_IDS.key(digit));
    }
    await this.appBrowser.click(TRANSACTION_DRAWER_TEST_IDS.submit);
  }

  async withdraw(walletName: WalletName, amountShekels: number): Promise<void> {
    await this.appBrowser.click(ACCOUNT_TEST_IDS.newTransaction);
    await this.appBrowser.click(TRANSACTION_TYPE_TOGGLE_TEST_IDS.withdrawal);
    await this.appBrowser.click(WALLET_PICKER_TEST_IDS.wallet(walletName));

    for (const digit of String(amountShekels)) {
      await this.appBrowser.click(AMOUNT_KEYPAD_TEST_IDS.key(digit));
    }

    await this.appBrowser.click(TRANSACTION_DRAWER_TEST_IDS.submit);
  }

  waitForSavingsPrincipal(value: string): Promise<void> {
    return this.appBrowser.waitForText(
      INTEREST_STATS_TEST_IDS.principal,
      value
    );
  }
}
