/**
 * @jest-environment node
 */
import { signedInUser } from '@/auth';
import { getStore } from '@/db';
import { today } from '@/lib/clock';
import { addDeposit } from '@/lib/transaction/transactions';
import { balance } from '@/lib/wallet/balance';
import type { Account } from '@/lib/types';
import { mockCoParent, mockUser } from '@/test-utils/mocks/general.mocks';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempStoreEnv } from '@/test-utils/test-utils';
import { POST } from '../route';

jest.mock('@/auth');

describe('POST /api/accounts/[id]/withdrawals', () => {
  withTempStoreEnv();

  let account: Account;
  let savingsId: string;

  beforeEach(async () => {
    account = await createOwnedAccount(getStore());
    savingsId = account.wallets.find((wallet) => wallet.name === 'savings')!.id;
    await addDeposit({
      store: getStore(),
      account,
      amountAgorot: 10000,
      asOf: today(),
    });
    jest.mocked(signedInUser).mockResolvedValue(mockUser);
  });

  function postWithdraw(
    walletId: string,
    amount: number,
    id: string
  ): Promise<Response> {
    const request = new Request('http://localhost/api/accounts/x/withdrawals', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ walletId, amount }),
    });

    return POST(request, { params: Promise.resolve({ id }) });
  }

  function postRawBody(
    id: string,
    body: string | undefined
  ): Promise<Response> {
    const request = new Request('http://localhost/api/accounts/x/withdrawals', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });

    return POST(request, { params: Promise.resolve({ id }) });
  }

  async function savingsBalance(): Promise<number> {
    return balance(
      await getStore().listTransactionsByWallet(account.id, savingsId)
    );
  }

  it('withdraws from the chosen wallet and persists it', async () => {
    const before = await savingsBalance();

    const response = await postWithdraw(savingsId, 20, account.id);

    expect(response.status).toBe(200);
    expect(await savingsBalance()).toBe(before - 2000);
  });

  it('rejects an overdraft with 400', async () => {
    const response = await postWithdraw(savingsId, 9999, account.id);

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBeTruthy();
  });

  it('rejects a non-positive amount with 400', async () => {
    const response = await postWithdraw(savingsId, 0, account.id);

    expect(response.status).toBe(400);
  });

  it('refuses an unknown account with 403 rather than admitting it is gone', async () => {
    const response = await postWithdraw(savingsId, 20, 'does-not-exist');

    expect(response.status).toBe(403);
  });

  it('refuses a stranger with 403 and leaves the savings untouched', async () => {
    jest.mocked(signedInUser).mockResolvedValue(mockCoParent);

    const before = await savingsBalance();

    const response = await postWithdraw(savingsId, 20, account.id);

    expect(response.status).toBe(403);
    expect(await savingsBalance()).toBe(before);
  });

  it.each([
    ['malformed json', '{ "amount": '],
    ['no body at all', undefined],
  ])('rejects %s with 400 and moves no money', async (_label, body) => {
    const before = await savingsBalance();

    const response = await postRawBody(account.id, body);

    expect(response.status).toBe(400);
    expect(await savingsBalance()).toBe(before);
  });
});
