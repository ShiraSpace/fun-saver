/**
 * @jest-environment node
 */
import { signedInUserId } from '@/auth';
import { getStore } from '@/db';
import { mockSecondUser, mockUser } from '@/test-utils/fixtures';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempDataPath } from '@/test-utils/test-utils';
import { withAccountEditor } from '../with-account-editor';

jest.mock('@/auth');

describe('withAccountEditor', () => {
  withTempDataPath();

  const handle = jest.fn(async (): Promise<Response> =>
    Response.json({ edited: true })
  );

  let accountId: string;

  beforeEach(async () => {
    handle.mockClear();
    accountId = (await createOwnedAccount(getStore())).id;
  });

  function callGuarded(accountId: string): Promise<Response> {
    return withAccountEditor(handle)(
      new Request('http://localhost/api/accounts/a1', { method: 'PUT' }),
      { params: Promise.resolve({ id: accountId }) }
    );
  }

  it('answers 401 without a session and never runs the handler', async () => {
    jest.mocked(signedInUserId).mockResolvedValue(undefined);

    const response = await callGuarded(accountId);

    expect(response.status).toBe(401);
    expect(handle).not.toHaveBeenCalled();
  });

  it('answers 403 to a member of no account and never runs the handler', async () => {
    jest.mocked(signedInUserId).mockResolvedValue(mockSecondUser.id);

    const response = await callGuarded(accountId);

    expect(response.status).toBe(403);
    expect(handle).not.toHaveBeenCalled();
  });

  it('passes a member through to the handler with the account id', async () => {
    jest.mocked(signedInUserId).mockResolvedValue(mockUser.id);

    const response = await callGuarded(accountId);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ edited: true });
    expect(handle).toHaveBeenCalledWith(expect.any(Request), accountId);
  });
});
