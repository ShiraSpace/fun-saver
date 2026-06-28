import { type ComponentProps } from 'react';
import { render, screen } from '@/test-support/render';
import { WithdrawMessage } from './WithdrawMessage';
import { WITHDRAW_BODY_TEST_IDS } from '../constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '../../constants';

function renderMessage(
  props: Partial<ComponentProps<typeof WithdrawMessage>> = {}
): void {
  render(
    <WithdrawMessage
      isOverdraft={false}
      hasError={false}
      balanceShekels={40}
      {...props}
    />
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
