import { render, screen } from '@/test-utils/render';
import { piggyBankPaintIds } from '../piggy-bank-paint-ids';
import { PIGGY_BANK_SHAPE } from '../constants';
import { PiggyBankFace } from './PiggyBankFace';
import { PIGGY_BANK_FACE_TEST_IDS } from './constants';

const mockPaintIds = piggyBankPaintIds('mock-piggy-bank');

describe('PiggyBankFace', () => {
  describe('while the goal is not reached', () => {
    beforeEach(() => {
      render(
        <svg>
          <PiggyBankFace paintIds={mockPaintIds} />
        </svg>
      );
    });

    it('paints the snout with its own paint', () => {
      expect(screen.getByTestId(PIGGY_BANK_FACE_TEST_IDS.snout)).toHaveAttribute(
        'fill',
        mockPaintIds.snout.url
      );
    });

    it('keeps both eyes open', () => {
      expect(screen.getAllByTestId(PIGGY_BANK_FACE_TEST_IDS.eye)).toHaveLength(
        PIGGY_BANK_SHAPE.eyes.length
      );
    });
  });

  describe('for a reached goal', () => {
    beforeEach(() => {
      render(
        <svg>
          <PiggyBankFace paintIds={mockPaintIds} isGoalReached />
        </svg>
      );
    });

    it('draws both eyes happy', () => {
      expect(screen.getAllByTestId(PIGGY_BANK_FACE_TEST_IDS.happyEye)).toHaveLength(
        PIGGY_BANK_SHAPE.happyEyes.length
      );
    });

    it('brightens both cheeks', () => {
      const happyCheekOpacity = String(PIGGY_BANK_SHAPE.happyCheekOpacity);

      const cheekOpacities = screen
        .getAllByTestId(PIGGY_BANK_FACE_TEST_IDS.cheek)
        .map((cheek) => cheek.getAttribute('opacity'));

      expect(cheekOpacities).toEqual(PIGGY_BANK_SHAPE.cheeks.map(() => happyCheekOpacity));
    });
  });
});
