/**
 * @jest-environment node
 */
import { signedInUser } from '@/auth';
import { getStore } from '@/db';
import {
  mockAccountEdit,
  mockCreateAccountInput,
  mockSecondUser,
  mockUser,
} from '@/test-utils/fixtures';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { THEME_ID } from '@/theme/registry';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempDataPath } from '@/test-utils/test-utils';
import { PUT } from '../route';

jest.mock('@/auth');

describe('PUT /api/accounts/[id]', () => {
  withTempDataPath();

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
      name: mockAccountEdit.name,
    });

    expect(response.status).toBe(403);
  });

  it('refuses a stranger with 403 and leaves the name and avatar alone', async () => {
    jest.mocked(signedInUser).mockResolvedValue(mockSecondUser);

    const response = await putAccount(accountId, mockAccountEdit);

    expect(response.status).toBe(403);
    expect(await getStore().getAccount(accountId)).toMatchObject(
      mockCreateAccountInput
    );
  });
});
