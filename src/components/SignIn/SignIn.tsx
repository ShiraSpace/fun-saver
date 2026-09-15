'use client';

import { JSX } from 'react';
import { Pig } from '@/components/Pig';
import { PIG_EMOJI } from '@/components/Pig/constants';
import { Screen } from '@/components/Screen';
import { ContinueWithGoogle } from './ContinueWithGoogle';
import { SIGN_IN_COPY, SIGN_IN_LAYOUT, SIGN_IN_TEST_IDS } from './constants';
import {
  Card,
  CardBody,
  CardTitle,
  Fineprint,
  Tagline,
  Wordmark,
} from './SignIn.styles';

export function SignIn(): JSX.Element {
  return (
    <Screen data-testid={SIGN_IN_TEST_IDS.container}>
      <Pig size={SIGN_IN_LAYOUT.pigSize} data-testid={SIGN_IN_TEST_IDS.pig}>
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
        <ContinueWithGoogle />
      </Card>
      <Fineprint data-testid={SIGN_IN_TEST_IDS.fineprint}>
        {SIGN_IN_COPY.fineprint}
      </Fineprint>
    </Screen>
  );
}
