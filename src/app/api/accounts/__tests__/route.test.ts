/**
 * @jest-environment node
 */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mockCreateAccountInput } from '@/test-support/fixtures';
import { getStore } from '@/db';
import { POST } from '../route';

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'funsaver-route-'));
  process.env.FUNSAVER_DATA_PATH = join(dir, 'data.json');
});

afterEach(() => {
  delete process.env.FUNSAVER_DATA_PATH;
  rmSync(dir, { recursive: true, force: true });
});

function postRequest(body: unknown): Request {
  return new Request('http://localhost/api/accounts', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/accounts', () => {
  it('creates an account and returns it with 201', async () => {
    const response = await POST(postRequest(mockCreateAccountInput));

    expect(response.status).toBe(201);
    const account = await response.json();
    expect(account).toMatchObject({
      ...mockCreateAccountInput,
      isActive: true,
    });
    expect(account.id).toBeTruthy();

    const stored = await getStore().listAccounts();
    expect(stored.map((a) => a.name)).toEqual([mockCreateAccountInput.name]);
  });
});
