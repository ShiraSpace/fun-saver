import { act, renderHook } from '@testing-library/react';
import { elementsCanAnimate, prefersMotion } from '@/test-utils/motion';
import { mockThreeInterestCoins } from '@/test-utils/interest-coins';
import { COIN_SPACE_SETTLES_AFTER_MS } from './InterestCoins/constants';
import { useGoalReachedOnceTheCoinsSettle } from './use-goal-reached-once-the-coins-settle';

describe('useGoalReachedOnceTheCoinsSettle where elements animate', () => {
  const [mockFirstCoin, mockSecondCoin] = mockThreeInterestCoins;

  beforeEach(() => {
    prefersMotion();
    elementsCanAnimate();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('when the last coin reaches the goal', () => {
    let isGoalReachedShown: () => boolean;

    beforeEach(() => {
      const { result, rerender } = renderHook(useGoalReachedOnceTheCoinsSettle, {
        initialProps: { isGoalReached: false, interestCoins: [mockFirstCoin] },
      });
      rerender({ isGoalReached: true, interestCoins: [] });
      isGoalReachedShown = (): boolean => result.current;
    });

    it('holds the goal back while the coin space settles', () => {
      expect(isGoalReachedShown()).toBe(false);
    });

    it('shows the goal reached once the coin space has settled', () => {
      act(() => jest.advanceTimersByTime(COIN_SPACE_SETTLES_AFTER_MS));

      expect(isGoalReachedShown()).toBe(true);
    });
  });

  it('shows the goal reached at once when it is reached with no coin landing', () => {
    const { result, rerender } = renderHook(useGoalReachedOnceTheCoinsSettle, {
      initialProps: { isGoalReached: false, interestCoins: [] },
    });

    rerender({ isGoalReached: true, interestCoins: [] });

    expect(result.current).toBe(true);
  });

  it('shows the goal reached at once when it was already reached as the screen opened', () => {
    const { result } = renderHook(useGoalReachedOnceTheCoinsSettle, {
      initialProps: { isGoalReached: true, interestCoins: [] },
    });

    expect(result.current).toBe(true);
  });

  it('shows the goal reached at once when a coin with others still waiting reaches it', () => {
    const { result, rerender } = renderHook(useGoalReachedOnceTheCoinsSettle, {
      initialProps: { isGoalReached: false, interestCoins: [mockFirstCoin, mockSecondCoin] },
    });

    rerender({ isGoalReached: true, interestCoins: [mockSecondCoin] });

    expect(result.current).toBe(true);
  });
});

it('shows the goal reached at once when the last coin reaches it where elements cannot animate', () => {
  const [mockLastCoin] = mockThreeInterestCoins;
  const { result, rerender } = renderHook(useGoalReachedOnceTheCoinsSettle, {
    initialProps: { isGoalReached: false, interestCoins: [mockLastCoin] },
  });

  rerender({ isGoalReached: true, interestCoins: [] });

  expect(result.current).toBe(true);
});
