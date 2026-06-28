import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount, mockTransactions } from '@/test-support/fixtures';
import { WALLET_LIST_COPY } from '@/components/Account/WalletList/constants';
import { useDriver } from './driver/use-driver';

describe('dashboard', () => {
  const { header, dashboard } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
  });

  it('shows the account header', async () => {
    assert.equal(await header.exists(), true);
  });

  it('shows the savings hero with its daily-interest coin row', async () => {
    assert.equal(await dashboard.heroExists(), true);
    assert.equal(await dashboard.dailyRowExists(), true);
  });

  it('shows the additional wallets with one card per non-savings wallet', async () => {
    assert.equal(await dashboard.supportingLabel(), WALLET_LIST_COPY.label);
    assert.equal(await dashboard.walletCardCount(), 2);
  });
});
