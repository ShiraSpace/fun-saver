import { render, screen } from '@testing-library/react';
import { Account } from './Account';
import { HEADER_TEST_IDS } from '@/components/Header/constants';

describe('Account', () => {
  const ACCOUNT_NAME = 'יעל';
  const AVATAR_ID = 'kid-01';

  beforeEach(() => {
    render(<Account name={ACCOUNT_NAME} avatarId={AVATAR_ID} />);
  });

  it('shows the account header with the account name', () => {
    expect(screen.getByTestId(HEADER_TEST_IDS.name)).toHaveTextContent(
      ACCOUNT_NAME
    );
  });
});
