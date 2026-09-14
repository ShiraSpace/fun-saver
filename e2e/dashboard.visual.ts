import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  mockAccount,
  mockDerivedWallets,
  mockTransactions,
} from '@/test-utils/fixtures';
import { WALLET_LIST_COPY } from '@/components/Account/WalletList/constants';
import { WALLET_CARD_COPY } from '@/components/Account/WalletCard/constants';
import { useDriver } from './driver/use-driver';

const [, spending, goodDeeds] = mockDerivedWallets;

describe('dashboard', () => {
  const { header, dashboard } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
  });

  it('shows the account header', async () => {
    assert.equal(await header.exists(), true);
  });

  it('shows the overview card with the savings daily interest', async () => {
    assert.equal(await dashboard.overviewExists(), true);
    assert.match(await dashboard.savingsTodayInterest(), /₪\s*5/);
  });

  it('shows one card per wallet', async () => {
    assert.equal(await dashboard.supportingLabel(), WALLET_LIST_COPY.label);
    assert.equal(await dashboard.walletCardCount(), 3);
  });

  it('shows what the spending and good-deeds wallets have spent', async () => {
    const subLines = await dashboard.walletSubLines();

    assert.ok(subLines.includes(WALLET_CARD_COPY.spendingSubLine(spending)));
    assert.ok(subLines.includes(WALLET_CARD_COPY.goodDeedsSubLine(goodDeeds)));
  });
});
