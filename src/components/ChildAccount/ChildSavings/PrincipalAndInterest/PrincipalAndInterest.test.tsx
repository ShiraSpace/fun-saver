import { render, screen } from '@/test-utils/render';
import { PrincipalAndInterest } from './PrincipalAndInterest';
import { PRINCIPAL_AND_INTEREST_COPY, PRINCIPAL_AND_INTEREST_TEST_IDS } from './constants';

describe('PrincipalAndInterest', () => {
  beforeEach(() => {
    render(<PrincipalAndInterest principal={14200} interestEarned={600} />);
  });

  it('shows what the child put in', () => {
    expect(screen.getByTestId(PRINCIPAL_AND_INTEREST_TEST_IDS.principal)).toHaveTextContent('₪142');
  });

  it('shows what the money earned by itself', () => {
    expect(screen.getByTestId(PRINCIPAL_AND_INTEREST_TEST_IDS.interestEarned)).toHaveTextContent(
      '₪6'
    );
  });

  it('marks what the money earned by itself as a gain', () => {
    expect(screen.getByTestId(PRINCIPAL_AND_INTEREST_TEST_IDS.gain)).toHaveTextContent(
      `${PRINCIPAL_AND_INTEREST_COPY.earnedSign}₪6`
    );
  });
});
