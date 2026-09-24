'use client';

import { JSX } from 'react';
import { useSignedInUser } from '@/components/Home/signed-in-user-context';
import { ProfilePhoto } from './ProfilePhoto';
import { SIGN_OUT_STATUS, useSignOut } from './use-sign-out';
import { PROFILE_SECTION_CONTENT, PROFILE_SECTION_TEST_IDS } from './constants';
import {
  Block,
  Email,
  Name,
  Naming,
  SignOut,
  SignOutError,
  Strip,
} from './ProfileSection.styles';

export function ProfileSection(): JSX.Element {
  const user = useSignedInUser();
  const { signOutStatus, signOutOfAccount } = useSignOut();
  const isSigningOut = signOutStatus === SIGN_OUT_STATUS.signingOut;
  const hasSignOutFailed = signOutStatus === SIGN_OUT_STATUS.failed;

  return (
    <Block data-testid={PROFILE_SECTION_TEST_IDS.strip}>
      <Strip>
        <ProfilePhoto image={user.image} />
        <Naming>
          <Name data-testid={PROFILE_SECTION_TEST_IDS.name}>{user.name}</Name>
          <Email dir="ltr" data-testid={PROFILE_SECTION_TEST_IDS.email}>
            {user.email}
          </Email>
        </Naming>
        <SignOut
          type="button"
          aria-label={PROFILE_SECTION_CONTENT.signOutLabel}
          disabled={isSigningOut}
          data-testid={PROFILE_SECTION_TEST_IDS.signOut}
          onClick={(): void => void signOutOfAccount()}
        >
          {PROFILE_SECTION_CONTENT.signOut}
        </SignOut>
      </Strip>
      {hasSignOutFailed && (
        <SignOutError
          role="alert"
          data-testid={PROFILE_SECTION_TEST_IDS.signOutError}
        >
          {PROFILE_SECTION_CONTENT.signOutFailed}
        </SignOutError>
      )}
    </Block>
  );
}
