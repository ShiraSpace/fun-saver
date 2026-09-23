'use client';

import { JSX, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useSignedInUser } from '@/components/Home/signed-in-user-context';
import { LOGIN_PATH } from '@/lib/constants';
import {
  PROFILE_SECTION_CONTENT,
  PROFILE_SECTION_PHOTO_SIZE,
  PROFILE_SECTION_TEST_IDS,
} from './constants';
import {
  Email,
  Name,
  Naming,
  SignOut,
  Strip,
  UserMark,
  UserPhoto,
} from './ProfileSection.styles';

export function ProfileSection(): JSX.Element {
  const user = useSignedInUser();
  const [photoFailed, setPhotoFailed] = useState(false);

  const leave = (): void => {
    void signOut({ redirectTo: LOGIN_PATH });
  };

  const mark =
    user.image && !photoFailed ? (
      <UserPhoto
        src={user.image}
        alt=""
        width={PROFILE_SECTION_PHOTO_SIZE}
        height={PROFILE_SECTION_PHOTO_SIZE}
        unoptimized
        referrerPolicy="no-referrer"
        onError={(): void => setPhotoFailed(true)}
        data-testid={PROFILE_SECTION_TEST_IDS.photo}
      />
    ) : (
      <UserMark aria-hidden="true">{PROFILE_SECTION_CONTENT.avatar}</UserMark>
    );

  return (
    <Strip data-testid={PROFILE_SECTION_TEST_IDS.strip}>
      {mark}
      <Naming>
        <Name data-testid={PROFILE_SECTION_TEST_IDS.name}>{user.name}</Name>
        <Email data-testid={PROFILE_SECTION_TEST_IDS.email}>{user.email}</Email>
      </Naming>
      <SignOut
        type="button"
        aria-label={PROFILE_SECTION_CONTENT.signOutLabel}
        data-testid={PROFILE_SECTION_TEST_IDS.signOut}
        onClick={leave}
      >
        {PROFILE_SECTION_CONTENT.signOut}
      </SignOut>
    </Strip>
  );
}
