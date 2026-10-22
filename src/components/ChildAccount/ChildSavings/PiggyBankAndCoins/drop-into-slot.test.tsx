import { captureAnimations } from '@/test-utils/motion';
import { dropIntoSlot } from './drop-into-slot';

describe('dropIntoSlot where elements animate', () => {
  const animationsPlayed = captureAnimations();
  const mockOnLand = jest.fn();

  describe('with a piggy bank to drop the coin into', () => {
    beforeEach(() => {
      mockOnLand.mockClear();
      dropIntoSlot({
        coin: document.createElement('button'),
        whereThePiggyBankStands: document.createElement('div'),
        onLand: mockOnLand,
      });
    });

    it('lets a coin still sliding carry on sliding as it drops', () => {
      const [drop] = animationsPlayed;

      expect(drop.options).toEqual(expect.objectContaining({ composite: 'add' }));
    });

    it('lands a coin whose drop is cancelled', () => {
      const [drop] = animationsPlayed;

      drop.cancel();

      expect(mockOnLand).toHaveBeenCalled();
    });
  });

  it('lands a coin at once when there is no piggy bank to drop it into', () => {
    mockOnLand.mockClear();

    dropIntoSlot({
      coin: document.createElement('button'),
      whereThePiggyBankStands: null,
      onLand: mockOnLand,
    });

    expect(mockOnLand).toHaveBeenCalled();
  });
});
