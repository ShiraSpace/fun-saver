/**
 * @jest-environment node
 */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getStore } from '@/db';
import { AccountsStore } from '@/lib/accounts-store';
import { mockCreateAccountInput } from '@/test-support/fixtures';
import { PUT } from '../route';

const ASOF = '2026-01-01';

let dir: string;
let accountId: string;

beforeEach(async () => {
  dir = mkdtempSync(join(tmpdir(), 'funsaver-theme-'));
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

function putTheme(themeId: string, id: string): Promise<Response> {
  const request = new Request('http://localhost/api/accounts/x/theme', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ themeId }),
  });

  return PUT(request, { params: Promise.resolve({ id }) });
}

describe('PUT /api/accounts/[id]/theme', () => {
  it('saves the theme on the account', async () => {
    const response = await putTheme('midnight-blue', accountId);

    expect(response.status).toBe(200);
    expect((await response.json()).themeId).toBe('midnight-blue');
    expect((await getStore().getAccount(accountId))?.themeId).toBe(
      'midnight-blue'
    );
  });

  it('rejects an unknown theme with 400', async () => {
    const response = await putTheme('not-a-theme', accountId);

    expect(response.status).toBe(400);
    expect((await getStore().getAccount(accountId))?.themeId).not.toBe(
      'not-a-theme'
    );
  });

  it('returns 404 for an unknown account', async () => {
    const response = await putTheme('midnight-blue', 'does-not-exist');

    expect(response.status).toBe(404);
  });
});
