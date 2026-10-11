import { render } from '@/test-utils/render';
import { piggyBankPaintIds } from '../piggy-bank-paint-ids';
import { PiggyBankPaints } from './PiggyBankPaints';

const mockPaintIds = piggyBankPaintIds('mock-piggy-bank');

describe('PiggyBankPaints', () => {
  beforeEach(() => {
    render(
      <svg>
        <PiggyBankPaints paintIds={mockPaintIds} />
      </svg>
    );
  });

  it('defines every paint the drawing fills with', () => {
    const { coinFace, body, ear, snout, glass, belly, shadowBlur, shineBlur } = mockPaintIds;
    const paints = [coinFace, body, ear, snout, glass, belly, shadowBlur, shineBlur];

    expect(paints.filter((paint) => !document.getElementById(paint.id))).toEqual([]);
  });
});
