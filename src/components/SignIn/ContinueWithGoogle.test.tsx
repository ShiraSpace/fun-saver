import { signIn } from 'next-auth/react';
import { fireEvent, render, screen } from '@/test-utils/render';
import { hexToRgb } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import { ContinueWithGoogle } from './ContinueWithGoogle';
import {
  GOOGLE_PROVIDER_ID,
  SIGNED_IN_DESTINATION,
  SIGN_IN_COPY,
  SIGN_IN_TEST_IDS,
} from './constants';

const mockedSignIn = signIn as unknown as jest.Mock<Promise<void>>;

const loginButton = (): HTMLElement =>
  screen.getByTestId(SIGN_IN_TEST_IDS.continueWithGoogle);

const clickContinue = (): void => {
  fireEvent.click(loginButton());
};

describe('ContinueWithGoogle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSignIn.mockResolvedValue(undefined);
    render(<ContinueWithGoogle />);
  });

  it('invites the user to continue with Google', () => {
    expect(loginButton()).toHaveTextContent(SIGN_IN_COPY.continueWithGoogle);
  });

  it('starts the Google sign-in and lands the user on the home page', () => {
    clickContinue();

    expect(signIn).toHaveBeenCalledWith(GOOGLE_PROVIDER_ID, {
      redirectTo: SIGNED_IN_DESTINATION,
    });
  });

  it('says it is working while the round-trip is in flight', () => {
    clickContinue();

    expect(loginButton()).toBeDisabled();
    expect(loginButton()).toHaveTextContent(SIGN_IN_COPY.signingIn);
  });

  it('surfaces a sign-in that fails before we reach Google', async () => {
    mockedSignIn.mockRejectedValue(new Error('offline'));

    clickContinue();

    expect(await screen.findByTestId(SIGN_IN_TEST_IDS.error)).toHaveTextContent(
      SIGN_IN_COPY.signInFailed
    );
  });

  it('speaks the failure in the alert red', async () => {
    mockedSignIn.mockRejectedValue(new Error('offline'));

    clickContinue();
    const error = await screen.findByTestId(SIGN_IN_TEST_IDS.error);

    expect(getComputedStyle(error).color).toBe(
      hexToRgb(getThemeTokens().colors.alertText)
    );
  });

  it('lets the user try again after a failure to reach Google', async () => {
    mockedSignIn.mockRejectedValue(new Error('offline'));

    clickContinue();

    await screen.findByTestId(SIGN_IN_TEST_IDS.error);
    expect(loginButton()).toBeEnabled();
  });
});
