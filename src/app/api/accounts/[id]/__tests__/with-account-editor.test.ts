/**
 * @jest-environment node
 */
import { signedInUser } from '@/auth';
import { getStore } from '@/db';
import { mockCoParent, mockUser } from '@/test-utils/mocks/user.mocks';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempStoreEnv } from '@/test-utils/test-utils';
import { withAccountEditor } from '../with-account-editor';

jest.mock('@/auth');

describe('withAccountEditor', () => {
  withTempStoreEnv();

  const mockRouteHandler = jest.fn(async (): Promise<Response> =>
    Response.json({ edited: true })
  );

  let accountId: string;

  beforeEach(async () => {
    mockRouteHandler.mockClear();
    accountId = (await createOwnedAccount(getStore())).id;
  });

  function callGuarded(accountId: string): Promise<Response> {
    return withAccountEditor(mockRouteHandler)(
      new Request('http://localhost/api/accounts/a1', { method: 'PUT' }),
      { params: Promise.resolve({ id: accountId }) }
    );
  }

  it('answers 401 without a session and never runs the handler', async () => {
    jest.mocked(signedInUser).mockResolvedValue(undefined);

    const response = await callGuarded(accountId);

    expect(response.status).toBe(401);
    expect(mockRouteHandler).not.toHaveBeenCalled();
  });

  it('answers 403 to a member of no account and never runs the handler', async () => {
    jest.mocked(signedInUser).mockResolvedValue(mockCoParent);

    const response = await callGuarded(accountId);

    expect(response.status).toBe(403);
    expect(mockRouteHandler).not.toHaveBeenCalled();
  });

  it('passes a member through to the handler with the account id', async () => {
    jest.mocked(signedInUser).mockResolvedValue(mockUser);

    const response = await callGuarded(accountId);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ edited: true });
    expect(mockRouteHandler).toHaveBeenCalledWith(
      expect.any(Request),
      accountId
    );
  });
});
