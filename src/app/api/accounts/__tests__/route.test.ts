/**
 * @jest-environment node
 */
import { mockCreateAccountInput, mockUser } from '@/test-utils/fixtures';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { getStore } from '@/db';
import { signedInUser } from '@/auth';
import { withTempDataPath } from '@/test-utils/test-utils';
import { POST } from '../route';

jest.mock('@/auth');

describe('POST /api/accounts', () => {
  withTempDataPath();

  beforeEach(async () => {
    await getStore().insertUser(mockUser);
    jest.mocked(signedInUser).mockResolvedValue(mockUser);
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

    expect(await getStore().getAccount(account.id)).toMatchObject({
      name: mockCreateAccountInput.name,
    });
  });

  it('refuses an unauthenticated request with 401 and stores nothing', async () => {
    jest.mocked(signedInUser).mockResolvedValue(undefined);

    const response = await POST(postRequest(mockCreateAccountInput));

    expect(response.status).toBe(401);
    expect(await getStore().listAccountsForUser(mockUser.id)).toEqual([]);
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
    expect(await getStore().listAccountsForUser(mockUser.id)).toEqual([]);
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
