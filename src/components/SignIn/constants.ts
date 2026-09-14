export const SIGN_IN_TEST_IDS = {
  container: 'sign-in',
  pig: 'sign-in-pig',
  continueWithGoogle: 'continue-with-google',
} as const;

export const SIGN_IN_COPY = {
  pig: '🐷',
  wordmark: 'Fun Saver',
  tagline: 'החיסכון של הילדים, במקום אחד',
  cardTitle: 'התחברות',
  cardBody: 'התחברו עם חשבון Google כדי לראות את החשבונות שלכם מכל מכשיר.',
  continueWithGoogle: 'המשך עם Google',
  fineprint:
    'בכניסה ראשונה ניצור לכם חשבון משתמש אוטומטית. אנחנו שומרים רק שם ואימייל.',
} as const;

export const SIGN_IN_LAYOUT = {
  pigSize: 76,
  wordmarkSize: 34,
  cardRadius: 26,
  cardPaddingY: 24,
  cardPaddingX: 20,
  cardGap: 14,
  cardMaxWidth: 340,
  googleMarkSize: 26,
  taglineMaxWidth: 22,
  fineprintMaxWidth: 26,
} as const;

export const GOOGLE_PROVIDER_ID = 'google';

export const SIGNED_IN_DESTINATION = '/';
