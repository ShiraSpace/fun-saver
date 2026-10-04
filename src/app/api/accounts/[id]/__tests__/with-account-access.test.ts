/**
 * @jest-environment node
 */
import { signedInUser } from '@/auth';
import { getStore } from '@/db';
import { mockCoParent, mockUser } from '@/test-utils/mocks/user.mocks';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempStoreEnv } from '@/test-utils/test-utils';
import { withAccountEditor } from '../with-account-access';
import type { GoalRouteParams } from '../goals/[goalId]/goal-route-params';

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

  describe('without a session', () => {
    let response: Response;

    beforeEach(async () => {
      jest.mocked(signedInUser).mockResolvedValue(undefined);
      response = await callGuarded(accountId);
    });

    it('answers 401', () => {
      expect(response.status).toBe(401);
    });

    it('does not call the handler', () => {
      expect(mockRouteHandler).not.toHaveBeenCalled();
    });
  });

  describe('a stranger to the account', () => {
    let response: Response;

    beforeEach(async () => {
      jest.mocked(signedInUser).mockResolvedValue(mockCoParent);
      response = await callGuarded(accountId);
    });

    it('answers 403', () => {
      expect(response.status).toBe(403);
    });

    it('does not call the handler', () => {
      expect(mockRouteHandler).not.toHaveBeenCalled();
    });
  });

  describe('a member', () => {
    const mockGoalId = 'g1';

    let response: Response;

    beforeEach(async () => {
      jest.mocked(signedInUser).mockResolvedValue(mockUser);
      response = await withAccountEditor<GoalRouteParams>(mockRouteHandler)(
        new Request('http://localhost/api/accounts/a1/goals/g1', {
          method: 'DELETE',
        }),
        { params: Promise.resolve({ id: accountId, goalId: mockGoalId }) }
      );
    });

    it("answers with the handler's response", async () => {
      expect(await response.json()).toEqual({ edited: true });
    });

    it('passes the account id to the handler', () => {
      expect(mockRouteHandler).toHaveBeenCalledWith(
        expect.any(Request),
        accountId,
        expect.anything()
      );
    });

    it('passes every route param to the handler', () => {
      expect(mockRouteHandler).toHaveBeenCalledWith(
        expect.any(Request),
        expect.any(String),
        { id: accountId, goalId: mockGoalId }
      );
    });
  });
});
