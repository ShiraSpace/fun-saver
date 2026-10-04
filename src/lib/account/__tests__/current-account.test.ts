import { findCurrentAccount } from '../current-account';

const mockFirstAccount = { id: 'a1' };
const mockSecondAccount = { id: 'a2' };
const mockAccounts = [mockFirstAccount, mockSecondAccount];

describe('findCurrentAccount', () => {
  it('finds the account the id names', () => {
    expect(findCurrentAccount(mockAccounts, mockSecondAccount.id)).toBe(
      mockSecondAccount
    );
  });

  it('falls back to the first account when the id names none of them', () => {
    expect(findCurrentAccount(mockAccounts, 'unknown-account-id')).toBe(
      mockFirstAccount
    );
  });

  it('has nothing to fall back to when there are no accounts', () => {
    expect(findCurrentAccount([], mockFirstAccount.id)).toBeUndefined();
  });
});
