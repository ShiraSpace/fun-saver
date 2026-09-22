/**
 * @jest-environment node
 */
import { getStore } from '@/db';
import { splitDeposit } from '@/lib/transactions';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempDataPath } from '@/test-utils/test-utils';
import { POST } from '../route';

describe('POST /api/accounts/[id]/deposits', () => {
  withTempDataPath();

  let accountId: string;

  beforeEach(async () => {
    accountId = (await createOwnedAccount(getStore())).id;
  });

  function postDeposit(amount: number, id: string): Promise<Response> {
    const request = new Request('http://localhost/api/accounts/x/deposits', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ amount }),
    });

    return POST(request, { params: Promise.resolve({ id }) });
  }

  it('splits a deposit across the pots and persists it', async () => {
    const response = await postDeposit(20, accountId);

    expect(response.status).toBe(200);
    const transactions = await response.json();
    expect(transactions).toHaveLength(3);

    const account = await getStore().getAccount(accountId);
    const savings = account!.wallets.find(
      (wallet) => wallet.name === 'savings'
    )!;
    const saved = await getStore().listTransactionsByWallet(
      accountId,
      savings.id
    );
    expect(saved[0].amount).toBe(splitDeposit(2000).savings);
  });

  it('rejects a non-positive amount with 400', async () => {
    const response = await postDeposit(0, accountId);

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBeTruthy();
  });

  it('returns 404 for an unknown account', async () => {
    const response = await postDeposit(20, 'does-not-exist');

    expect(response.status).toBe(404);
  });
});
