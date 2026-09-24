'use client';

import { JSX, useState } from 'react';
import {
  SIGNED_IN_USER_SECTION_COPY,
  SIGNED_IN_USER_SECTION_PHOTO_SIZE,
  SIGNED_IN_USER_SECTION_TEST_IDS,
} from './constants';
import { PhotoPlaceholder, UserPhoto } from './SignedInUserSection.styles';
import { useOnMenuClose } from '../use-menu-state';

interface SignedInUserPhotoProps {
  image?: string;
}

export function SignedInUserPhoto({
  image,
}: SignedInUserPhotoProps): JSX.Element {
  const [hasPhotoFailed, setHasPhotoFailed] = useState(false);

  useOnMenuClose((): void => setHasPhotoFailed(false));

  if (!image || hasPhotoFailed) {
    return (
      <PhotoPlaceholder
        aria-hidden="true"
        data-testid={SIGNED_IN_USER_SECTION_TEST_IDS.photoPlaceholder}
      >
        {SIGNED_IN_USER_SECTION_COPY.photoPlaceholder}
      </PhotoPlaceholder>
    );
  }

  return (
    <UserPhoto
      src={image}
      alt=""
      width={SIGNED_IN_USER_SECTION_PHOTO_SIZE}
      height={SIGNED_IN_USER_SECTION_PHOTO_SIZE}
      unoptimized
      referrerPolicy="no-referrer"
      onError={(): void => setHasPhotoFailed(true)}
      data-testid={SIGNED_IN_USER_SECTION_TEST_IDS.photo}
    />
  );
}
