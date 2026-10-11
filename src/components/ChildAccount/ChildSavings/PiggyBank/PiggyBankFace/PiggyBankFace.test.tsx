import { render } from '@/test-utils/render';
import { paintOf, piggyBankPaintIds } from '../piggy-bank-paint-ids';
import { PiggyBankFace } from './PiggyBankFace';

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
    const snoutPaint = paintOf(mockPaintIds.snout);

    expect(document.querySelectorAll(`[fill="${snoutPaint}"]`)).toHaveLength(1);
  });
});
