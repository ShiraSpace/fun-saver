/**
 * @jest-environment node
 */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getStore } from '@/db';
import { AccountsStore } from '@/lib/accounts-store';
import { splitDeposit } from '@/lib/transactions';
import { mockCreateAccountInput } from '@/test-support/fixtures';
import { POST } from '../route';

const ASOF = '2026-01-01';

let dir: string;
let accountId: string;

beforeEach(async () => {
  dir = mkdtempSync(join(tmpdir(), 'funsaver-deposit-'));
  process.env.FUNSAVER_DATA_PATH = join(dir, 'data.json');
  accountId = (
    await new AccountsStore(getStore()).createAccount(
      mockCreateAccountInput,
      ASOF
    )
  ).id;
});

afterEach(() => {
  delete process.env.FUNSAVER_DATA_PATH;
  rmSync(dir, { recursive: true, force: true });
});

function postDeposit(amount: number, id: string): Promise<Response> {
  const request = new Request('http://localhost/api/accounts/x/deposits', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ amount }),
  });

  return POST(request, { params: Promise.resolve({ id }) });
}

describe('POST /api/accounts/[id]/deposits', () => {
  it('splits a deposit across the pots and persists it', async () => {
    const response = await postDeposit(20, accountId);

    expect(response.status).toBe(200);
    const transactions = await response.json();
    expect(transactions).toHaveLength(3);

    const account = await getStore().getAccount(accountId);
    const savings = account!.wallets.find(
      (wallet) => wallet.name === 'savings'
    )!;
    const saved = await getStore().listTransactionsByWallet(savings.id);
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
