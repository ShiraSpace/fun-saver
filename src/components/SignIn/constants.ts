export const SIGN_IN_TEST_IDS = {
  container: 'sign-in',
  pig: 'sign-in-pig',
  cardTitle: 'sign-in-card-title',
  cardBody: 'sign-in-card-body',
  continueWithGoogle: 'continue-with-google',
  error: 'sign-in-error',
} as const;

export const SIGN_IN_COPY = {
  wordmark: 'Fun Saver',
  tagline: 'החיסכון של הילדים, במקום אחד',
  cardTitle: 'התחברות',
  cardBody: 'התחברו עם חשבון Google כדי לראות את החשבונות שלכם מכל מכשיר.',
  continueWithGoogle: 'המשך עם Google',
  signingIn: 'רגע, מתחברים…',
  signInFailed: 'ההתחברות נכשלה. בדקו את החיבור לאינטרנט ונסו שוב.',
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
  googleButtonGap: 10,
  googleLogoSize: 16,
  taglineMaxWidth: 22,
  fineprintMaxWidth: 26,
} as const;

export const GOOGLE_PROVIDER_ID = 'google';

export const SIGNED_IN_DESTINATION = '/';

export const GOOGLE_BRAND_WHITE = '#FFFFFF';
