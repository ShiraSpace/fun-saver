import { signIn } from 'next-auth/react';
import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { PIG_EMOJI } from '@/components/Pig';
import { SignIn } from './SignIn';
import {
  GOOGLE_PROVIDER_ID,
  SIGNED_IN_DESTINATION,
  SIGN_IN_COPY,
  SIGN_IN_TEST_IDS,
} from './constants';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

const mockedSignIn = signIn as jest.MockedFunction<typeof signIn>;

const clickContinue = (): void => {
  fireEvent.click(screen.getByTestId(SIGN_IN_TEST_IDS.continueWithGoogle));
};

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSignIn.mockResolvedValue(undefined);
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

  it('offers a single button to continue with Google', () => {
    expect(
      screen.getByTestId(SIGN_IN_TEST_IDS.continueWithGoogle)
    ).toHaveTextContent(SIGN_IN_COPY.continueWithGoogle);
  });

  it('starts the Google sign-in and lands the user on the home page', () => {
    clickContinue();

    expect(signIn).toHaveBeenCalledWith(GOOGLE_PROVIDER_ID, {
      redirectTo: SIGNED_IN_DESTINATION,
    });
  });

  it('says it is working while the round-trip is in flight', async () => {
    clickContinue();

    await waitFor(() => {
      expect(
        screen.getByTestId(SIGN_IN_TEST_IDS.continueWithGoogle)
      ).toBeDisabled();
    });
    expect(
      screen.getByTestId(SIGN_IN_TEST_IDS.continueWithGoogle)
    ).toHaveTextContent(SIGN_IN_COPY.signingIn);
  });

  it('surfaces a failed sign-in instead of dying silently', async () => {
    mockedSignIn.mockRejectedValue(new Error('offline'));

    clickContinue();

    expect(await screen.findByTestId(SIGN_IN_TEST_IDS.error)).toHaveTextContent(
      SIGN_IN_COPY.signInFailed
    );
  });

  it('lets the user try again after a failure', async () => {
    mockedSignIn.mockRejectedValue(new Error('offline'));

    clickContinue();

    await screen.findByTestId(SIGN_IN_TEST_IDS.error);
    expect(
      screen.getByTestId(SIGN_IN_TEST_IDS.continueWithGoogle)
    ).toBeEnabled();
  });
});
