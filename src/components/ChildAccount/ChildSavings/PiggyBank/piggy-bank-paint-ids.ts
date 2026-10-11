export interface PiggyBankPaintIds {
  coinFace: string;
  body: string;
  ear: string;
  leftEar: string;
  snout: string;
  glass: string;
  belly: string;
  shadowBlur: string;
  shineBlur: string;
}

export function piggyBankPaintIds(piggyBankId: string): PiggyBankPaintIds {
  return {
    coinFace: `${piggyBankId}-coin-face`,
    body: `${piggyBankId}-body`,
    ear: `${piggyBankId}-ear`,
    leftEar: `${piggyBankId}-left-ear`,
    snout: `${piggyBankId}-snout`,
    glass: `${piggyBankId}-glass`,
    belly: `${piggyBankId}-belly`,
    shadowBlur: `${piggyBankId}-shadow-blur`,
    shineBlur: `${piggyBankId}-shine-blur`,
  };
}

export function paintOf(paintId: string): string {
  return `url(#${paintId})`;
}
