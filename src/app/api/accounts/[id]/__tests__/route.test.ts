/**
 * @jest-environment node
 */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getStore } from '@/db';
import { AccountsStore } from '@/lib/accounts-store';
import {
  mockCreateAccountInput,
  mockAccountEdit,
} from '@/test-support/fixtures';
import { PUT } from '../route';

const ASOF = '2026-01-01';

let dir: string;
let accountId: string;

beforeEach(async () => {
  dir = mkdtempSync(join(tmpdir(), 'funsaver-account-'));
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

function putAccount(body: unknown, id: string): Promise<Response> {
  const request = new Request('http://localhost/api/accounts/x', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  return PUT(request, { params: Promise.resolve({ id }) });
}

describe('PUT /api/accounts/[id]', () => {
  it('saves the new name and avatar on the account', async () => {
    const response = await putAccount(
      {
        name: `  ${mockAccountEdit.name}  `,
        avatarId: mockAccountEdit.avatarId,
      },
      accountId
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject(mockAccountEdit);
    expect(await getStore().getAccount(accountId)).toMatchObject(
      mockAccountEdit
    );
  });

  it('updates the name alone without touching the avatar', async () => {
    const response = await putAccount(
      { name: mockAccountEdit.name },
      accountId
    );

    expect(response.status).toBe(200);
    expect(await getStore().getAccount(accountId)).toMatchObject({
      name: mockAccountEdit.name,
      avatarId: mockCreateAccountInput.avatarId,
    });
  });

  it('updates the avatar alone without touching the name', async () => {
    const response = await putAccount(
      { avatarId: mockAccountEdit.avatarId },
      accountId
    );

    expect(response.status).toBe(200);
    expect(await getStore().getAccount(accountId)).toMatchObject({
      name: mockCreateAccountInput.name,
      avatarId: mockAccountEdit.avatarId,
    });
  });

  it.each([
    ['an empty body', {}],
    ['an array body', []],
    ['a blank name', { name: '   ' }],
    ['an unknown avatar', { avatarId: 'not-an-avatar' }],
    ['a non-string name', { name: 7 }],
    ['a non-object body', 'רוני'],
    ['an unparsable body', undefined],
  ])('rejects %s with 400', async (_label, body) => {
    const response = await putAccount(body, accountId);

    expect(response.status).toBe(400);
    expect(await getStore().getAccount(accountId)).toMatchObject(
      mockCreateAccountInput
    );
  });

  it('returns 404 for an unknown account', async () => {
    const response = await putAccount(
      { name: mockAccountEdit.name },
      'does-not-exist'
    );

    expect(response.status).toBe(404);
  });
});
