import { render, screen } from '@/test-utils/render';
import { agorotToWholeShekels } from '@/lib/money';
import { MONEY_COPY } from '@/components/Money/constants';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { SHOWN_BALANCE } from '../../../../constants';
import { shownBalanceLabel, WALLET_CHART_COLOR } from '../../../constants';
import { TODAYS_BALANCE_LABEL_TEST_IDS } from './constants';
import { TodaysBalanceLabel } from './TodaysBalanceLabel';

const mockTodaysBalance = 1827;

describe('today’s balance at the end of a line', () => {
  beforeEach(() => {
    render(
      <svg>
        <TodaysBalanceLabel
          shownBalance="spending"
          todaysBalance={mockTodaysBalance}
          y={40}
        />
      </svg>,
      { themeId: THEME_ID.jungleQuest }
    );
  });

  it('names the wallet', () => {
    expect(
      screen.getByTestId(TODAYS_BALANCE_LABEL_TEST_IDS.label)
    ).toHaveTextContent(shownBalanceLabel(SHOWN_BALANCE.spending));
  });

  it('shows today’s balance in whole shekels', () => {
    expect(
      screen.getByTestId(TODAYS_BALANCE_LABEL_TEST_IDS.label)
    ).toHaveTextContent(
      new RegExp(
        `${MONEY_COPY.currencySign}${agorotToWholeShekels(mockTodaysBalance)}$`
      )
    );
  });

  it('carries the line’s colour in its swatch, so the text keeps a readable colour', () => {
    expect(
      screen
        .getByTestId(TODAYS_BALANCE_LABEL_TEST_IDS.label)
        .querySelector('rect')
    ).toHaveAttribute(
      'fill',
      getThemeTokens(THEME_ID.jungleQuest).colors[WALLET_CHART_COLOR.spending]
    );
  });
});
