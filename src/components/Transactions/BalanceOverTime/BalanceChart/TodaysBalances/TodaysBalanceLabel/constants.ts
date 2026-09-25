import { TODAY_X } from '../../constants';

export const SWATCH = { x: 5, size: 9, cornerRadius: 3 } as const;
export const LABEL_OFFSET = { x: 17, y: 4 } as const;
export const SWATCH_X = TODAY_X + SWATCH.x;
export const LABEL_X = TODAY_X + LABEL_OFFSET.x;

export const TODAYS_BALANCE_LABEL_TEST_IDS = {
  label: 'todays-balance',
} as const;
