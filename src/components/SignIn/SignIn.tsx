'use client';

import { JSX } from 'react';
import { Pig, PIG_EMOJI } from '@/components/Pig';
import { Screen } from '@/components/Screen';
import { GoogleLogo } from './GoogleLogo';
import { useGoogleSignIn } from './use-google-sign-in';
import { SIGN_IN_COPY, SIGN_IN_LAYOUT, SIGN_IN_TEST_IDS } from './constants';
import {
  Card,
  CardBody,
  CardTitle,
  ErrorMessage,
  Fineprint,
  GoogleButton,
  GoogleMark,
  Tagline,
  Wordmark,
} from './SignIn.styles';

export function SignIn(): JSX.Element {
  const { isSigningIn, hasFailed, continueWithGoogle } = useGoogleSignIn();

  return (
    <Screen data-testid={SIGN_IN_TEST_IDS.container}>
      <Pig pigSize={SIGN_IN_LAYOUT.pigSize} data-testid={SIGN_IN_TEST_IDS.pig}>
        {PIG_EMOJI}
      </Pig>
      <Wordmark>{SIGN_IN_COPY.wordmark}</Wordmark>
      <Tagline>{SIGN_IN_COPY.tagline}</Tagline>
      <Card>
        <CardTitle data-testid={SIGN_IN_TEST_IDS.cardTitle}>
          {SIGN_IN_COPY.cardTitle}
        </CardTitle>
        <CardBody data-testid={SIGN_IN_TEST_IDS.cardBody}>
          {SIGN_IN_COPY.cardBody}
        </CardBody>
        <GoogleButton
          type="button"
          data-testid={SIGN_IN_TEST_IDS.continueWithGoogle}
          disabled={isSigningIn}
          onClick={continueWithGoogle}
        >
          <GoogleMark>
            <GoogleLogo />
          </GoogleMark>
          {isSigningIn
            ? SIGN_IN_COPY.signingIn
            : SIGN_IN_COPY.continueWithGoogle}
        </GoogleButton>
        {hasFailed && (
          <ErrorMessage data-testid={SIGN_IN_TEST_IDS.error}>
            {SIGN_IN_COPY.signInFailed}
          </ErrorMessage>
        )}
      </Card>
      <Fineprint>{SIGN_IN_COPY.fineprint}</Fineprint>
    </Screen>
  );
}
