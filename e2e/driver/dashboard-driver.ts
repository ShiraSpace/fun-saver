import { WALLET_HERO_TEST_IDS } from '@/components/Account/WalletHero/constants';
import { COIN_ROW_TEST_IDS } from '@/components/Account/CoinRow/constants';
import { WALLET_LIST_TEST_IDS } from '@/components/Account/WalletList/constants';
import { WALLET_CARD_TEST_IDS } from '@/components/Account/WalletCard/constants';
import { ACCOUNT_TEST_IDS } from '@/components/Account/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '@/components/Account/TransactionDrawer/constants';
import { AMOUNT_PAD_TEST_IDS } from '@/components/Account/TransactionDrawer/AmountPad/constants';
import { Session } from './session';

export class DashboardDriver {
  constructor(private readonly session: Session) {}

  heroExists(): Promise<boolean> {
    return this.session.exists(WALLET_HERO_TEST_IDS.hero);
  }

  dailyRowExists(): Promise<boolean> {
    return this.session.exists(COIN_ROW_TEST_IDS.row);
  }

  supportingLabel(): Promise<string> {
    return this.session.text(WALLET_LIST_TEST_IDS.label);
  }

  walletCardCount(): Promise<number> {
    return this.session.count(WALLET_CARD_TEST_IDS.card);
  }

  walletBalances(): Promise<string[]> {
    return this.session.texts(WALLET_CARD_TEST_IDS.balance);
  }

  savingsDeposits(): Promise<string> {
    return this.session.text(WALLET_HERO_TEST_IDS.deposits);
  }

  async deposit(amountShekels: number): Promise<void> {
    await this.session.click(ACCOUNT_TEST_IDS.actionCta);
    for (const digit of String(amountShekels)) {
      await this.session.click(AMOUNT_PAD_TEST_IDS.key(digit));
    }
    await this.session.click(TRANSACTION_DRAWER_TEST_IDS.confirm);
  }

  waitForSavingsDeposits(value: string): Promise<void> {
    return this.session.waitForText(WALLET_HERO_TEST_IDS.deposits, value);
  }
}
