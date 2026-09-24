import { BALANCE_BREAKDOWN_TEST_IDS } from '@/components/Account/BalanceBreakdown/constants';
import { INTEREST_STATS_TEST_IDS } from '@/components/Account/WalletCard/InterestStats/constants';
import { WALLET_LIST_TEST_IDS } from '@/components/Account/WalletList/constants';
import { WALLET_CARD_TEST_IDS } from '@/components/Account/WalletCard/constants';
import { ACCOUNT_TEST_IDS } from '@/components/Account/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '@/components/Account/TransactionDrawer/constants';
import { TRANSACTION_TYPE_TOGGLE_TEST_IDS } from '@/components/Account/TransactionDrawer/TransactionTypeToggle/constants';
import { WALLET_PICKER_TEST_IDS } from '@/components/Account/TransactionDrawer/WalletPicker/constants';
import { AMOUNT_KEYPAD_TEST_IDS } from '@/components/Account/TransactionDrawer/AmountKeypad/constants';
import { Session } from './session';

export class DashboardDriver {
  constructor(private readonly session: Session) {}

  overviewExists(): Promise<boolean> {
    return this.session.exists(BALANCE_BREAKDOWN_TEST_IDS.card);
  }

  savingsTodayInterest(): Promise<string> {
    return this.session.text(INTEREST_STATS_TEST_IDS.todayInterest);
  }

  supportingLabel(): Promise<string> {
    return this.session.text(WALLET_LIST_TEST_IDS.label);
  }

  walletCardCount(): Promise<number> {
    return this.session.count(WALLET_CARD_TEST_IDS.card);
  }

  arcAnimations(): Promise<string[]> {
    return this.session.styleValues(
      BALANCE_BREAKDOWN_TEST_IDS.arc,
      'animation-name'
    );
  }

  walletSummaries(): Promise<string[]> {
    return this.session.texts(WALLET_CARD_TEST_IDS.summary);
  }

  walletBalances(): Promise<string[]> {
    return this.session.texts(WALLET_CARD_TEST_IDS.balance);
  }

  savingsPrincipal(): Promise<string> {
    return this.session.text(INTEREST_STATS_TEST_IDS.principal);
  }

  async deposit(amountShekels: number): Promise<void> {
    await this.session.click(ACCOUNT_TEST_IDS.newTransaction);
    for (const digit of String(amountShekels)) {
      await this.session.click(AMOUNT_KEYPAD_TEST_IDS.key(digit));
    }
    await this.session.click(TRANSACTION_DRAWER_TEST_IDS.submit);
  }

  async withdraw(walletName: string, amountShekels: number): Promise<void> {
    await this.session.click(ACCOUNT_TEST_IDS.newTransaction);
    await this.session.click(TRANSACTION_TYPE_TOGGLE_TEST_IDS.withdrawal);
    await this.session.click(WALLET_PICKER_TEST_IDS.wallet(walletName));

    for (const digit of String(amountShekels)) {
      await this.session.click(AMOUNT_KEYPAD_TEST_IDS.key(digit));
    }

    await this.session.click(TRANSACTION_DRAWER_TEST_IDS.submit);
  }

  waitForSavingsPrincipal(value: string): Promise<void> {
    return this.session.waitForText(INTEREST_STATS_TEST_IDS.principal, value);
  }
}
