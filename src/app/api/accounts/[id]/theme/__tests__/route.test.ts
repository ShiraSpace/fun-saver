/**
 * @jest-environment node
 */
import { signedInUserId } from '@/auth';
import { getStore } from '@/db';
import { mockSecondUser, mockUser } from '@/test-utils/fixtures';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempDataPath } from '@/test-utils/test-utils';
import { PUT } from '../route';

jest.mock('@/auth', () => ({ signedInUserId: jest.fn() }));

describe('PUT /api/accounts/[id]/theme', () => {
  withTempDataPath();

  let accountId: string;

  beforeEach(async () => {
    accountId = (await createOwnedAccount(getStore())).id;
    jest.mocked(signedInUserId).mockResolvedValue(mockUser.id);
  });

  function putTheme(themeId: string, id: string): Promise<Response> {
    const request = new Request('http://localhost/api/accounts/x/theme', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ themeId }),
    });

    return PUT(request, { params: Promise.resolve({ id }) });
  }

  function putRawBody(id: string, body: string | undefined): Promise<Response> {
    const request = new Request('http://localhost/api/accounts/x/theme', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body,
    });

    return PUT(request, { params: Promise.resolve({ id }) });
  }

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

  it('refuses an unknown account with 403 rather than admitting it is gone', async () => {
    const response = await putTheme('midnight-blue', 'does-not-exist');

    expect(response.status).toBe(403);
  });

  it('refuses a stranger with 403 and leaves the theme alone', async () => {
    jest.mocked(signedInUserId).mockResolvedValue(mockSecondUser.id);

    const response = await putTheme('midnight-blue', accountId);

    expect(response.status).toBe(403);
    expect((await getStore().getAccount(accountId))?.themeId).not.toBe(
      'midnight-blue'
    );
  });

  it.each([
    ['malformed json', '{ "themeId": '],
    ['no body at all', undefined],
  ])('rejects %s with 400 and keeps the stored theme', async (_label, body) => {
    const before = (await getStore().getAccount(accountId))?.themeId;

    const response = await putRawBody(accountId, body);

    expect(response.status).toBe(400);
    expect((await getStore().getAccount(accountId))?.themeId).toBe(before);
  });
});
