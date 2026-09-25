/**
 * @jest-environment node
 */
import { signedInUser } from '@/auth';
import { getStore } from '@/db';
import {
  mockAccountEdits,
  mockCreateAccountInput,
  mockCoParent,
  mockUser,
} from '@/test-utils/mocks/general.mocks';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/account/constants';
import { THEME_ID } from '@/theme/registry';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempStoreEnv } from '@/test-utils/test-utils';
import { PUT } from '../route';

jest.mock('@/auth');

describe('PUT /api/accounts/[id]', () => {
  withTempStoreEnv();

  let accountId: string;

  beforeEach(async () => {
    accountId = (await createOwnedAccount(getStore())).id;
    jest.mocked(signedInUser).mockResolvedValue(mockUser);
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

  it('saves the new name and avatar on the account', async () => {
    const response = await putAccount(accountId, {
      name: `  ${mockAccountEdits.name}  `,
      avatarId: mockAccountEdits.avatarId,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject(mockAccountEdits);
    expect(await getStore().getAccount(accountId)).toMatchObject(
      mockAccountEdits
    );
  });

  it('updates the name alone without touching the avatar', async () => {
    const response = await putAccount(accountId, {
      name: mockAccountEdits.name,
    });

    expect(response.status).toBe(200);
    expect(await getStore().getAccount(accountId)).toMatchObject({
      name: mockAccountEdits.name,
      avatarId: mockCreateAccountInput.avatarId,
    });
  });

  it('updates the avatar alone without touching the name', async () => {
    const response = await putAccount(accountId, {
      avatarId: mockAccountEdits.avatarId,
    });

    expect(response.status).toBe(200);
    expect(await getStore().getAccount(accountId)).toMatchObject({
      name: mockCreateAccountInput.name,
      avatarId: mockAccountEdits.avatarId,
    });
  });

  it.each([
    ['an empty body', {}],
    ['an array body', []],
    ['a blank name', { name: '   ' }],
    ['an unknown avatar', { avatarId: 'not-an-avatar' }],
    ['a non-string name', { name: 7 }],
    ['a non-object body', 'רוני'],
    [
      'a name past the length cap',
      { name: 'א'.repeat(MAX_ACCOUNT_NAME_LENGTH + 1) },
    ],
    [
      'a field that is not editable',
      { name: 'רוני', themeId: THEME_ID.midnightBlue },
    ],
    ['only fields that are not editable', { themeId: THEME_ID.midnightBlue }],
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

  it('accepts a name exactly at the length cap', async () => {
    const name = 'א'.repeat(MAX_ACCOUNT_NAME_LENGTH);

    const response = await putAccount(accountId, { name });

    expect(response.status).toBe(200);
    expect(await getStore().getAccount(accountId)).toMatchObject({ name });
  });

  it('refuses an unknown account with 403 rather than admitting it is gone', async () => {
    const response = await putAccount('does-not-exist', {
      name: mockAccountEdits.name,
    });

    expect(response.status).toBe(403);
  });

  it('refuses a stranger with 403 and leaves the name and avatar alone', async () => {
    jest.mocked(signedInUser).mockResolvedValue(mockCoParent);

    const response = await putAccount(accountId, mockAccountEdits);

    expect(response.status).toBe(403);
    expect(await getStore().getAccount(accountId)).toMatchObject(
      mockCreateAccountInput
    );
  });
});
