import { render, screen } from '@/test-utils/render';
import { moneyAsShown, stillToSaveAsShown } from '@/test-utils/money';
import { StillToSave } from './StillToSave';
import { STILL_TO_SAVE_TEST_IDS } from './constants';

describe('StillToSave', () => {
  const mockStillToSave = 12500;
  const mockSentenceTestId = 'sentence';

  beforeEach(() => {
    render(
      <p data-testid={mockSentenceTestId}>
        <StillToSave stillToSave={mockStillToSave} />
      </p>
    );
  });

  it('shows the amount still to save', () => {
    expect(screen.getByTestId(STILL_TO_SAVE_TEST_IDS.amount)).toHaveTextContent(
      moneyAsShown(mockStillToSave)
    );
  });

  it('says it as one sentence', () => {
    expect(screen.getByTestId(mockSentenceTestId)).toHaveTextContent(
      stillToSaveAsShown(mockStillToSave)
    );
  });
});
