'use client';

import { JSX, useState } from 'react';
import {
  PROFILE_SECTION_CONTENT,
  PROFILE_SECTION_PHOTO_SIZE,
  PROFILE_SECTION_TEST_IDS,
} from './constants';
import { UserMark, UserPhoto } from './ProfileSection.styles';

interface ProfilePhotoProps {
  image?: string;
}

export function ProfilePhoto({ image }: ProfilePhotoProps): JSX.Element {
  const [hasPhotoFailed, setHasPhotoFailed] = useState(false);

  if (!image || hasPhotoFailed) {
    return (
      <UserMark aria-hidden="true" data-testid={PROFILE_SECTION_TEST_IDS.mark}>
        {PROFILE_SECTION_CONTENT.avatar}
      </UserMark>
    );
  }

  return (
    <UserPhoto
      src={image}
      alt=""
      width={PROFILE_SECTION_PHOTO_SIZE}
      height={PROFILE_SECTION_PHOTO_SIZE}
      unoptimized
      referrerPolicy="no-referrer"
      onError={(): void => setHasPhotoFailed(true)}
      data-testid={PROFILE_SECTION_TEST_IDS.photo}
    />
  );
}
