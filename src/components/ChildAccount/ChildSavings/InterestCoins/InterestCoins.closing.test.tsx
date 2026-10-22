import { createRef, JSX } from 'react';
import { act, render, screen } from '@/test-utils/render';
import { animationsOn, captureAnimations } from '@/test-utils/motion';
import { mockThreeInterestCoins, shownCoins } from '@/test-utils/interest-coins';
import { InterestCoins, type InterestCoin } from './InterestCoins';
import { INTEREST_COINS_TEST_IDS } from './constants';

describe('InterestCoins', () => {
  const mockOnCollect = jest.fn();
  const mockWhereFocusGoesLast = createRef<HTMLElement>();
  const [mockFirstCoin, mockSecondCoin, mockThirdCoin] = mockThreeInterestCoins;

  function coinsWaiting(interestCoins: InterestCoin[]): JSX.Element {
    return (
      <InterestCoins
        interestCoins={interestCoins}
        onCollect={mockOnCollect}
        whereFocusGoesLast={mockWhereFocusGoesLast}
      />
    );
  }

  function falling(interestCoin: InterestCoin): InterestCoin {
    return { ...interestCoin, isDropping: true };
  }

  function coinSpace(): HTMLElement | null {
    return screen.queryByTestId(INTEREST_COINS_TEST_IDS.copy)?.parentElement ?? null;
  }

  describe('where elements animate', () => {
    const animationsPlayed = captureAnimations();

    describe('in a row where each coin stands one coin further along', () => {
      const mockCoinWidth = 50;
      const mockOneCoinBack = `${mockCoinWidth}px`;
      let mockCoinsSideBySide: jest.SpyInstance;

      beforeEach(() => {
        mockCoinsSideBySide = jest
          .spyOn(HTMLElement.prototype, 'offsetLeft', 'get')
          .mockImplementation(function placeInTheRow(this: HTMLElement): number {
            return [...(this.parentElement?.children ?? [])].indexOf(this) * mockCoinWidth;
          });
      });

      afterEach(() => {
        mockCoinsSideBySide.mockRestore();
      });

      describe('when the first of three lands', () => {
        beforeEach(() => {
          const { rerender } = render(coinsWaiting(mockThreeInterestCoins));
          rerender(coinsWaiting([mockSecondCoin, mockThirdCoin]));
        });

        it('slides each coin over from one coin back', () => {
          expect(animationsPlayed.map(({ keyframes: [from] }) => from)).toEqual([
            { transform: `translateX(${mockOneCoinBack})` },
            { transform: `translateX(${mockOneCoinBack})` },
          ]);
        });

        it('lets a slide still running carry on when the next coin lands', () => {
          const [slide] = animationsPlayed;

          expect(slide.options).toEqual(expect.objectContaining({ composite: 'add' }));
        });
      });

      it('slides nothing when a tapped coin starts to fall', () => {
        const { rerender } = render(coinsWaiting(mockThreeInterestCoins));

        rerender(coinsWaiting([falling(mockFirstCoin), mockSecondCoin, mockThirdCoin]));

        expect(animationsPlayed).toEqual([]);
      });

      it('keeps a falling coin where it was when the coin ahead of it lands', () => {
        const { rerender } = render(coinsWaiting(mockThreeInterestCoins));
        rerender(coinsWaiting([falling(mockFirstCoin), falling(mockSecondCoin), mockThirdCoin]));

        rerender(coinsWaiting([falling(mockSecondCoin), mockThirdCoin]));

        const [hold] = animationsOn(animationsPlayed, shownCoins()[0]);
        expect(hold.keyframes[0]).toEqual({ translate: `${mockOneCoinBack} 0` });
      });
    });

    describe('when the last coin lands', () => {
      beforeEach(() => {
        const { rerender } = render(coinsWaiting([mockThirdCoin]));
        rerender(coinsWaiting([]));
      });

      it('keeps the space while it closes', () => {
        expect(coinSpace()).toBeInTheDocument();
      });

      it('empties the copy line at once', () => {
        expect(screen.getByTestId(INTEREST_COINS_TEST_IDS.copy)).toBeEmptyDOMElement();
      });

      it('closes the space slowly', () => {
        expect(animationsPlayed.map(({ element }) => element)).toEqual([coinSpace()]);
      });

      it('draws nothing once the space has closed', () => {
        const [closing] = animationsPlayed;

        act(() => closing.finish());

        expect(coinSpace()).not.toBeInTheDocument();
      });
    });
  });

  it('closes the space at once when the last coin lands where elements cannot animate', () => {
    const { rerender } = render(coinsWaiting([mockThirdCoin]));

    rerender(coinsWaiting([]));

    expect(coinSpace()).not.toBeInTheDocument();
  });
});
