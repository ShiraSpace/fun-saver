import { render, screen } from '@/test-utils/render';
import { piggyBankPaintIds } from '../piggy-bank-paint-ids';
import { PiggyBankFace } from './PiggyBankFace';
import { PIGGY_BANK_FACE_TEST_IDS } from './constants';

const mockPaintIds = piggyBankPaintIds('mock-piggy-bank');

describe('PiggyBankFace', () => {
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
});
