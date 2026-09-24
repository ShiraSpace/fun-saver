/**
 * @jest-environment node
 */
import { signedInUser } from '@/auth';
import { API_ERRORS } from '@/app/api/constants';
import { THEME_ID } from '@/theme/registry';
import { getStore } from '@/db';
import { mockSecondUser, mockUser } from '@/test-utils/fixtures';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempStoreEnv } from '@/test-utils/test-utils';
import { PUT } from '../route';

jest.mock('@/auth');

describe('PUT /api/accounts/[id]/theme', () => {
  withTempStoreEnv();

  let accountId: string;

  beforeEach(async () => {
    accountId = (await createOwnedAccount(getStore())).id;
    jest.mocked(signedInUser).mockResolvedValue(mockUser);
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
    const response = await putTheme(THEME_ID.midnightBlue, accountId);

    expect(response.status).toBe(200);
    expect((await response.json()).themeId).toBe(THEME_ID.midnightBlue);
    expect((await getStore().getAccount(accountId))?.themeId).toBe(
      THEME_ID.midnightBlue
    );
  });

  it('rejects an unknown theme with 400', async () => {
    const response = await putTheme('not-a-theme', accountId);

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe(API_ERRORS.unknownTheme);
    expect((await getStore().getAccount(accountId))?.themeId).not.toBe(
      'not-a-theme'
    );
  });

  it('refuses an unknown account with 403 rather than admitting it is gone', async () => {
    const response = await putTheme(THEME_ID.midnightBlue, 'does-not-exist');

    expect(response.status).toBe(403);
  });

  it('refuses a stranger with 403 and leaves the theme alone', async () => {
    jest.mocked(signedInUser).mockResolvedValue(mockSecondUser);

    const response = await putTheme(THEME_ID.midnightBlue, accountId);

    expect(response.status).toBe(403);
    expect((await getStore().getAccount(accountId))?.themeId).not.toBe(
      THEME_ID.midnightBlue
    );
  });

  it.each([
    ['malformed json', '{ "themeId": '],
    ['no body at all', undefined],
  ])('rejects %s with 400 and keeps the stored theme', async (_label, body) => {
    const before = (await getStore().getAccount(accountId))?.themeId;

    const response = await putRawBody(accountId, body);

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe(API_ERRORS.invalidThemeRequest);
    expect((await getStore().getAccount(accountId))?.themeId).toBe(before);
  });
});
