import { render, screen } from '@/test-utils/render';
import { TotalChip } from './TotalChip';
import { TOTAL_CHIP_COPY, TOTAL_CHIP_TEST_IDS } from './constants';

describe('TotalChip', () => {
  beforeEach(() => {
    render(<TotalChip totalBalance={16000} />);
  });

  it('shows the total label', () => {
    expect(screen.getByTestId(TOTAL_CHIP_TEST_IDS.chip)).toHaveTextContent(
      TOTAL_CHIP_COPY.label
    );
  });

  it('shows the summed amount in shekels', () => {
    const amount = screen.getByTestId(TOTAL_CHIP_TEST_IDS.amount);

    expect(amount).toHaveTextContent('₪');
    expect(amount).toHaveTextContent('160');
  });
});
