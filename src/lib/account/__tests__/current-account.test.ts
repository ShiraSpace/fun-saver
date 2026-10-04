import { findCurrentAccount, otherAccounts } from '../current-account';

const first = { id: 'a1' };
const second = { id: 'a2' };
const accounts = [first, second];

describe('findCurrentAccount', () => {
  it('finds the account the id names', () => {
    expect(findCurrentAccount(accounts, second.id)).toBe(second);
  });

  it('falls back to the first account when the id names none of them', () => {
    expect(findCurrentAccount(accounts, 'unknown-account-id')).toBe(first);
  });

  it('has nothing to fall back to when there are no accounts', () => {
    expect(findCurrentAccount([], first.id)).toBeUndefined();
  });
});

describe('otherAccounts', () => {
  it('leaves out the current account', () => {
    expect(otherAccounts(accounts, first)).toEqual([second]);
  });

  it("keeps the family's order", () => {
    const third = { id: 'a3' };

    expect(otherAccounts([first, second, third], second)).toEqual([
      first,
      third,
    ]);
  });
});
