import { render, screen } from '@testing-library/react';
import { CreateAccount } from './CreateAccount';
import { CREATE_ACCOUNT_TEST_IDS } from './constants';

describe('CreateAccount', () => {
  beforeEach(() => {
    render(<CreateAccount />);
  });

  it('renders the account name input', () => {
    expect(
      screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.nameInput)
    ).toBeInTheDocument();
  });
});
