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

function putRawBody(id: string, body: string | undefined): Promise<Response> {
  const request = new Request(`http://localhost/api/accounts/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body,
  });

  return PUT(request, { params: Promise.resolve({ id }) });
}

function putAccount(id: string, body: unknown): Promise<Response> {
  return putRawBody(id, JSON.stringify(body));
}

describe('PUT /api/accounts/[id]', () => {
  it('saves the new name and avatar on the account', async () => {
    const response = await putAccount(accountId, {
      name: `  ${mockAccountEdit.name}  `,
      avatarId: mockAccountEdit.avatarId,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject(mockAccountEdit);
    expect(await getStore().getAccount(accountId)).toMatchObject(
      mockAccountEdit
    );
  });

  it('updates the name alone without touching the avatar', async () => {
    const response = await putAccount(accountId, {
      name: mockAccountEdit.name,
    });

    expect(response.status).toBe(200);
    expect(await getStore().getAccount(accountId)).toMatchObject({
      name: mockAccountEdit.name,
      avatarId: mockCreateAccountInput.avatarId,
    });
  });

  it('updates the avatar alone without touching the name', async () => {
    const response = await putAccount(accountId, {
      avatarId: mockAccountEdit.avatarId,
    });

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
  ])('rejects %s with 400', async (_label, body) => {
    const response = await putAccount(accountId, body);

    expect(response.status).toBe(400);
    expect(await getStore().getAccount(accountId)).toMatchObject(
      mockCreateAccountInput
    );
  });

  it.each([
    ['malformed json', '{ "name": '],
    ['no body at all', undefined],
  ])('rejects %s with 400', async (_label, body) => {
    const response = await putRawBody(accountId, body);

    expect(response.status).toBe(400);
    expect(await getStore().getAccount(accountId)).toMatchObject(
      mockCreateAccountInput
    );
  });

  it('returns 404 for an unknown account', async () => {
    const response = await putAccount('does-not-exist', {
      name: mockAccountEdit.name,
    });

    expect(response.status).toBe(404);
  });
});
