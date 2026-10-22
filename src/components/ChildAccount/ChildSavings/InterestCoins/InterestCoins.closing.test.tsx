import { createRef, JSX } from 'react';
import { act, render, screen } from '@/test-utils/render';
import { elementsAnimate, finishAnimation } from '@/test-utils/motion';
import { shownCoins } from '@/test-utils/interest-coins';
import { InterestCoins, type InterestCoin } from './InterestCoins';
import { INTEREST_COINS_TEST_IDS } from './constants';

describe('InterestCoins', () => {
  const mockOnCollect = jest.fn();
  const mockWhereFocusGoesLast = createRef<HTMLElement>();
  const mockThreeCoins: InterestCoin[] = [
    { place: 0, amount: 300, isDropping: false },
    { place: 1, amount: 200, isDropping: false },
    { place: 2, amount: 200, isDropping: false },
  ];

  function coinsWaiting(interestCoins: InterestCoin[]): JSX.Element {
    return (
      <InterestCoins
        interestCoins={interestCoins}
        onCollect={mockOnCollect}
        whereFocusGoesLast={mockWhereFocusGoesLast}
      />
    );
  }

  function dropping(interestCoin: InterestCoin): InterestCoin {
    return { ...interestCoin, isDropping: true };
  }

  describe('where elements animate', () => {
    const mockAnimate = jest.fn<Animation, [Keyframe[], KeyframeAnimationOptions?]>(
      () => ({ cancel: (): void => {} }) as Animation
    );

    beforeEach(() => {
      mockAnimate.mockClear();
      elementsAnimate(mockAnimate);
    });

    describe('in a row where each coin has its own spot', () => {
      const mockSpotWidth = 50;
      let mockSpotInRow: jest.SpyInstance;

      beforeEach(() => {
        mockSpotInRow = jest
          .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
          .mockImplementation(function spotInRow(this: HTMLElement): number {
            return [...(this.parentElement?.children ?? [])].indexOf(this) * mockSpotWidth;
          });
      });

      afterEach(() => {
        mockSpotInRow.mockRestore();
      });

      it('slides the coins left over from where they were when the first of three lands', () => {
        const { rerender } = render(coinsWaiting(mockThreeCoins));

        rerender(coinsWaiting(mockThreeCoins.slice(1)));

        expect(mockAnimate.mock.calls.map(([keyframes]) => keyframes[0])).toEqual([
          { transform: `translateX(${mockSpotWidth}px)` },
          { transform: `translateX(${mockSpotWidth}px)` },
        ]);
      });

      it('slides nothing when a coin starts dropping', () => {
        const [first, second, third] = mockThreeCoins;
        const { rerender } = render(coinsWaiting(mockThreeCoins));

        rerender(coinsWaiting([dropping(first), second, third]));

        expect(mockAnimate).not.toHaveBeenCalled();
      });

      it('leaves a falling coin to its drop when the coin ahead of it lands', () => {
        const [first, second, third] = mockThreeCoins;
        const { rerender } = render(coinsWaiting(mockThreeCoins));
        rerender(coinsWaiting([dropping(first), dropping(second), third]));

        rerender(coinsWaiting([dropping(second), third]));

        expect(mockAnimate.mock.contexts).toEqual([shownCoins()[1]]);
      });
    });

    describe('when the last coin lands', () => {
      beforeEach(() => {
        const { rerender } = render(coinsWaiting(mockThreeCoins.slice(2)));
        rerender(coinsWaiting([]));
      });

      it('keeps the space while it closes', () => {
        expect(screen.getByTestId(INTEREST_COINS_TEST_IDS.copy)).toBeInTheDocument();
      });

      it('empties the copy line at once', () => {
        expect(screen.getByTestId(INTEREST_COINS_TEST_IDS.copy)).toBeEmptyDOMElement();
      });

      it('closes the space slowly', () => {
        expect(mockAnimate.mock.contexts).toEqual([
          screen.getByTestId(INTEREST_COINS_TEST_IDS.copy).parentElement,
        ]);
      });

      it('draws nothing once the space has closed', () => {
        act(() => finishAnimation(mockAnimate.mock.results[0].value));

        expect(screen.queryByTestId(INTEREST_COINS_TEST_IDS.copy)).not.toBeInTheDocument();
      });
    });
  });

  it('closes the space at once when the last coin lands where elements cannot animate', () => {
    const { rerender } = render(coinsWaiting(mockThreeCoins.slice(2)));

    rerender(coinsWaiting([]));

    expect(screen.queryByTestId(INTEREST_COINS_TEST_IDS.copy)).not.toBeInTheDocument();
  });
});
