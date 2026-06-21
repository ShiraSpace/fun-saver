import { WALLET_HERO_TEST_IDS } from '@/components/Account/WalletHero/constants';
import { COIN_ROW_TEST_IDS } from '@/components/Account/CoinRow/constants';
import { WALLET_LIST_TEST_IDS } from '@/components/Account/WalletList/constants';
import { WALLET_CARD_TEST_IDS } from '@/components/Account/WalletCard/constants';
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
}
