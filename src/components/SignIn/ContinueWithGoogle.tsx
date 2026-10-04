'use client';

import { JSX } from 'react';
import { REQUEST_STATE } from '@/lib/request-state';
import { GoogleLogo } from './GoogleLogo';
import { useGoogleSignIn } from './use-google-sign-in';
import { SIGN_IN_COPY, SIGN_IN_TEST_IDS } from './constants';
import { ErrorMessage, GoogleButton, GoogleLogoFrame } from './SignIn.styles';

export function ContinueWithGoogle(): JSX.Element {
  const { requestState, continueWithGoogle } = useGoogleSignIn();
  const isSigningIn = requestState === REQUEST_STATE.pending;
  const hasSignInFailed = requestState === REQUEST_STATE.failed;

  const label = isSigningIn
    ? SIGN_IN_COPY.signingIn
    : SIGN_IN_COPY.continueWithGoogle;

  const errorMessage = hasSignInFailed ? (
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
        <GoogleLogoFrame>
          <GoogleLogo />
        </GoogleLogoFrame>
        {label}
      </GoogleButton>
      {errorMessage}
    </>
  );
}
