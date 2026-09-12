import { accountsForUser, findAccountUser } from '../account-users';
import {
  createMockAccountUser,
  mockAccount,
  mockAccountUser,
  mockSecondAccount,
  mockUser,
} from '@/test-utils/fixtures';

const mockOtherUserId = 'u2';
const mockAccounts = [mockAccount, mockSecondAccount];

describe('accountsForUser', () => {
  it('returns only the accounts the user belongs to', () => {
    const accountUsers = [
      mockAccountUser,
      createMockAccountUser({
        accountId: mockSecondAccount.id,
        userId: mockOtherUserId,
      }),
    ];

    expect(accountsForUser(accountUsers, mockAccounts, mockUser.id)).toEqual([
      mockAccount,
    ]);
  });

  it('orders the accounts by name', () => {
    const accountUsers = [
      mockAccountUser,
      createMockAccountUser({ accountId: mockSecondAccount.id }),
    ];

    expect(
      accountsForUser(accountUsers, mockAccounts, mockUser.id).map(
        (account) => account.name
      )
    ).toEqual([mockSecondAccount.name, mockAccount.name]);
  });

  it('returns nothing for a user who belongs to no account', () => {
    expect(
      accountsForUser([mockAccountUser], mockAccounts, mockOtherUserId)
    ).toEqual([]);
  });
});

describe('findAccountUser', () => {
  it('finds the row joining the account and the user', () => {
    expect(
      findAccountUser([mockAccountUser], mockAccount.id, mockUser.id)
    ).toEqual(mockAccountUser);
  });

  it('returns undefined for a user who is not on the account', () => {
    expect(
      findAccountUser([mockAccountUser], mockAccount.id, mockOtherUserId)
    ).toBeUndefined();
  });

  it('returns undefined for the user on an account they do not belong to', () => {
    expect(
      findAccountUser([mockAccountUser], mockSecondAccount.id, mockUser.id)
    ).toBeUndefined();
  });
});
