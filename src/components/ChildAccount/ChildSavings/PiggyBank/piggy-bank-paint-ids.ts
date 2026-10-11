export interface PaintReference {
  id: string;
  url: string;
}

export interface ShapeReference {
  id: string;
  href: string;
}

export interface PiggyBankPaintIds {
  coinFace: PaintReference;
  body: PaintReference;
  ear: PaintReference;
  leftEar: ShapeReference;
  snout: PaintReference;
  glass: PaintReference;
  belly: PaintReference;
  shadowBlur: PaintReference;
  shineBlur: PaintReference;
}

function paintReference(id: string): PaintReference {
  return { id, url: `url(#${id})` };
}

function shapeReference(id: string): ShapeReference {
  return { id, href: `#${id}` };
}

export function piggyBankPaintIds(piggyBankId: string): PiggyBankPaintIds {
  return {
    coinFace: paintReference(`${piggyBankId}-coin-face`),
    body: paintReference(`${piggyBankId}-body`),
    ear: paintReference(`${piggyBankId}-ear`),
    leftEar: shapeReference(`${piggyBankId}-left-ear`),
    snout: paintReference(`${piggyBankId}-snout`),
    glass: paintReference(`${piggyBankId}-glass`),
    belly: paintReference(`${piggyBankId}-belly`),
    shadowBlur: paintReference(`${piggyBankId}-shadow-blur`),
    shineBlur: paintReference(`${piggyBankId}-shine-blur`),
  };
}
