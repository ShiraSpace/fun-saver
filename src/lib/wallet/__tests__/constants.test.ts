import { WALLET_NAME_LIST } from '../constants';

describe('WALLET_NAME_LIST', () => {
  it('lists savings first, then spending, then good deeds', () => {
    expect(WALLET_NAME_LIST).toEqual(['savings', 'spending', 'goodDeeds']);
  });
});
