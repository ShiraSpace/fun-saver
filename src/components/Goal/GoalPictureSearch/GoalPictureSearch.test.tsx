import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { DEFAULT_GOAL_PICTURE, GOAL_PICTURE_KIND } from '@/lib/goal/constants';
import type { GoalPicture } from '@/lib/goal/types';
import { createMockGoalPicture } from '@/test-utils/mocks/goal.mocks';
import { ESCAPE_KEY, KEY_DOWN_EVENT } from '@/hooks/constants';
import { GoalPictureSearch } from './GoalPictureSearch';
import { GOAL_PICTURE_SEARCH_TEST_IDS } from './constants';
import { CHOOSE_BUTTON_TEST_IDS } from './ChooseButton/constants';
import {
  PICTURE_TILES_COPY,
  PICTURE_TILES_TEST_IDS,
} from './PictureTiles/constants';
import { QUERY_FIELD_TEST_IDS } from './QueryField/constants';
import {
  SHEET_HEADING_COPY,
  SHEET_HEADING_TEST_IDS,
} from './SheetHeading/constants';

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
    const mockGoalNamePicture = '🚲';

    beforeEach(async () => {
      await renderLoadedSheet(null);
    });

    it('opens searching for the goal name', () => {
      expect(tilePictures()).toContain(mockGoalNamePicture);
    });

    it('is named by its title', () => {
      expect(
        screen.getByRole('dialog', { name: SHEET_HEADING_COPY.title })
      ).toBeInTheDocument();
    });

    describe('after typing another word', () => {
      const mockTypedWord = 'כלב';
      const mockTypedWordPicture = '🐶';

      beforeEach(async () => {
        fireEvent.change(screen.getByTestId(QUERY_FIELD_TEST_IDS.input), {
          target: { value: mockTypedWord },
        });
        await screen.findByText(mockTypedWordPicture);
      });

      it('searches for what was typed', () => {
        expect(tilePictures()).toContain(mockTypedWordPicture);
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

    describe('after tapping the bicycle only', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByText(mockGoalNamePicture));
      });

      it('does not send a picture yet', () => {
        expect(mockOnChange).not.toHaveBeenCalled();
      });
    });

    describe('after tapping the bicycle and choosing', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByText(mockGoalNamePicture));
        fireEvent.click(screen.getByTestId(CHOOSE_BUTTON_TEST_IDS.button));
      });

      it('sends the bicycle as the goal picture', () => {
        expect(mockOnChange).toHaveBeenCalledWith({
          kind: GOAL_PICTURE_KIND.emoji,
          emoji: mockGoalNamePicture,
        });
      });
    });

    describe('after tapping ✕', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByTestId(SHEET_HEADING_TEST_IDS.close));
      });

      it('closes', () => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });

      it('leaves the picture unchanged', () => {
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
      const mockOnLayerBelowEscape = jest.fn();

      beforeEach(() => {
        mockOnLayerBelowEscape.mockClear();
        document.addEventListener(KEY_DOWN_EVENT, mockOnLayerBelowEscape);
        fireEvent.keyDown(document.body, { key: ESCAPE_KEY });
      });

      afterEach(() => {
        document.removeEventListener(KEY_DOWN_EVENT, mockOnLayerBelowEscape);
      });

      it('closes', () => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });

      it('leaves the layer below open', () => {
        expect(mockOnLayerBelowEscape).not.toHaveBeenCalled();
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
