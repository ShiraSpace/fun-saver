import { render, screen } from '@/test-utils/render';
import { hexToRgb, opacityOf } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import { InterestStats } from './InterestStats';
import { INTEREST_STATS_COPY, INTEREST_STATS_TEST_IDS } from './constants';

describe('InterestStats', () => {
  describe('when the daily interest rounds up', () => {
    beforeEach(() => {
      render(
        <InterestStats
          principal={13700}
          interestEarned={6743}
          interestEarnedToday={102}
        />
      );
    });

    it('shows what was deposited', () => {
      expect(
        screen.getByTestId(INTEREST_STATS_TEST_IDS.principal)
      ).toHaveTextContent('₪137');
    });

    it('shows the interest earned so far in whole shekels', () => {
      expect(
        screen.getByTestId(INTEREST_STATS_TEST_IDS.interestEarned)
      ).toHaveTextContent('₪67');
    });

    it('shows the daily interest', () => {
      expect(
        screen.getByTestId(INTEREST_STATS_TEST_IDS.interestEarnedToday)
      ).toHaveTextContent('₪1');
    });

    it('labels the principal cell', () => {
      expect(
        screen.getByTestId(INTEREST_STATS_TEST_IDS.stats)
      ).toHaveTextContent(INTEREST_STATS_COPY.principalLabel);
    });

    it('labels the interest cell', () => {
      expect(
        screen.getByTestId(INTEREST_STATS_TEST_IDS.stats)
      ).toHaveTextContent(INTEREST_STATS_COPY.interestEarnedLabel);
    });

    it('paints the interest label with the gain token', () => {
      const label = screen.getByText(INTEREST_STATS_COPY.interestEarnedLabel);

      expect(getComputedStyle(label).color).toBe(
        hexToRgb(getThemeTokens().colors.gainText)
      );
    });

    it('leaves the interest label unfaded, so the token keeps its measured ratio', () => {
      const label = screen.getByText(INTEREST_STATS_COPY.interestEarnedLabel);

      expect(opacityOf(label)).toBe(1);
    });

    it('labels the daily cell', () => {
      expect(
        screen.getByTestId(INTEREST_STATS_TEST_IDS.stats)
      ).toHaveTextContent(INTEREST_STATS_COPY.interestEarnedTodayLabel);
    });
  });

  it('shows the daily interest in half-shekel steps', () => {
    render(
      <InterestStats
        principal={13700}
        interestEarned={6743}
        interestEarnedToday={140}
      />
    );

    expect(
      screen.getByTestId(INTEREST_STATS_TEST_IDS.interestEarnedToday)
    ).toHaveTextContent('₪1.5');
  });

  it('hides the daily interest when it rounds to zero', () => {
    render(
      <InterestStats
        principal={13700}
        interestEarned={6743}
        interestEarnedToday={20}
      />
    );

    expect(
      screen.queryByTestId(INTEREST_STATS_TEST_IDS.interestEarnedToday)
    ).not.toBeInTheDocument();
  });
});
