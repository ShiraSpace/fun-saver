import { signIn } from 'next-auth/react';
import { fireEvent, render, screen } from '@/test-utils/render';
import { hexToRgb } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import { ContinueWithGoogle } from './ContinueWithGoogle';
import { HOME_ROUTE } from '@/components/Home/constants';
import {
  GOOGLE_PROVIDER_ID,
  SIGN_IN_COPY,
  SIGN_IN_TEST_IDS,
} from './constants';

const mockedSignIn = signIn as unknown as jest.Mock<Promise<void>>;

const continueWithGoogleButton = (): HTMLElement =>
  screen.getByTestId(SIGN_IN_TEST_IDS.continueWithGoogle);

const clickContinue = (): void => {
  fireEvent.click(continueWithGoogleButton());
};

describe('ContinueWithGoogle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSignIn.mockResolvedValue(undefined);
    render(<ContinueWithGoogle />);
  });

  it('invites the user to continue with Google', () => {
    expect(continueWithGoogleButton()).toHaveTextContent(
      SIGN_IN_COPY.continueWithGoogle
    );
  });

  it('starts the Google sign-in and lands the user on the home page', () => {
    clickContinue();

    expect(signIn).toHaveBeenCalledWith(GOOGLE_PROVIDER_ID, {
      redirectTo: HOME_ROUTE,
    });
  });

  it('says it is working while the round-trip is in flight', () => {
    clickContinue();

    expect(continueWithGoogleButton()).toBeDisabled();
    expect(continueWithGoogleButton()).toHaveTextContent(
      SIGN_IN_COPY.signingIn
    );
  });

  describe('when the sign-in never reaches Google', () => {
    let error: HTMLElement;

    beforeEach(async () => {
      mockedSignIn.mockRejectedValue(new Error('offline'));

      clickContinue();

      error = await screen.findByTestId(SIGN_IN_TEST_IDS.error);
    });

    it('surfaces the failure', () => {
      expect(error).toHaveTextContent(SIGN_IN_COPY.signInFailed);
    });

    it('speaks it in the alert red', () => {
      expect(getComputedStyle(error).color).toBe(
        hexToRgb(getThemeTokens().colors.alertText)
      );
    });

    it('lets the user try again', () => {
      expect(continueWithGoogleButton()).toBeEnabled();
    });
  });
});
