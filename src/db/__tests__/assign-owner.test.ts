import type { AccountOwner } from '../data-store';
import { assignOwners } from '../assign-owner';
import {
  createMockAccountUser,
  mockAccount,
  mockAccountUser,
  mockSecondAccount,
  mockUser,
} from '@/test-utils/fixtures';

const mockOwner: AccountOwner = {
  userId: mockUser.id,
  addedAt: mockAccountUser.addedAt,
};

const mockUnrelatedParentId = 'u2';

describe('assignOwners', () => {
  it('gives an account with no member row an owner row', () => {
    expect(
      assignOwners({
        accounts: [mockAccount],
        accountUsers: [],
        owner: mockOwner,
      })
    ).toEqual([mockAccountUser]);
  });

  it('leaves an account that already has a member row alone', () => {
    expect(
      assignOwners({
        accounts: [mockAccount, mockSecondAccount],
        accountUsers: [mockAccountUser],
        owner: mockOwner,
      })
    ).toEqual([createMockAccountUser({ accountId: mockSecondAccount.id })]);
  });

  it('skips an account owned by someone else instead of adding a second owner', () => {
    expect(
      assignOwners({
        accounts: [mockAccount],
        accountUsers: [
          createMockAccountUser({ userId: mockUnrelatedParentId }),
        ],
        owner: mockOwner,
      })
    ).toEqual([]);
  });

  it('assigns nothing on a second run', () => {
    expect(
      assignOwners({
        accounts: [mockAccount],
        accountUsers: [mockAccountUser],
        owner: mockOwner,
      })
    ).toEqual([]);
  });
});
