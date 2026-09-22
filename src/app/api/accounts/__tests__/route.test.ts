/**
 * @jest-environment node
 */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mockCreateAccountInput, mockUser } from '@/test-utils/fixtures';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { getStore } from '@/db';
import { signedInUserId } from '@/auth';
import { POST } from '../route';

jest.mock('@/auth', () => ({ signedInUserId: jest.fn() }));

describe('POST /api/accounts', () => {
  let dir: string;

  beforeEach(async () => {
    dir = mkdtempSync(join(tmpdir(), 'funsaver-route-'));
    process.env.FUNSAVER_DATA_PATH = join(dir, 'data.json');
    await getStore().insertUser(mockUser);
    jest.mocked(signedInUserId).mockResolvedValue(mockUser.id);
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

  it.each([
    ['no body at all', {}],
    ['a missing avatar', { name: 'נועה' }],
    ['a missing name', { avatarId: 'kid-01' }],
    ['a blank name', { name: '   ', avatarId: 'kid-01' }],
    ['a non-string name', { name: 7, avatarId: 'kid-01' }],
    [
      'a name past the length cap',
      { name: 'א'.repeat(MAX_ACCOUNT_NAME_LENGTH + 1), avatarId: 'kid-01' },
    ],
    ['an unknown avatar', { name: 'נועה', avatarId: 'not-an-avatar' }],
    [
      'a field that is not an account field',
      { ...mockCreateAccountInput, isActive: false },
    ],
    ['an array body', []],
    ['a non-object body', 'נועה'],
  ])('rejects %s with 400 and stores nothing', async (_label, body) => {
    const response = await POST(postRequest(body));

    expect(response.status).toBe(400);
    expect(await getStore().listAccounts()).toEqual([]);
  });

  it('trims the padding off the new name', async () => {
    const response = await POST(
      postRequest({
        ...mockCreateAccountInput,
        name: `  ${mockCreateAccountInput.name}  `,
      })
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({
      name: mockCreateAccountInput.name,
    });
  });
});
