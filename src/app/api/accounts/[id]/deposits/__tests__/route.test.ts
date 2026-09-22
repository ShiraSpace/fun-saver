/**
 * @jest-environment node
 */
import { signedInUserId } from '@/auth';
import { getStore } from '@/db';
import { mockSecondUser, mockUser } from '@/test-utils/fixtures';
import { splitDeposit } from '@/lib/transactions';
import type { Transaction } from '@/lib/types';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempDataPath } from '@/test-utils/test-utils';
import { POST } from '../route';

jest.mock('@/auth', () => ({ signedInUserId: jest.fn() }));

describe('POST /api/accounts/[id]/deposits', () => {
  withTempDataPath();

  let accountId: string;

  beforeEach(async () => {
    accountId = (await createOwnedAccount(getStore())).id;
    jest.mocked(signedInUserId).mockResolvedValue(mockUser.id);
  });

  function postDeposit(amount: number, id: string): Promise<Response> {
    const request = new Request('http://localhost/api/accounts/x/deposits', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ amount }),
    });

    return POST(request, { params: Promise.resolve({ id }) });
  }

  async function savingsTransactions(id: string): Promise<Transaction[]> {
    const account = await getStore().getAccount(id);
    const savings = account!.wallets.find(
      (wallet) => wallet.name === 'savings'
    )!;

    return getStore().listTransactionsByWallet(id, savings.id);
  }

  it('splits a deposit across the pots and persists it', async () => {
    const response = await postDeposit(20, accountId);

    expect(response.status).toBe(200);
    const transactions = await response.json();
    expect(transactions).toHaveLength(3);

    const saved = await savingsTransactions(accountId);

    expect(saved[0].amount).toBe(splitDeposit(2000).savings);
  });

  it('rejects a non-positive amount with 400', async () => {
    const response = await postDeposit(0, accountId);

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBeTruthy();
  });

  it('refuses an unknown account with 403 rather than admitting it is gone', async () => {
    const response = await postDeposit(20, 'does-not-exist');

    expect(response.status).toBe(403);
  });

  it('refuses a stranger with 403 and banks nothing', async () => {
    jest.mocked(signedInUserId).mockResolvedValue(mockSecondUser.id);

    const response = await postDeposit(20, accountId);

    expect(response.status).toBe(403);
    expect(await savingsTransactions(accountId)).toEqual([]);
  });
});
