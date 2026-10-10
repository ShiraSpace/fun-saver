export const WITHDRAWAL_FORM_TEST_IDS = {
  amount: 'withdraw-amount',
  overdraft: 'withdraw-overdraft',
  completesGoal: 'withdraw-completes-goal',
} as const;

export const WITHDRAWAL_FORM_COPY = {
  title: 'מאיזו קופה מושכים?',
  donationTitle: 'כמה תורמים? 💛',
  submit: 'משיכה של',
  donationSubmit: 'תרומה של',
  submitting: 'מושכים…',
  overdraftPrefix: 'אין מספיק בקופה — יש רק',
  savingsLockedSubmit: '🔒 שומרים עד היעד',
  completesGoal: (goalName: string): string =>
    `🎉 משיכה מהחיסכון תסיים את היעד „${goalName}”`,
} as const;
