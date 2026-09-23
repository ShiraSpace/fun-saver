import { render, screen } from '@/test-utils/render';
import { hexToRgb, opacityOf } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import { StatStrip } from './StatStrip';
import { STAT_STRIP_COPY, STAT_STRIP_TEST_IDS } from './constants';

describe('StatStrip', () => {
  describe('when the daily interest rounds up', () => {
    beforeEach(() => {
      render(
        <StatStrip principal={13700} interestGain={6743} todayInterest={102} />
      );
    });

    it('shows what was deposited', () => {
      expect(
        screen.getByTestId(STAT_STRIP_TEST_IDS.deposits)
      ).toHaveTextContent('₪137');
    });

    it('shows the interest earned so far in whole shekels', () => {
      expect(
        screen.getByTestId(STAT_STRIP_TEST_IDS.interestGain)
      ).toHaveTextContent('₪67');
    });

    it('shows the daily interest', () => {
      expect(
        screen.getByTestId(STAT_STRIP_TEST_IDS.todayInterest)
      ).toHaveTextContent('₪1');
    });

    it('labels the deposits cell', () => {
      expect(screen.getByTestId(STAT_STRIP_TEST_IDS.strip)).toHaveTextContent(
        STAT_STRIP_COPY.depositsLabel
      );
    });

    it('labels the interest cell', () => {
      expect(screen.getByTestId(STAT_STRIP_TEST_IDS.strip)).toHaveTextContent(
        STAT_STRIP_COPY.interestGainLabel
      );
    });

    it('paints the gain label with the gain token', () => {
      const label = screen.getByText(STAT_STRIP_COPY.interestGainLabel);

      expect(getComputedStyle(label).color).toBe(
        hexToRgb(getThemeTokens().colors.gainText)
      );
    });

    it('leaves the gain label unfaded, so the token keeps its measured ratio', () => {
      const label = screen.getByText(STAT_STRIP_COPY.interestGainLabel);

      expect(opacityOf(label)).toBe(1);
    });

    it('labels the daily cell', () => {
      expect(screen.getByTestId(STAT_STRIP_TEST_IDS.strip)).toHaveTextContent(
        STAT_STRIP_COPY.todayLabel
      );
    });
  });

  it('shows the daily interest in half-shekel steps', () => {
    render(
      <StatStrip principal={13700} interestGain={6743} todayInterest={140} />
    );

    expect(
      screen.getByTestId(STAT_STRIP_TEST_IDS.todayInterest)
    ).toHaveTextContent('₪1.5');
  });

  it('hides the daily interest when it rounds to zero', () => {
    render(
      <StatStrip principal={13700} interestGain={6743} todayInterest={20} />
    );

    expect(
      screen.queryByTestId(STAT_STRIP_TEST_IDS.todayInterest)
    ).not.toBeInTheDocument();
  });
});
