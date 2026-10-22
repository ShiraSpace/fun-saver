import { renderHook } from '@testing-library/react';
import { mockThreeInterestCoins } from '@/test-utils/interest-coins';
import { useCoinsCloseTheGap } from './use-coins-close-the-gap';

it('hands each coin the same ref from one render to the next', () => {
  const [mockFirstCoin] = mockThreeInterestCoins;
  const { result, rerender } = renderHook(useCoinsCloseTheGap, {
    initialProps: mockThreeInterestCoins,
  });
  const refBefore = result.current(mockFirstCoin.place);

  rerender(mockThreeInterestCoins.slice(1));

  expect(result.current(mockFirstCoin.place)).toBe(refBefore);
});
