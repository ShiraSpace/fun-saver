import { render, screen } from '@/test-utils/render';
import { hexToRgb } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import type { TalkLine } from '../copy';
import { TalkBubble } from './TalkBubble';
import { TALK_BUBBLE_TEST_IDS } from './constants';

describe('a talk bubble', () => {
  const LABEL = '🗣️ **מה אומרים לילד**';
  const LINES: readonly TalkLine[] = [
    { tone: 'struck', text: '"אמרתי לך לא לבזבז את הכל."' },
    { tone: 'spoken', text: '"נגמר. זה מרגיש רע, ואני מבין."' },
    { tone: 'muted', text: 'בלי הרצאה.' },
  ];

  describe('given a label', () => {
    beforeEach(() => {
      render(<TalkBubble label={LABEL} lines={LINES} />);
    });

    it('keeps the line the parent should not say, marked rather than deleted', () => {
      const tones = screen
        .getAllByTestId(TALK_BUBBLE_TEST_IDS.line)
        .map((line) => line.dataset.tone);

      expect(tones).toEqual(LINES.map((line) => line.tone));
    });

    it('runs the label through the same emphasis as everything else on the page', () => {
      expect(screen.getByTestId(TALK_BUBBLE_TEST_IDS.label)).toHaveTextContent(
        '🗣️ מה אומרים לילד'
      );
    });
  });

  describe('on a theme whose text colour left its outline behind', () => {
    const jungle = getThemeTokens('jungle-quest').colors;

    beforeEach(() => {
      render(<TalkBubble label={LABEL} lines={LINES} />, 'jungle-quest');
    });

    it('darkens the label to read on the surface and leaves the outline bright', () => {
      const label = screen.getByTestId(TALK_BUBBLE_TEST_IDS.label);

      expect(getComputedStyle(label).color).toBe(hexToRgb(jungle.primaryText));
      expect(getComputedStyle(label.parentElement!).borderColor).toBe(
        hexToRgb(jungle.primary)
      );
    });
  });

  describe('given none', () => {
    beforeEach(() => {
      render(<TalkBubble lines={LINES} />);
    });

    it('opens on the words themselves, for a section whose title already said them', () => {
      expect(
        screen.queryByTestId(TALK_BUBBLE_TEST_IDS.label)
      ).not.toBeInTheDocument();
    });
  });
});
