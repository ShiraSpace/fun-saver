import { fetchJson } from '@/lib/fetch-json';
import {
  mockAccount,
  mockAccountEdits,
  mockCreateAccountRequest,
} from '@/test-utils/mocks/account.mocks';
import { createAccount, updateAccount } from '../account-requests';

jest.mock('@/lib/fetch-json');

describe('account requests', () => {
  it('createAccount posts the new account to the accounts endpoint', async () => {
    await createAccount(mockCreateAccountRequest);

    expect(fetchJson).toHaveBeenCalledWith({
      url: '/api/accounts',
      method: 'POST',
      body: mockCreateAccountRequest,
    });
  });

  it('createAccount returns the account the route answered with', async () => {
    jest.mocked(fetchJson).mockResolvedValue(mockAccount);

    expect(await createAccount(mockCreateAccountRequest)).toEqual(mockAccount);
  });

  it('updateAccount puts the edits to that account', async () => {
    await updateAccount(mockAccount.id, mockAccountEdits);

    expect(fetchJson).toHaveBeenCalledWith({
      url: `/api/accounts/${mockAccount.id}`,
      method: 'PUT',
      body: mockAccountEdits,
    });
  });

  it('updateAccount returns the account the route answered with', async () => {
    jest.mocked(fetchJson).mockResolvedValue(mockAccount);

    expect(await updateAccount(mockAccount.id, mockAccountEdits)).toEqual(mockAccount);
  });
});
