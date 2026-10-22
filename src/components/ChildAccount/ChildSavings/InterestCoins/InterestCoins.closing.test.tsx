import { createRef, JSX } from 'react';
import { act, render, screen } from '@/test-utils/render';
import { elementsAnimate, finishAnimation } from '@/test-utils/motion';
import { mockThreeInterestCoins, shownCoins } from '@/test-utils/interest-coins';
import { InterestCoins, type InterestCoin } from './InterestCoins';
import { INTEREST_COINS_TEST_IDS } from './constants';

describe('InterestCoins', () => {
  const mockOnCollect = jest.fn();
  const mockWhereFocusGoesLast = createRef<HTMLElement>();

  function coinsWaiting(interestCoins: InterestCoin[]): JSX.Element {
    return (
      <InterestCoins
        interestCoins={interestCoins}
        onCollect={mockOnCollect}
        whereFocusGoesLast={mockWhereFocusGoesLast}
      />
    );
  }

  function tappedAndFalling(interestCoin: InterestCoin): InterestCoin {
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

    describe('in a row where the coins sit side by side', () => {
      const mockCoinWidth = 50;
      let mockCoinsSideBySide: jest.SpyInstance;

      beforeEach(() => {
        mockCoinsSideBySide = jest
          .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
          .mockImplementation(function besideTheCoinBefore(this: HTMLElement): number {
            return [...(this.parentElement?.children ?? [])].indexOf(this) * mockCoinWidth;
          });
      });

      afterEach(() => {
        mockCoinsSideBySide.mockRestore();
      });

      describe('when the first of three lands', () => {
        beforeEach(() => {
          const { rerender } = render(coinsWaiting(mockThreeInterestCoins));
          rerender(coinsWaiting(mockThreeInterestCoins.slice(1)));
        });

        it('slides the coins left over from where they were', () => {
          expect(mockAnimate.mock.calls.map(([keyframes]) => keyframes[0])).toEqual([
            { transform: `translateX(${mockCoinWidth}px)` },
            { transform: `translateX(${mockCoinWidth}px)` },
          ]);
        });

        it('lets a slide still running carry on when the next coin lands', () => {
          expect(mockAnimate.mock.calls[0][1]).toMatchObject({ composite: 'add' });
        });
      });

      it('slides nothing when a coin starts tappedAndFalling', () => {
        const [first, second, third] = mockThreeInterestCoins;
        const { rerender } = render(coinsWaiting(mockThreeInterestCoins));

        rerender(coinsWaiting([tappedAndFalling(first), second, third]));

        expect(mockAnimate).not.toHaveBeenCalled();
      });

      it('leaves a falling coin to its drop when the coin ahead of it lands', () => {
        const [first, second, third] = mockThreeInterestCoins;
        const { rerender } = render(coinsWaiting(mockThreeInterestCoins));
        rerender(coinsWaiting([tappedAndFalling(first), tappedAndFalling(second), third]));

        rerender(coinsWaiting([tappedAndFalling(second), third]));

        expect(mockAnimate.mock.contexts).toEqual([shownCoins()[1]]);
      });
    });

    describe('when the last coin lands', () => {
      beforeEach(() => {
        const { rerender } = render(coinsWaiting(mockThreeInterestCoins.slice(2)));
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
    const { rerender } = render(coinsWaiting(mockThreeInterestCoins.slice(2)));

    rerender(coinsWaiting([]));

    expect(screen.queryByTestId(INTEREST_COINS_TEST_IDS.copy)).not.toBeInTheDocument();
  });
});
