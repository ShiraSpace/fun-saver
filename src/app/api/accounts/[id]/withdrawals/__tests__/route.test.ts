/**
 * @jest-environment node
 */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getStore } from '@/db';
import { AccountsStore } from '@/lib/accounts-store';
import { addDeposit } from '@/lib/transactions';
import { balance } from '@/lib/derivations';
import { mockCreateAccountInput } from '@/test-support/fixtures';
import type { Account } from '@/lib/types';
import { POST } from '../route';

const ASOF = '2026-01-01';

let dir: string;
let account: Account;
let savingsId: string;

beforeEach(async () => {
  dir = mkdtempSync(join(tmpdir(), 'funsaver-withdraw-'));
  process.env.FUNSAVER_DATA_PATH = join(dir, 'data.json');
  account = await new AccountsStore(getStore()).createAccount(
    mockCreateAccountInput,
    ASOF
  );
  savingsId = account.wallets.find((wallet) => wallet.name === 'savings')!.id;
  await addDeposit(getStore(), account, 10000, ASOF);
});

afterEach(() => {
  delete process.env.FUNSAVER_DATA_PATH;
  rmSync(dir, { recursive: true, force: true });
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

describe('POST /api/accounts/[id]/withdrawals', () => {
  it('withdraws from the chosen pot and persists it', async () => {
    const before = balance(
      await getStore().listTransactionsByWallet(savingsId)
    );

    const response = await postWithdraw(savingsId, 20, account.id);

    expect(response.status).toBe(200);
    const after = balance(await getStore().listTransactionsByWallet(savingsId));
    expect(after).toBe(before - 2000);
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

  it('returns 404 for an unknown account', async () => {
    const response = await postWithdraw(savingsId, 20, 'does-not-exist');

    expect(response.status).toBe(404);
  });
});
