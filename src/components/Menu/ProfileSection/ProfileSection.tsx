'use client';

import { JSX } from 'react';
import { useSignedInUser } from '@/components/Home/signed-in-user-context';
import { ProfilePhoto } from './ProfilePhoto';
import { useSignOut } from './use-sign-out';
import { PROFILE_SECTION_CONTENT, PROFILE_SECTION_TEST_IDS } from './constants';
import {
  Email,
  Name,
  Naming,
  SignOut,
  SignOutError,
  Strip,
} from './ProfileSection.styles';

export function ProfileSection(): JSX.Element {
  const user = useSignedInUser();
  const { hasSignOutFailed, signOutOfAccount } = useSignOut();

  return (
    <Strip data-testid={PROFILE_SECTION_TEST_IDS.strip}>
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
        data-testid={PROFILE_SECTION_TEST_IDS.signOut}
        onClick={(): void => void signOutOfAccount()}
      >
        {PROFILE_SECTION_CONTENT.signOut}
      </SignOut>
      {hasSignOutFailed && (
        <SignOutError data-testid={PROFILE_SECTION_TEST_IDS.signOutError}>
          {PROFILE_SECTION_CONTENT.signOutFailed}
        </SignOutError>
      )}
    </Strip>
  );
}
