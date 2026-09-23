import { THEMES } from '../registry';
import { contrastRatio } from '@/test-utils/css-color';

const GRAPHIC_CONTRAST = 3;

describe.each(Object.entries(THEMES))(
  'the chart lines in %s',
  (_, { colors }) => {
    const lines = [colors.chartSavings, colors.chartSpending, colors.chartGood];

    it('stand out from the card they are drawn on', () => {
      const ratios = lines.map((line) => contrastRatio(line, colors.surface));
      expect(Math.min(...ratios)).toBeGreaterThanOrEqual(GRAPHIC_CONTRAST);
    });

    it('never draw two lines in one colour', () => {
      const drawn = [...lines, colors.textStrong];
      expect(new Set(drawn).size).toBe(drawn.length);
    });
  }
);

it('measures a contrast ratio the way the contrast passes did', () => {
  expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21);
});
