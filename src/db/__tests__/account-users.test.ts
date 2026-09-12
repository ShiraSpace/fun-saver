import { accountsForUser, findAccountUser } from '../account-users';
import {
  createMockAccount,
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

  it('orders the accounts by name regardless of letter case', () => {
    const mockUpperAccount = createMockAccount({ id: 'a3', name: 'Noa' });
    const mockLowerAccount = createMockAccount({ id: 'a4', name: 'eitan' });
    const accountUsers = [
      createMockAccountUser({ accountId: mockUpperAccount.id }),
      createMockAccountUser({ accountId: mockLowerAccount.id }),
    ];

    expect(
      accountsForUser(
        accountUsers,
        [mockUpperAccount, mockLowerAccount],
        mockUser.id
      ).map((account) => account.name)
    ).toEqual([mockLowerAccount.name, mockUpperAccount.name]);
  });

  it('breaks a tie on equal names with the account id', () => {
    const mockLaterAccount = createMockAccount({ id: 'a9', name: 'Noa' });
    const mockEarlierAccount = createMockAccount({ id: 'a5', name: 'Noa' });
    const accountUsers = [
      createMockAccountUser({ accountId: mockLaterAccount.id }),
      createMockAccountUser({ accountId: mockEarlierAccount.id }),
    ];

    expect(
      accountsForUser(
        accountUsers,
        [mockLaterAccount, mockEarlierAccount],
        mockUser.id
      ).map((account) => account.id)
    ).toEqual([mockEarlierAccount.id, mockLaterAccount.id]);
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
