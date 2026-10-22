import { renderHook } from '@testing-library/react';
import { mockThreeInterestCoins } from '@/test-utils/interest-coins';
import { COIN_SPACE_SETTLES_AFTER_MS } from './InterestCoins/constants';
import { useCelebrationWait } from './use-celebration-wait';

describe('useCelebrationWait', () => {
  const [mockFirstCoin, mockSecondCoin] = mockThreeInterestCoins;
  const noWait = 0;

  it('waits for the coin space to settle when the last coin reaches the goal', () => {
    const { result, rerender } = renderHook(useCelebrationWait, {
      initialProps: { isGoalReached: false, interestCoins: [mockFirstCoin] },
    });

    rerender({ isGoalReached: true, interestCoins: [] });

    expect(result.current).toBe(COIN_SPACE_SETTLES_AFTER_MS);
  });

  it('does not wait when a coin with others still waiting reaches the goal', () => {
    const { result, rerender } = renderHook(useCelebrationWait, {
      initialProps: { isGoalReached: false, interestCoins: [mockFirstCoin, mockSecondCoin] },
    });

    rerender({ isGoalReached: true, interestCoins: [mockSecondCoin] });

    expect(result.current).toBe(noWait);
  });

  it('does not wait when the goal is reached with no coin landing', () => {
    const { result, rerender } = renderHook(useCelebrationWait, {
      initialProps: { isGoalReached: false, interestCoins: [] },
    });

    rerender({ isGoalReached: true, interestCoins: [] });

    expect(result.current).toBe(noWait);
  });

  it('does not wait when the goal was already reached as the screen opened', () => {
    const { result } = renderHook(useCelebrationWait, {
      initialProps: { isGoalReached: true, interestCoins: [] },
    });

    expect(result.current).toBe(noWait);
  });

  it('keeps its wait once the celebration has started', () => {
    const { result, rerender } = renderHook(useCelebrationWait, {
      initialProps: { isGoalReached: false, interestCoins: [mockFirstCoin] },
    });
    rerender({ isGoalReached: true, interestCoins: [] });

    rerender({ isGoalReached: true, interestCoins: [] });

    expect(result.current).toBe(COIN_SPACE_SETTLES_AFTER_MS);
  });
});
