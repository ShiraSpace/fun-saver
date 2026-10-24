import { fetchJson } from '@/lib/fetch-json';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { setGoal } from '../goal-requests';

jest.mock('@/lib/fetch-json');

describe('goal requests', () => {
  it("setGoal posts the goal to the account's goals", async () => {
    const mockRequest = { name: mockGoal.name, amount: 300, picture: mockGoal.picture };

    await setGoal({ accountId: mockAccount.id, request: mockRequest });

    expect(fetchJson).toHaveBeenCalledWith({
      url: `/api/accounts/${mockAccount.id}/goals`,
      method: 'POST',
      body: mockRequest,
    });
  });
});
