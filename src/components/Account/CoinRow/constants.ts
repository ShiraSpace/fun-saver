export const COIN_ROW_TEST_IDS = {
  row: 'daily-row',
  label: 'daily-label',
  fullCoin: 'coin-full',
  halfCoin: 'coin-half',
} as const;

export const COIN_ROW_COPY = {
  label: 'היום קיבלת מהריבית:',
  currency: '₪',
} as const;

export const COIN_ROW_STYLE = {
  marginTop: 8,
  paddingY: 10,
  paddingX: 12,
  radius: 14,
  gap: 10,
  background: '#FFF8E0',
  border: '1.5px dashed #FFD23F',
  labelColor: '#7A5A0A',
  labelSize: 11,
  coinGap: 5,
  coinSize: 30,
  coinGradient:
    'radial-gradient(circle at 35% 32%, #FFFFFF, #E8ECEF 38%, #A6AEB5 80%, #6C7681)',
  coinBorder: '#5B6570',
  coinGlyphColor: '#3A4750',
  coinGlyphSize: 13,
} as const;
