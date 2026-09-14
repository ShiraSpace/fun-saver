'use client';

import { JSX } from 'react';
import { signIn } from 'next-auth/react';
import { Screen } from '@/components/Screen';
import { GoogleLogo } from './GoogleLogo';
import {
  GOOGLE_PROVIDER_ID,
  SIGN_IN_COPY,
  SIGN_IN_TEST_IDS,
  SIGNED_IN_DESTINATION,
} from './constants';
import {
  Card,
  CardBody,
  CardTitle,
  Fineprint,
  GoogleButton,
  GoogleMark,
  Pig,
  Tagline,
  Wordmark,
} from './SignIn.styles';

export function SignIn(): JSX.Element {
  const continueWithGoogle = (): void => {
    void signIn(GOOGLE_PROVIDER_ID, { redirectTo: SIGNED_IN_DESTINATION });
  };

  return (
    <Screen data-testid={SIGN_IN_TEST_IDS.container}>
      <Pig data-testid={SIGN_IN_TEST_IDS.pig}>{SIGN_IN_COPY.pig}</Pig>
      <Wordmark>{SIGN_IN_COPY.wordmark}</Wordmark>
      <Tagline>{SIGN_IN_COPY.tagline}</Tagline>
      <Card>
        <CardTitle>{SIGN_IN_COPY.cardTitle}</CardTitle>
        <CardBody>{SIGN_IN_COPY.cardBody}</CardBody>
        <GoogleButton
          type="button"
          data-testid={SIGN_IN_TEST_IDS.continueWithGoogle}
          onClick={continueWithGoogle}
        >
          <GoogleMark>
            <GoogleLogo />
          </GoogleMark>
          {SIGN_IN_COPY.continueWithGoogle}
        </GoogleButton>
      </Card>
      <Fineprint>{SIGN_IN_COPY.fineprint}</Fineprint>
    </Screen>
  );
}
