/**
 * @jest-environment node
 */
import { signedInUser } from '@/auth';
import { API_ERRORS } from '@/app/api/constants';
import { getStore } from '@/db';
import { GOAL_ENDING } from '@/lib/goal/constants';
import type { Goal } from '@/lib/goal/types';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import { mockCoParent, mockUser } from '@/test-utils/mocks/user.mocks';
import { addAccountViewerToStoreFile } from '@/test-utils/account-viewer';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempStoreEnv } from '@/test-utils/test-utils';
import { DELETE } from '../route';

jest.mock('@/auth');

describe('DELETE /api/accounts/[id]/goals/[goalId]', () => {
  withTempStoreEnv();

  let accountId: string;
  let mockGoal: Goal;

  beforeEach(async () => {
    accountId = (await createOwnedAccount(getStore())).id;
    mockGoal = createMockGoal({ accountId });
    await getStore().insertGoal(mockGoal);
    jest.mocked(signedInUser).mockResolvedValue(mockUser);
  });

  function cancelGoal(): Promise<Response> {
    const request = new Request('http://localhost/api/accounts/x/goals/y', {
      method: 'DELETE',
    });

    return DELETE(request, {
      params: Promise.resolve({ id: accountId, goalId: mockGoal.id }),
    });
  }

  describe('the active goal', () => {
    let response: Response;

    beforeEach(async () => {
      response = await cancelGoal();
    });

    it('answers 200', () => {
      expect(response.status).toBe(200);
    });

    it('answers with the goal ended as cancelled', async () => {
      expect(await response.json()).toMatchObject({
        id: mockGoal.id,
        ending: GOAL_ENDING.cancelled,
      });
    });
  });

  describe('a goal already ended', () => {
    let response: Response;

    beforeEach(async () => {
      await cancelGoal();
      response = await cancelGoal();
    });

    it('answers 409', () => {
      expect(response.status).toBe(409);
    });

    it('answers with goalNotActive', async () => {
      expect((await response.json()).error).toBe(API_ERRORS.goalNotActive);
    });
  });

  describe('a viewer', () => {
    let response: Response;

    beforeEach(async () => {
      await addAccountViewerToStoreFile(accountId, mockCoParent);
      jest.mocked(signedInUser).mockResolvedValue(mockCoParent);
      response = await cancelGoal();
    });

    it('answers 403', () => {
      expect(response.status).toBe(403);
    });
  });
});
