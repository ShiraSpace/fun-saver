import { render, screen } from '@/test-utils/render';
import { MONEY_COPY } from '@/components/Money/constants';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { SHOWN_BALANCE } from '../../../../constants';
import { shownBalanceLabel } from '../../../constants';
import { shownBalanceColor } from '../../chart-parts';
import { TODAYS_BALANCE_LABEL_TEST_IDS } from './constants';
import { TodaysBalanceLabel } from './TodaysBalanceLabel';

const mockTodaysBalance = 1867;

describe('today’s balance at the end of a line', () => {
  beforeEach(() => {
    render(
      <svg>
        <TodaysBalanceLabel shownBalance="spending" todaysBalance={mockTodaysBalance} y={40} />
      </svg>,
      { themeId: THEME_ID.jungleQuest }
    );
  });

  it('names the wallet', () => {
    expect(screen.getByTestId(TODAYS_BALANCE_LABEL_TEST_IDS.label)).toHaveTextContent(
      shownBalanceLabel(SHOWN_BALANCE.spending)
    );
  });

  it('shows today’s balance to the tenth of a shekel', () => {
    expect(screen.getByTestId(TODAYS_BALANCE_LABEL_TEST_IDS.label)).toHaveTextContent(
      new RegExp(`${MONEY_COPY.currencySign}18\\.6$`)
    );
  });

  it('carries the line’s colour in its swatch, so the text keeps a readable colour', () => {
    expect(
      screen.getByTestId(TODAYS_BALANCE_LABEL_TEST_IDS.label).querySelector('rect')
    ).toHaveAttribute(
      'fill',
      shownBalanceColor(getThemeTokens(THEME_ID.jungleQuest).colors, SHOWN_BALANCE.spending)
    );
  });
});
