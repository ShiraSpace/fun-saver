import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { PICTURE_TILES_COPY } from '@/components/Goal/GoalPictureSearch/PictureTiles/constants';
import { PICTURE_TILE_TEST_IDS } from '@/components/Goal/GoalPictureSearch/PictureTiles/PictureTile/constants';
import { CHOOSE_BUTTON_TEST_IDS } from '@/components/Goal/GoalPictureSearch/ChooseButton/constants';
import { GOAL_PICTURE_SEARCH_TEST_IDS } from '@/components/Goal/GoalPictureSearch/constants';
import { GoalFields } from './GoalFields';
import { GOAL_FIELDS_TEST_IDS } from './constants';
import { GOAL_NAME_FIELD_TEST_IDS } from './GoalNameField/constants';
import { GOAL_AMOUNT_FIELD_TEST_IDS } from './GoalAmountField/constants';
import { GOAL_PICTURE_FIELD_TEST_IDS } from './GoalPictureField/constants';
import { SAVE_GOAL_BUTTON_TEST_IDS } from './SaveGoalButton/constants';

async function openLoadedPictureSearch(): Promise<void> {
  fireEvent.click(screen.getByTestId(GOAL_PICTURE_FIELD_TEST_IDS.preview));
  await waitFor(() => expect(screen.queryByText(PICTURE_TILES_COPY.loading)).toBeNull());
}

describe('GoalFields', () => {
  beforeEach(() => {
    render(
      <GoalFields
        savingsBalance={0}
        submitLabel="✓ קובעים יעד"
        onSubmit={jest.fn()}
        onRequestStateChange={jest.fn()}
      />
    );
    fireEvent.change(screen.getByTestId(GOAL_NAME_FIELD_TEST_IDS.input), {
      target: { value: 'אופניים' },
    });
  });

  it('asks for the amount when the parent saves without one', () => {
    fireEvent.click(screen.getByTestId(SAVE_GOAL_BUTTON_TEST_IDS.submit));

    expect(screen.getByTestId(GOAL_AMOUNT_FIELD_TEST_IDS.error)).toBeInTheDocument();
  });

  it('opens the picture search outside the form, so its search box cannot send the goal', async () => {
    await openLoadedPictureSearch();

    expect(screen.getByTestId(GOAL_FIELDS_TEST_IDS.form)).not.toContainElement(
      screen.getByTestId(GOAL_PICTURE_SEARCH_TEST_IDS.sheet)
    );
  });

  describe('after choosing a picture', () => {
    let chosenEmoji: string | null;

    beforeEach(async () => {
      await openLoadedPictureSearch();
      const [firstTile] = screen.getAllByTestId(PICTURE_TILE_TEST_IDS.pictureTile);
      chosenEmoji = firstTile.textContent;
      fireEvent.click(firstTile);
      fireEvent.click(screen.getByTestId(CHOOSE_BUTTON_TEST_IDS.button));
    });

    it('closes the picture search', () => {
      expect(screen.queryByTestId(GOAL_PICTURE_SEARCH_TEST_IDS.sheet)).not.toBeInTheDocument();
    });

    it('shows the chosen picture', () => {
      expect(screen.getByTestId(GOAL_PICTURE_FIELD_TEST_IDS.preview)).toHaveTextContent(
        String(chosenEmoji)
      );
    });
  });
});
