export const WALLET_CARD_TEST_IDS = {
  card: 'wallet-card',
  balance: 'wallet-balance',
} as const;

export const WALLET_CARD_COPY = {
  name: {
    savings: 'חיסכון',
    spending: 'בזבוזים',
    goodDeeds: 'מעשים טובים',
  },
} as const;

export const WALLET_CARD_STYLE = {
  radius: 16,
  paddingY: 10,
  paddingX: 12,
  gap: 12,
  shadow: '0 3px 0 rgba(0, 0, 0, 0.06)',
  illustSize: 42,
  illustRadius: 12,
  illustFontSize: 22,
  illustGradient: {
    savings: 'linear-gradient(135deg, #FFE6B0, #FFC34D)',
    spending: 'linear-gradient(135deg, #FFD8C7, #FF8A4C)',
    goodDeeds: 'linear-gradient(135deg, #FBC4DA, #E94E89)',
  },
  nameSize: 13,
  pillBg: '#FFF6E0',
  pillBorder: '1.5px solid #FFD23F',
  pillPaddingY: 5,
  pillPaddingX: 11,
  pillFontSize: 15,
} as const;
