import type { Account, AccountUser } from '@/lib/types';
import { accountsForUser, findAccountUser } from '../account-users';
import {
  createMockAccount,
  createMockAccountUser,
  mockAccount,
  mockAccountUser,
  mockSiblingAccount,
  mockUser,
} from '@/test-utils/fixtures';

const mockParentId = mockUser.id;
const mockUnrelatedParentId = 'u2';

const mockOwnChildAccount = mockAccount;
const mockUnrelatedChildAccount = mockSiblingAccount;
const mockEveryChildAccount = [mockOwnChildAccount, mockUnrelatedChildAccount];

const mockParentOwnsOwnChild = mockAccountUser;
const mockUnrelatedParentOwnsTheirChild = createMockAccountUser({
  accountId: mockUnrelatedChildAccount.id,
  userId: mockUnrelatedParentId,
});

const mockCapitalisedChildName = 'Noa';
const mockLowercaseChildName = 'eitan';
const mockSharedChildName = 'Noa';

function ownedByParent(account: Account): AccountUser {
  return createMockAccountUser({
    accountId: account.id,
    userId: mockParentId,
  });
}

describe('accountsForUser', () => {
  it('returns only the accounts the parent belongs to', () => {
    expect(
      accountsForUser(
        [mockParentOwnsOwnChild, mockUnrelatedParentOwnsTheirChild],
        mockEveryChildAccount,
        mockParentId
      )
    ).toEqual([mockOwnChildAccount]);
  });

  it('orders children by name whatever case the name was typed in', () => {
    const mockCapitalisedChild = createMockAccount({
      id: 'a3',
      name: mockCapitalisedChildName,
    });
    const mockLowercaseChild = createMockAccount({
      id: 'a4',
      name: mockLowercaseChildName,
    });

    expect(
      accountsForUser(
        [
          ownedByParent(mockCapitalisedChild),
          ownedByParent(mockLowercaseChild),
        ],
        [mockCapitalisedChild, mockLowercaseChild],
        mockParentId
      ).map((account) => account.name)
    ).toEqual([mockLowercaseChildName, mockCapitalisedChildName]);
  });

  it('orders two children sharing a name by account id', () => {
    const mockLaterCreatedSibling = createMockAccount({
      id: 'a9',
      name: mockSharedChildName,
    });
    const mockEarlierCreatedSibling = createMockAccount({
      id: 'a5',
      name: mockSharedChildName,
    });

    expect(
      accountsForUser(
        [
          ownedByParent(mockLaterCreatedSibling),
          ownedByParent(mockEarlierCreatedSibling),
        ],
        [mockLaterCreatedSibling, mockEarlierCreatedSibling],
        mockParentId
      ).map((account) => account.id)
    ).toEqual([mockEarlierCreatedSibling.id, mockLaterCreatedSibling.id]);
  });

  it('returns nothing for a parent who belongs to no account', () => {
    expect(
      accountsForUser(
        [mockParentOwnsOwnChild],
        mockEveryChildAccount,
        mockUnrelatedParentId
      )
    ).toEqual([]);
  });
});

describe('findAccountUser', () => {
  it('finds the row joining the child account to its parent', () => {
    expect(
      findAccountUser(
        [mockParentOwnsOwnChild],
        mockOwnChildAccount.id,
        mockParentId
      )
    ).toEqual(mockParentOwnsOwnChild);
  });

  it('returns undefined for a parent who is not on the account', () => {
    expect(
      findAccountUser(
        [mockParentOwnsOwnChild],
        mockOwnChildAccount.id,
        mockUnrelatedParentId
      )
    ).toBeUndefined();
  });

  it('returns undefined for a parent on a child account that is not theirs', () => {
    expect(
      findAccountUser(
        [mockParentOwnsOwnChild],
        mockUnrelatedChildAccount.id,
        mockParentId
      )
    ).toBeUndefined();
  });
});
