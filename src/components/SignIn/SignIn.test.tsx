import { render, screen } from '@/test-utils/render';
import { PIG_EMOJI } from '@/components/Pig/constants';
import { SignIn } from './SignIn';
import { SIGN_IN_COPY, SIGN_IN_TEST_IDS } from './constants';

describe('SignIn', () => {
  beforeEach(() => {
    render(<SignIn />);
  });

  it('renders the sign-in screen', () => {
    expect(screen.getByTestId(SIGN_IN_TEST_IDS.container)).toBeInTheDocument();
  });

  it('shows the pig', () => {
    expect(screen.getByTestId(SIGN_IN_TEST_IDS.pig)).toHaveTextContent(
      PIG_EMOJI
    );
  });

  it('explains what signing in gets you', () => {
    expect(screen.getByTestId(SIGN_IN_TEST_IDS.cardTitle)).toHaveTextContent(
      SIGN_IN_COPY.cardTitle
    );
    expect(screen.getByTestId(SIGN_IN_TEST_IDS.cardBody)).toHaveTextContent(
      SIGN_IN_COPY.cardBody
    );
  });

  it('promises what we store before the user signs in', () => {
    expect(screen.getByTestId(SIGN_IN_TEST_IDS.fineprint)).toHaveTextContent(
      SIGN_IN_COPY.fineprint
    );
  });

  it('leaves the fineprint unfaded, the way the wallet label was', () => {
    const fineprint = screen.getByTestId(SIGN_IN_TEST_IDS.fineprint);

    expect(getComputedStyle(fineprint).opacity).toBe('');
  });

  it('puts the Google button in the card', () => {
    expect(
      screen.getByTestId(SIGN_IN_TEST_IDS.continueWithGoogle)
    ).toBeInTheDocument();
  });
});
