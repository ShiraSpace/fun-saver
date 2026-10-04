/**
 * @jest-environment node
 */
import { signedInUser } from '@/auth';
import { API_ERRORS } from '@/app/api/constants';
import { VIEW_MODE } from '@/lib/account/view-mode';
import { getStore } from '@/db';
import { mockCoParent, mockUser } from '@/test-utils/mocks/user.mocks';
import { createOwnedAccount } from '@/test-utils/owned-account';
import { withTempStoreEnv } from '@/test-utils/test-utils';
import { PUT } from '../route';

jest.mock('@/auth');

function putRawBody(id: string, body: string): Promise<Response> {
  const request = new Request('http://localhost/api/accounts/x/view-mode', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body,
  });

  return PUT(request, { params: Promise.resolve({ id }) });
}

function putViewMode(id: string, viewMode: string): Promise<Response> {
  return putRawBody(id, JSON.stringify({ viewMode }));
}

describe('PUT /api/accounts/[id]/view-mode', () => {
  withTempStoreEnv();

  let accountId: string;

  beforeEach(async () => {
    accountId = (await createOwnedAccount(getStore())).id;
    jest.mocked(signedInUser).mockResolvedValue(mockUser);
  });

  describe('a parent turns child view on', () => {
    let response: Response;

    beforeEach(async () => {
      response = await putViewMode(accountId, VIEW_MODE.child);
    });

    it('saves child view on the account', async () => {
      expect((await getStore().getAccount(accountId))?.viewMode).toBe(
        VIEW_MODE.child
      );
    });

    it('answers with the updated account', async () => {
      expect((await response.json()).viewMode).toBe(VIEW_MODE.child);
    });
  });

  describe('a view mode the app does not have', () => {
    let response: Response;

    beforeEach(async () => {
      response = await putViewMode(accountId, 'toddler');
    });

    it('is refused as a bad request', () => {
      expect(response.status).toBe(400);
    });

    it('says the view mode is unknown', async () => {
      expect((await response.json()).error).toBe(API_ERRORS.unknownViewMode);
    });
  });

  describe('a body that is not an object', () => {
    it('says the request is invalid', async () => {
      const response = await putRawBody(accountId, '"child"');

      expect((await response.json()).error).toBe(
        API_ERRORS.invalidViewModeRequest
      );
    });
  });

  describe("another family's parent", () => {
    let response: Response;

    beforeEach(async () => {
      jest.mocked(signedInUser).mockResolvedValue(mockCoParent);
      response = await putViewMode(accountId, VIEW_MODE.child);
    });

    it('is refused', () => {
      expect(response.status).toBe(403);
    });

    it('leaves the account on the parent screen', async () => {
      expect((await getStore().getAccount(accountId))?.viewMode).toBe(
        VIEW_MODE.parent
      );
    });
  });
});
