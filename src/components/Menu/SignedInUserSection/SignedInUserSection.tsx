'use client';

import { JSX } from 'react';
import { useSignedInUser } from '@/components/Home/signed-in-user-context';
import { SignedInUserPhoto } from './SignedInUserPhoto';
import { SIGN_OUT_STATUS, useSignOut } from './use-sign-out';
import {
  SIGNED_IN_USER_SECTION_COPY,
  SIGNED_IN_USER_SECTION_TEST_IDS,
} from './constants';
import {
  Block,
  Email,
  Name,
  Naming,
  SignOut,
  SignOutError,
  Strip,
} from './SignedInUserSection.styles';

export function SignedInUserSection(): JSX.Element {
  const user = useSignedInUser();
  const { signOutStatus, signOutUser } = useSignOut();
  const isSigningOut = signOutStatus === SIGN_OUT_STATUS.signingOut;
  const hasSignOutFailed = signOutStatus === SIGN_OUT_STATUS.failed;

  return (
    <Block data-testid={SIGNED_IN_USER_SECTION_TEST_IDS.section}>
      <Strip>
        <SignedInUserPhoto image={user.image} />
        <Naming>
          <Name data-testid={SIGNED_IN_USER_SECTION_TEST_IDS.name}>
            {user.name}
          </Name>
          <Email dir="ltr" data-testid={SIGNED_IN_USER_SECTION_TEST_IDS.email}>
            {user.email}
          </Email>
        </Naming>
        <SignOut
          type="button"
          aria-label={SIGNED_IN_USER_SECTION_COPY.signOutLabel}
          disabled={isSigningOut}
          data-testid={SIGNED_IN_USER_SECTION_TEST_IDS.signOut}
          onClick={(): void => void signOutUser()}
        >
          {SIGNED_IN_USER_SECTION_COPY.signOut}
        </SignOut>
      </Strip>
      {hasSignOutFailed && (
        <SignOutError
          role="alert"
          data-testid={SIGNED_IN_USER_SECTION_TEST_IDS.signOutError}
        >
          {SIGNED_IN_USER_SECTION_COPY.signOutFailed}
        </SignOutError>
      )}
    </Block>
  );
}
