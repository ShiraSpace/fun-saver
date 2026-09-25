import { validDeposit, validWithdrawal } from '../transaction-input';

describe('validDeposit', () => {
  it('returns the amount from a well formed body', () => {
    expect(validDeposit({ amount: 20 })).toBe(20);
  });

  it.each([
    ['an amount that arrived as a string', { amount: '20' }],
    ['a body with no amount', {}],
    ['a body that is not an object', 'twenty'],
    ['an array body', []],
    ['no body at all', null],
  ])('refuses %s', (_label, body) => {
    expect(validDeposit(body)).toBeUndefined();
  });
});

describe('validWithdrawal', () => {
  it('returns the wallet and the amount from a well formed body', () => {
    expect(validWithdrawal({ walletId: 'w1', amount: 20 })).toEqual({
      walletId: 'w1',
      amountShekels: 20,
    });
  });

  it.each([
    ['an amount with no wallet to take it from', { amount: 20 }],
    ['a wallet with no amount', { walletId: 'w1' }],
    ['an amount that arrived as a string', { walletId: 'w1', amount: '20' }],
    ['a wallet that is not a string', { walletId: 7, amount: 20 }],
    ['no body at all', null],
  ])('refuses %s', (_label, body) => {
    expect(validWithdrawal(body)).toBeUndefined();
  });
});
