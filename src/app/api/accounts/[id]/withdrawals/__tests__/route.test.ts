/**
 * @jest-environment node
 */
import { signedInUser } from '@/auth';
import { getStore } from '@/db';
import { today } from '@/lib/clock';
import { addDeposit } from '@/lib/transaction/transactions';
import { balance } from '@/lib/wallet/balance';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { shekelsToAgorot } from '@/lib/money';
import type { Account } from '@/lib/account/types';
import { mockCoParent, mockUser } from '@/test-utils/mocks/user.mocks';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { walletIdNamed } from '@/test-utils/wallet-id-named';
import { withTempStoreEnv } from '@/test-utils/test-utils';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import { API_ERRORS } from '@/app/api/constants';
import { POST } from '../route';

jest.mock('@/auth');

describe('POST /api/accounts/[id]/withdrawals', () => {
  withTempStoreEnv();

  const mockDepositAgorot = 10000;
  const mockWithdrawalShekels = 20;

  let account: Account;
  let savingsId: string;

  beforeEach(async () => {
    account = await createOwnedAccount(getStore());
    savingsId = walletIdNamed(account, WALLET_NAMES.savings);
    await addDeposit({
      store: getStore(),
      account,
      amountAgorot: mockDepositAgorot,
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

    const response = await postWithdraw(
      savingsId,
      mockWithdrawalShekels,
      account.id
    );

    expect(response.status).toBe(200);
    expect(await savingsBalance()).toBe(
      before - shekelsToAgorot(mockWithdrawalShekels)
    );
  });

  it('rejects an overdraft with 400', async () => {
    const mockOverdraftShekels = 9999;

    const response = await postWithdraw(
      savingsId,
      mockOverdraftShekels,
      account.id
    );

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBeTruthy();
  });

  it('rejects a non-positive amount with 400', async () => {
    const mockZeroShekels = 0;

    const response = await postWithdraw(savingsId, mockZeroShekels, account.id);

    expect(response.status).toBe(400);
  });

  it('refuses an unknown account with 403 rather than admitting it is gone', async () => {
    const mockUnknownAccountId = 'does-not-exist';

    const response = await postWithdraw(
      savingsId,
      mockWithdrawalShekels,
      mockUnknownAccountId
    );

    expect(response.status).toBe(403);
  });

  it('refuses a stranger with 403 and leaves the savings untouched', async () => {
    jest.mocked(signedInUser).mockResolvedValue(mockCoParent);

    const before = await savingsBalance();

    const response = await postWithdraw(
      savingsId,
      mockWithdrawalShekels,
      account.id
    );

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

  describe('savings with an active goal not yet reached', () => {
    let response: Response;

    beforeEach(async () => {
      await getStore().insertGoal(
        createMockGoal({
          accountId: account.id,
          amount: (await savingsBalance()) + 1,
        })
      );
      response = await postWithdraw(
        savingsId,
        mockWithdrawalShekels,
        account.id
      );
    });

    it('answers 409', () => {
      expect(response.status).toBe(409);
    });

    it('answers with savingsLocked', async () => {
      expect((await response.json()).error).toBe(API_ERRORS.savingsLocked);
    });
  });
});
