import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@/test-utils/render';
import { animationsOn, captureAnimations } from '@/test-utils/motion';
import { shownCoins } from '@/test-utils/interest-coins';
import { PIGGY_BANK_BREATHE, PIGGY_BANK_TEST_IDS, PIGGY_BANK_WIGGLE } from '../PiggyBank/constants';
import { PiggyBankAndCoins } from './PiggyBankAndCoins';

describe('PiggyBankAndCoins with one ₪2 coin waiting', () => {
  const mockOnCollect = jest.fn();
  const mockOnLand = jest.fn();

  function renderWithOneCoin(): void {
    render(
      <PiggyBankAndCoins
        interestCoins={[{ place: 0, amount: 200, isDropping: false }]}
        piggyBankFill={0}
        isGoalReached={false}
        onCollect={mockOnCollect}
        onLand={mockOnLand}
        whereFocusGoesLast={createRef<HTMLElement>()}
      />
    );
  }

  function piggyBank(): HTMLElement {
    return screen.getByTestId(PIGGY_BANK_TEST_IDS.art);
  }

  beforeEach(() => {
    mockOnCollect.mockClear();
    mockOnLand.mockClear();
  });

  describe('where elements cannot animate, once the coin is tapped', () => {
    beforeEach(() => {
      renderWithOneCoin();
      fireEvent.click(shownCoins()[0]);
    });

    it('collects the coin by its place', () => {
      expect(mockOnCollect).toHaveBeenCalledWith(0);
    });

    it('lands the coin at once', () => {
      expect(mockOnLand).toHaveBeenCalledWith(0);
    });
  });

  describe('where elements animate', () => {
    const animationsPlayed = captureAnimations();

    beforeEach(() => {
      renderWithOneCoin();
    });

    it('breathes as the screen opens', () => {
      const [breath] = animationsOn(animationsPlayed, piggyBank());

      expect(breath.options).toEqual(
        expect.objectContaining({ iterations: PIGGY_BANK_BREATHE.breaths })
      );
    });

    describe('once the coin is tapped', () => {
      beforeEach(() => {
        fireEvent.click(shownCoins()[0]);
      });

      it('drops the coin', () => {
        expect(animationsOn(animationsPlayed, shownCoins()[0])).toHaveLength(1);
      });

      it('waits for the drop before landing it', () => {
        expect(mockOnLand).not.toHaveBeenCalled();
      });

      describe('when the drop finishes', () => {
        beforeEach(() => {
          const [drop] = animationsOn(animationsPlayed, shownCoins()[0]);

          act(() => drop.finish());
        });

        it('lands the coin', () => {
          expect(mockOnLand).toHaveBeenCalledWith(0);
        });

        it('wiggles the piggy bank', () => {
          const latestOnThePiggyBank = animationsOn(animationsPlayed, piggyBank()).at(-1);

          expect(latestOnThePiggyBank?.options).toEqual(
            expect.objectContaining({ duration: PIGGY_BANK_WIGGLE.durationMs })
          );
        });
      });
    });
  });
});
