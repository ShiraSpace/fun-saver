import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@/test-utils/render';
import { elementsAnimate, finishAnimation } from '@/test-utils/motion';
import { shownCoins } from '@/test-utils/interest-coins';
import { PIGGY_BANK_TEST_IDS } from '../PiggyBank/constants';
import { PiggyBankAndCoins } from './PiggyBankAndCoins';

describe('PiggyBankAndCoins with one ₪2 coin waiting', () => {
  const mockOnCollect = jest.fn();
  const mockOnLand = jest.fn();

  function renderWithOneCoin(): void {
    render(
      <PiggyBankAndCoins
        interestCoins={[{ place: 0, amount: 200, isDropping: false }]}
        piggyBankFill={0}
        onCollect={mockOnCollect}
        onLand={mockOnLand}
        whereFocusGoesLast={createRef<HTMLElement>()}
      />
    );
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

  describe('where elements animate, once the coin is tapped', () => {
    const mockAnimate = jest.fn(() => ({}) as Animation);

    beforeEach(() => {
      elementsAnimate(mockAnimate);
      renderWithOneCoin();
      mockAnimate.mockClear();
      fireEvent.click(shownCoins()[0]);
    });

    it('drops the coin', () => {
      expect(mockAnimate.mock.contexts[0]).toBe(shownCoins()[0]);
    });

    it('waits for the drop before landing it', () => {
      expect(mockOnLand).not.toHaveBeenCalled();
    });

    describe('when the drop finishes', () => {
      beforeEach(() => {
        act(() => finishAnimation(mockAnimate.mock.results[0].value));
      });

      it('lands the coin', () => {
        expect(mockOnLand).toHaveBeenCalledWith(0);
      });

      it('wiggles the piggy bank', () => {
        expect(mockAnimate.mock.contexts[1]).toBe(screen.getByTestId(PIGGY_BANK_TEST_IDS.art));
      });
    });
  });
});
