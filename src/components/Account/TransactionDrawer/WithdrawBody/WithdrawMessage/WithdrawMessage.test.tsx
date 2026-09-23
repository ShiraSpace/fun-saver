import { type ComponentProps } from 'react';
import { render, screen } from '@/test-utils/render';
import { hexToRgb } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import type { ThemeId } from '@/theme/registry';
import { WithdrawMessage } from './WithdrawMessage';
import { WITHDRAW_BODY_TEST_IDS } from '../constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '../../constants';

function renderMessage(
  props: Partial<ComponentProps<typeof WithdrawMessage>> = {},
  themeId?: ThemeId
): void {
  render(
    <WithdrawMessage
      isOverdraft={false}
      hasError={false}
      balanceShekels={40}
      {...props}
    />,
    themeId
  );
}

describe('WithdrawMessage', () => {
  it('shows the overdraft hint with the wallet balance', () => {
    renderMessage({ isOverdraft: true });

    expect(
      screen.getByTestId(WITHDRAW_BODY_TEST_IDS.overdraft)
    ).toHaveTextContent('40');
    expect(
      screen.queryByTestId(TRANSACTION_DRAWER_TEST_IDS.error)
    ).not.toBeInTheDocument();
  });

  it('shows the server error when there is no overdraft', () => {
    renderMessage({ hasError: true });

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.error)
    ).toBeInTheDocument();
  });

  describe('on the theme where the old error pink fell furthest short', () => {
    const { alertText } = getThemeTokens('jungle-quest').colors;

    it('paints the overdraft hint in the alert red', () => {
      renderMessage({ isOverdraft: true }, 'jungle-quest');
      const overdraft = screen.getByTestId(WITHDRAW_BODY_TEST_IDS.overdraft);

      expect(getComputedStyle(overdraft).color).toBe(hexToRgb(alertText));
    });

    it('paints the submit failure sharing its slot in the same red', () => {
      renderMessage({ hasError: true }, 'jungle-quest');
      const error = screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.error);

      expect(getComputedStyle(error).color).toBe(hexToRgb(alertText));
    });
  });

  it('renders nothing when calm', () => {
    renderMessage();

    expect(
      screen.queryByTestId(WITHDRAW_BODY_TEST_IDS.overdraft)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(TRANSACTION_DRAWER_TEST_IDS.error)
    ).not.toBeInTheDocument();
  });
});
