import { captureAnimations } from '@/test-utils/motion';
import { dropIntoSlot } from './drop-into-slot';

describe('dropIntoSlot where elements animate', () => {
  const animationsPlayed = captureAnimations();

  it('lets a coin still sliding carry on sliding as it drops', () => {
    const mockOnLand = jest.fn();

    dropIntoSlot({
      coin: document.createElement('button'),
      whereThePiggyBankStands: document.createElement('div'),
      onLand: mockOnLand,
    });

    const [drop] = animationsPlayed;
    expect(drop.options).toEqual(expect.objectContaining({ composite: 'add' }));
  });
});
