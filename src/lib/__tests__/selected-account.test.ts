import { selectedAccount } from '../selected-account';

const first = { id: 'a1' };
const second = { id: 'a2' };
const accounts = [first, second];

describe('selectedAccount', () => {
  it('finds the account the id names', () => {
    expect(selectedAccount(accounts, second.id)).toBe(second);
  });

  it('falls back to the first account when the id names none of them', () => {
    expect(selectedAccount(accounts, 'unknown-account-id')).toBe(first);
  });

  it('has nothing to fall back to when there are no accounts', () => {
    expect(selectedAccount([], first.id)).toBeUndefined();
  });
});
