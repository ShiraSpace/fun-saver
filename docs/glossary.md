# Glossary

One English word per concept, the one the code uses. A reader should understand
the domain from the names alone, so new code takes its words from this table.

## Naming rules

- **Domain, not mechanism.** Name what a value means to the parent or child using
  the app, not how it is computed, stored or drawn: `balanceHistory`, not
  `buildBalanceSeries`; `closingBalance`, not `last`.
- **One word per concept.** When a type names a concept (`Transaction`, `Wallet`,
  `Account`), every function, prop, param and local uses that word.
- **Name a value after the thing that changed:** `balanceChange`, not `delta`.
- **A parameter takes its type's name:** `history: BalanceHistory`.
- **No collisions.** Names that read alike mean alike. Client code never shadows a
  browser or JS global (`window`, `history`, `name`, `event`, `location`,
  `status`, `screen`, `close`, `Number`).
- **Whole words.** `Navigation`, not `Nav`; `transactionId`, not `txId`.
- **Test stand-ins take a `mock` prefix in camelCase.** Fixtures, values built by a
  `createMock…` helper and jest mocks are `mockAccountId`, `mockAccount` and `mockOnClose`. `SCREAMING_SNAKE_CASE` is for actual constants:
  env and URLs, cookie names, viewports, timings, selectors, `*_TEST_IDS`, `*_COPY`.

## Terms

| Concept                              | Hebrew UI                      | Code term                                                                 | Not                                                 |
| ------------------------------------ | ------------------------------ | ------------------------------------------------------------------------- | --------------------------------------------------- |
| A child's account                    | חשבון                          | `account`                                                                 | "account" for a Google account; that is an identity |
| The signed-in parent                 | —                              | `user`, `signedInUser`                                                    | profile                                             |
| A parent's Google sign-in            | —                              | `identity` (`GoogleIdentity`)                                             | provider, provider account                          |
| One of the three jars                | קופה                           | `wallet`                                                                  | pot, jar, box, tile                                 |
| Which jar                            | חיסכון · בזבוזים · מעשים טובים | `walletName`: `savings`, `spending`, `goodDeeds`                          | `good`, a bare `name`                               |
| A jar's Hebrew label                 | —                              | `WALLET_LABEL`                                                            | `WALLET_NAME`                                       |
| Money going in or out                | תנועה · תנועות                 | `transaction`                                                             | movement, entry, row, action, ledger, history       |
| Its kind                             | —                              | `transactionType`; its values in `TRANSACTION_TYPE`                       | mode                                                |
| Putting money in                     | הפקדה                          | `deposit`                                                                 | —                                                   |
| Taking money out                     | משיכה                          | `withdrawal`; `withdraw` only as the verb for a step a user takes         | spent                                               |
| Giving from the good-deeds jar       | תרומה                          | `donation`, a good-deeds withdrawal as the UI shows it                    | spent                                               |
| The 50 / 40 / 10 rule                | —                              | `DEPOSIT_SHARES` for the fractions, `DepositSplit` for the agorot amounts | split for fractions, share for amounts              |
| Interest                             | ריבית · רווח מריבית            | `interest`, `interestEarned`, `interestEarnedToday`                       | gain, `todayInterest`                               |
| Paying the interest owed up to today | —                              | `settle`, `settleInterest`, `SettledAccount`                              | pay, payout, ledger                                 |
| Money in a jar                       | יתרה                           | `balance`; for the whole account `totalBalance`                           | overview, walletTotal, value                        |
| What a day changed                   | שינוי                          | `balanceChange`                                                           | delta, netChange                                    |
| The balance over time                | —                              | `balanceHistory`                                                          | series                                              |
| The child's own money, not interest  | הכסף שלך                       | `principal`: deposits less withdrawals                                    | deposits, deposited, ownMoney                       |
| An amount of money                   | ₪                              | agorot unless the name ends `…Shekels`                                    | a bare `amount` holding shekels                     |
| The account being viewed             | —                              | `currentAccount`                                                          | selected, target                                    |
| Settings in the menu                 | הגדרות                         | `MenuAccountSettings`, `MenuUserSettings`                                 | scope                                               |
| Moving between screens               | בית · תנועות · השיטה           | `navigation`: `NavigationTabs`, `NavigationDestination`                   | nav, screen                                         |
| The Method page's to-do list         | מה צריך לעשות                  | `checklist`                                                               | action                                              |
| The main call-to-action button       | —                              | `PrimaryButton`                                                           | action button                                       |
| Signing in                           | —                              | `signIn`, `SIGN_IN_PATH`                                                  | login                                               |
| A finger on the screen, in e2e       | —                              | `tap`                                                                     | click                                               |
| Where data is saved                  | —                              | `store`, `StoreContents`, `storePath`                                     | data, seed                                          |
| A test stand-in                      | —                              | `mockCamelCase`                                                           | `UPPER_CASE`, seed, `createMock…`                   |
