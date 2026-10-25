import { fetchJson } from '@/lib/fetch-json';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { cancelGoal, setGoal } from '../goal-requests';

jest.mock('@/lib/fetch-json');

describe('goal requests', () => {
  const mockRequest = { name: mockGoal.name, amount: 300, picture: mockGoal.picture };

  it("setGoal posts the goal to the account's goals", async () => {
    await setGoal({ accountId: mockAccount.id, request: mockRequest });

    expect(fetchJson).toHaveBeenCalledWith({
      url: `/api/accounts/${mockAccount.id}/goals`,
      method: 'POST',
      body: mockRequest,
    });
  });

  it('setGoal returns the goal that was set', async () => {
    jest.mocked(fetchJson).mockResolvedValue(mockGoal);

    expect(await setGoal({ accountId: mockAccount.id, request: mockRequest })).toEqual(mockGoal);
  });

  it('cancelGoal deletes that goal', async () => {
    await cancelGoal(mockGoal);

    expect(fetchJson).toHaveBeenCalledWith({
      url: `/api/accounts/${mockGoal.accountId}/goals/${mockGoal.id}`,
      method: 'DELETE',
    });
  });
});
