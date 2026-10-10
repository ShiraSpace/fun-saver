/**
 * @jest-environment node
 */
import { signedInUser } from '@/auth';
import { API_ERRORS } from '@/app/api/constants';
import { getStore } from '@/db';
import { createMockGoalPicture } from '@/test-utils/mocks/goal.mocks';
import { mockCoParent, mockUser } from '@/test-utils/mocks/user.mocks';
import { addAccountViewerToStoreFile } from '@/test-utils/account-viewer';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempStoreEnv } from '@/test-utils/test-utils';
import { POST } from '../route';

jest.mock('@/auth');

describe('POST /api/accounts/[id]/goals', () => {
  const storeFile = withTempStoreEnv();

  const mockGoalRequest = {
    name: 'אופניים',
    amount: 300,
    picture: createMockGoalPicture('🚲'),
  };

  let accountId: string;

  beforeEach(async () => {
    accountId = (await createOwnedAccount(getStore())).id;
    jest.mocked(signedInUser).mockResolvedValue(mockUser);
  });

  function postGoal(body: unknown): Promise<Response> {
    return postRawBody(JSON.stringify(body));
  }

  function postRawBody(body: string): Promise<Response> {
    const request = new Request('http://localhost/api/accounts/x/goals', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });

    return POST(request, { params: Promise.resolve({ id: accountId }) });
  }

  describe('a valid goal', () => {
    let response: Response;

    beforeEach(async () => {
      response = await postGoal(mockGoalRequest);
    });

    it('answers 201', () => {
      expect(response.status).toBe(201);
    });

    it('answers with the goal as stored', async () => {
      expect(await response.json()).toEqual(
        await getStore().getActiveGoal(accountId)
      );
    });
  });

  describe('an invalid goal', () => {
    let response: Response;

    beforeEach(async () => {
      response = await postGoal({ ...mockGoalRequest, amount: 0 });
    });

    it('answers 400', () => {
      expect(response.status).toBe(400);
    });

    it('answers with invalidGoal', async () => {
      expect((await response.json()).error).toBe(API_ERRORS.invalidGoal);
    });
  });

  describe('malformed JSON', () => {
    let response: Response;

    beforeEach(async () => {
      response = await postRawBody('{ "name": ');
    });

    it('answers 400', () => {
      expect(response.status).toBe(400);
    });
  });

  describe('a second goal', () => {
    let response: Response;

    beforeEach(async () => {
      await postGoal(mockGoalRequest);
      response = await postGoal({ ...mockGoalRequest, name: 'קורקינט' });
    });

    it('answers 409', () => {
      expect(response.status).toBe(409);
    });

    it('answers with goalAlreadyActive', async () => {
      expect((await response.json()).error).toBe(API_ERRORS.goalAlreadyActive);
    });
  });

  describe('a viewer', () => {
    let response: Response;

    beforeEach(async () => {
      await addAccountViewerToStoreFile(
        storeFile.path,
        accountId,
        mockCoParent
      );
      jest.mocked(signedInUser).mockResolvedValue(mockCoParent);
      response = await postGoal(mockGoalRequest);
    });

    it('answers 403', () => {
      expect(response.status).toBe(403);
    });
  });
});
