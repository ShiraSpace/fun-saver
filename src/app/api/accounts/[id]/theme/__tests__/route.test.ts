/**
 * @jest-environment node
 */
import { getStore } from '@/db';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempDataPath } from '@/test-utils/test-utils';
import { PUT } from '../route';

describe('PUT /api/accounts/[id]/theme', () => {
  withTempDataPath();

  let accountId: string;

  beforeEach(async () => {
    accountId = (await createOwnedAccount(getStore())).id;
  });

  function putTheme(themeId: string, id: string): Promise<Response> {
    const request = new Request('http://localhost/api/accounts/x/theme', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ themeId }),
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

  it('returns 404 for an unknown account', async () => {
    const response = await putTheme('midnight-blue', 'does-not-exist');

    expect(response.status).toBe(404);
  });
});
