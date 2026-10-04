import { WALLET_NAMES } from '../constants';

describe('WALLET_NAMES', () => {
  it('lists savings first, then spending, then good deeds', () => {
    expect(WALLET_NAMES).toEqual(['savings', 'spending', 'goodDeeds']);
  });
});
