'use client';

import { JSX } from 'react';
import { ALL_WALLETS_CHIP_COPY, ALL_WALLETS_CHIP_TEST_IDS } from './constants';
import { Chip } from './AllWalletsChip.styles';

interface AllWalletsChipProps {
  allWalletsShown: boolean;
  onToggle: () => void;
}

export function AllWalletsChip({
  allWalletsShown,
  onToggle,
}: AllWalletsChipProps): JSX.Element {
  return (
    <Chip
      type="button"
      aria-pressed={allWalletsShown}
      onClick={onToggle}
      data-testid={ALL_WALLETS_CHIP_TEST_IDS.chip}
    >
      {ALL_WALLETS_CHIP_COPY.label}
    </Chip>
  );
}
