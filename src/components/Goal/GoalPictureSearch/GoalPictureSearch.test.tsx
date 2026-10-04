import { act, fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { DEFAULT_GOAL_PICTURE, GOAL_PICTURE_KIND } from '@/lib/goal/constants';
import type { GoalPicture } from '@/lib/goal/types';
import { createMockGoalPicture } from '@/test-utils/mocks/goal.mocks';
import { ESCAPE_KEY } from '@/hooks/constants';
import { GoalPictureSearch } from './GoalPictureSearch';
import {
  GOAL_PICTURE_SEARCH_TEST_IDS,
  PICTURE_SEARCH_DELAY_MS,
} from './constants';
import { CHOOSE_BUTTON_TEST_IDS } from './ChooseButton/constants';
import {
  PICTURE_TILES_COPY,
  PICTURE_TILES_TEST_IDS,
} from './PictureTiles/constants';
import { QUERY_FIELD_TEST_IDS } from './QueryField/constants';
import { SHEET_HEADING_TEST_IDS } from './SheetHeading/constants';

const mockGoalName = 'אופניים';
const mockOnChange = jest.fn();
const mockOnClose = jest.fn();

async function renderLoadedSheet(picture: GoalPicture | null): Promise<void> {
  render(
    <GoalPictureSearch
      goalName={mockGoalName}
      picture={picture}
      onChange={mockOnChange}
      onClose={mockOnClose}
    />
  );
  await waitFor(() =>
    expect(screen.queryByText(PICTURE_TILES_COPY.loading)).toBeNull()
  );
}

function tilePictures(): (string | null)[] {
  return screen
    .getAllByTestId(PICTURE_TILES_TEST_IDS.tile)
    .map((tile) => tile.textContent);
}

describe('GoalPictureSearch', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnClose.mockClear();
  });

  describe('opened with no picture', () => {
    beforeEach(async () => {
      await renderLoadedSheet(null);
    });

    it('opens searching for the goal name', () => {
      expect(tilePictures()).toContain('🚲');
    });

    it('is named by its title', () => {
      expect(
        screen.getByRole('dialog', { name: /בחירת תמונה/ })
      ).toBeInTheDocument();
    });

    describe('after typing another word', () => {
      beforeEach(async () => {
        fireEvent.change(screen.getByTestId(QUERY_FIELD_TEST_IDS.input), {
          target: { value: 'כלב' },
        });
        await act(
          () =>
            new Promise((resolve) =>
              setTimeout(resolve, PICTURE_SEARCH_DELAY_MS)
            )
        );
      });

      it('searches for what was typed', () => {
        expect(tilePictures()).toContain('🐶');
      });
    });

    describe('after choosing without tapping a tile', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByTestId(CHOOSE_BUTTON_TEST_IDS.button));
      });

      it('sends the default picture', () => {
        expect(mockOnChange).toHaveBeenCalledWith(DEFAULT_GOAL_PICTURE);
      });
    });

    describe('after tapping the bicycle and choosing', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByText('🚲'));
        fireEvent.click(screen.getByTestId(CHOOSE_BUTTON_TEST_IDS.button));
      });

      it('sends the bicycle as the goal picture', () => {
        expect(mockOnChange).toHaveBeenCalledWith({
          kind: GOAL_PICTURE_KIND.emoji,
          emoji: '🚲',
        });
      });
    });

    describe('after tapping ✕', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByTestId(SHEET_HEADING_TEST_IDS.close));
      });

      it('closes without changing the picture', () => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnChange).not.toHaveBeenCalled();
      });
    });

    describe('after tapping outside the sheet', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByTestId(GOAL_PICTURE_SEARCH_TEST_IDS.scrim));
      });

      it('closes', () => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    describe('after pressing Escape', () => {
      beforeEach(() => {
        fireEvent.keyDown(document.body, { key: ESCAPE_KEY });
      });

      it('closes', () => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('opened with a picture already chosen', () => {
    const mockPicture = createMockGoalPicture('🚴');

    beforeEach(async () => {
      await renderLoadedSheet(mockPicture);
    });

    it('shows that picture as chosen', () => {
      expect(screen.getByText(mockPicture.emoji)).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    });
  });
});
