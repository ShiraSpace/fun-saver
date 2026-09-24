import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  mockAccount,
  mockWalletSummaries,
  mockTransactions,
} from '@/test-utils/fixtures';
import { WALLET_LIST_COPY } from '@/components/Account/WalletList/constants';
import { WALLET_CARD_COPY } from '@/components/Account/WalletCard/constants';
import { useDriver } from './driver/use-driver';

const [, spending, goodDeeds] = mockWalletSummaries;

describe('the account screen', () => {
  const { header, account } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
  });

  it('shows the account header', async () => {
    assert.equal(await header.exists(), true);
  });

  it('shows the balance breakdown with the savings daily interest', async () => {
    assert.equal(await account.overviewExists(), true);
    assert.match(await account.savingsTodayInterest(), /₪\s*5/);
  });

  it('shows one card per wallet', async () => {
    assert.equal(await account.walletListLabel(), WALLET_LIST_COPY.label);
    assert.equal(await account.walletCardCount(), 3);
  });

  it('shows what the spending and good-deeds wallets have spent', async () => {
    const summaries = await account.walletSummaries();

    assert.ok(summaries.includes(WALLET_CARD_COPY.spendingSummary(spending)));
    assert.ok(summaries.includes(WALLET_CARD_COPY.goodDeedsSummary(goodDeeds)));
  });
});
