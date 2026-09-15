'use client';

import { JSX } from 'react';
import { GoogleLogo } from './GoogleLogo';
import { useGoogleSignIn } from './use-google-sign-in';
import { SIGN_IN_COPY, SIGN_IN_TEST_IDS } from './constants';
import { ErrorMessage, GoogleButton, GoogleMark } from './SignIn.styles';

export function ContinueWithGoogle(): JSX.Element {
  const { isSigningIn, hasFailed, continueWithGoogle } = useGoogleSignIn();

  const label = isSigningIn
    ? SIGN_IN_COPY.signingIn
    : SIGN_IN_COPY.continueWithGoogle;

  const errorMessage = hasFailed ? (
    <ErrorMessage data-testid={SIGN_IN_TEST_IDS.error}>
      {SIGN_IN_COPY.signInFailed}
    </ErrorMessage>
  ) : null;

  return (
    <>
      <GoogleButton
        type="button"
        data-testid={SIGN_IN_TEST_IDS.continueWithGoogle}
        disabled={isSigningIn}
        onClick={continueWithGoogle}
      >
        <GoogleMark>
          <GoogleLogo />
        </GoogleMark>
        {label}
      </GoogleButton>
      {errorMessage}
    </>
  );
}
