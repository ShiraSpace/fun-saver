import type { Account, AccountUser } from '@/lib/types';
import type { AccountOwner } from '../data-store';
import { assignOwners } from '../assign-owner';
import {
  createMockAccountUser,
  mockAccount,
  mockAccountUser,
  mockSecondAccount,
} from '@/test-utils/fixtures';

const mockBackfillUserId = 'u7';
const mockBackfillAddedAt = '2026-09-15T18:50:20.147Z';

const mockOwner: AccountOwner = {
  userId: mockBackfillUserId,
  addedAt: mockBackfillAddedAt,
};

const mockRowOwnedByAnotherUser = mockAccountUser;

function ownerRowFor(account: Account): AccountUser {
  return createMockAccountUser({
    accountId: account.id,
    userId: mockOwner.userId,
    addedAt: mockOwner.addedAt,
  });
}

describe('assignOwners', () => {
  it('gives an account with no member row an owner row', () => {
    expect(
      assignOwners({
        accounts: [mockAccount],
        accountUsers: [],
        owner: mockOwner,
      })
    ).toEqual([ownerRowFor(mockAccount)]);
  });

  it('gives every unclaimed account a row, not just the first', () => {
    expect(
      assignOwners({
        accounts: [mockAccount, mockSecondAccount],
        accountUsers: [],
        owner: mockOwner,
      })
    ).toEqual([ownerRowFor(mockAccount), ownerRowFor(mockSecondAccount)]);
  });

  it('leaves an account that already has a member row alone', () => {
    expect(
      assignOwners({
        accounts: [mockAccount, mockSecondAccount],
        accountUsers: [mockRowOwnedByAnotherUser],
        owner: mockOwner,
      })
    ).toEqual([ownerRowFor(mockSecondAccount)]);
  });

  it('skips an account owned by someone else instead of adding a second owner', () => {
    expect(
      assignOwners({
        accounts: [mockAccount],
        accountUsers: [mockRowOwnedByAnotherUser],
        owner: mockOwner,
      })
    ).toEqual([]);
  });

  it('assigns nothing on a second run', () => {
    expect(
      assignOwners({
        accounts: [mockAccount],
        accountUsers: [ownerRowFor(mockAccount)],
        owner: mockOwner,
      })
    ).toEqual([]);
  });
});
