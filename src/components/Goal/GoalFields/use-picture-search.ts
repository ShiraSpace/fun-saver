import { useState } from 'react';
import type { GoalPicture } from '@/lib/goal/types';

interface PictureSearch {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  choosePicture: (picture: GoalPicture) => void;
}

export function usePictureSearch(onChoose: (picture: GoalPicture) => void): PictureSearch {
  const [isOpen, setIsOpen] = useState(false);
  const closeSearch = (): void => setIsOpen(false);

  return {
    isOpen,
    openSearch: (): void => setIsOpen(true),
    closeSearch,
    choosePicture: (picture): void => {
      onChoose(picture);
      closeSearch();
    },
  };
}
