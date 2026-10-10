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
- **Name a component after what it shows, not what it is drawn as:**
  `BalanceBreakdown`, not `DonutCard`; `BalanceChange`, not `SignedAmount` or
  `ChangePill`. Before naming one, look at how its nearest sibling is named.
- **Money stays numbers in `src/lib/money.ts`.** Turning an amount into display
  text lives with the component that draws it.
- **A parameter takes its type's name:** `balanceHistory: BalanceHistory`.
- **No collisions.** Names that read alike mean alike. Client code never shadows a
  browser or JS global (`window`, `history`, `name`, `event`, `location`,
  `status`, `screen`, `close`, `Number`).
- **Whole words.** `Navigation`, not `Nav`; `transactionId`, not `txId`.
- **Test stand-ins take a `mock` prefix in camelCase.** Fixtures, values built by a
  `createMock…` helper and jest mocks are `mockAccountId`, `mockAccount` and `mockOnClose`. `SCREAMING_SNAKE_CASE` is for actual constants:
  env and URLs, cookie names, viewports, timings, selectors, `*_TEST_IDS`, `*_COPY`.

## Terms

| Concept                                 | Hebrew UI                      | Code term                                                                                               | Not                                                            |
| --------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| A child's account                       | חשבון                          | `account`                                                                                               | "account" for a Google account; that is an identity            |
| Another child's account in the family   | —                              | `siblingAccount`, `siblingAccounts`                                                                     | brother, sister, other child, a bare `sibling`                 |
| The signed-in parent                    | —                              | `user`, `signedInUser`                                                                                  | profile                                                        |
| A parent's Google sign-in               | —                              | `identity` (`GoogleIdentity`)                                                                           | provider, provider account                                     |
| One of the three jars                   | קופה                           | `wallet`                                                                                                | pot, jar, box, tile                                            |
| Which jar                               | חיסכון · בזבוזים · מעשים טובים | `walletName`: `savings`, `spending`, `goodDeeds`; its values in `WALLET_NAME`, listed in `WALLET_NAMES` | `good`, a bare `name`                                          |
| Any jar but savings                     | בזבוזים · מעשים טובים          | `SpendableWalletName`                                                                                   | ChildWalletName, NonSavingsWalletName                          |
| A jar's Hebrew label                    | —                              | `WALLET_LABEL`                                                                                          | `WALLET_NAME`, which holds the names                           |
| Money going in or out                   | תנועה · תנועות                 | `transaction`                                                                                           | movement, entry, row, action, ledger, history                  |
| Its kind                                | —                              | `transactionType`; its values in `TRANSACTION_TYPE`                                                     | mode                                                           |
| Putting money in                        | הפקדה                          | `deposit`                                                                                               | —                                                              |
| Taking money out                        | משיכה                          | `withdrawal`; `withdraw` only as the verb for a step a user takes                                       | spent                                                          |
| Giving from the good-deeds jar          | תרומה                          | `donation`, a good-deeds withdrawal as the UI shows it                                                  | spent                                                          |
| The 50 / 40 / 10 rule                   | —                              | `DEPOSIT_SHARES` for the fractions, `DepositSplit` for the agorot amounts                               | split for fractions, share for amounts                         |
| Interest                                | ריבית · רווח מריבית            | `interest`, `interestEarned`, `interestEarnedToday`                                                     | gain, `todayInterest`                                          |
| Paying the interest owed up to today    | —                              | `settle`, `settleInterest`, `SettledAccount`                                                            | pay, payout, ledger                                            |
| Money in a jar                          | יתרה                           | `balance`; for the whole account `totalBalance`                                                         | overview, walletTotal, value                                   |
| What a day changed                      | שינוי                          | `balanceChange`, `BalanceChange`                                                                        | delta, netChange, signed amount, change pill                   |
| The balance over time                   | —                              | `balanceHistory`, `BalanceOverTime`                                                                     | series, chart card                                             |
| The child's own money, not interest     | הכסף שלך                       | `principal`: deposits less withdrawals                                                                  | deposits, deposited, ownMoney                                  |
| What a child saves toward               | יעד · יעד חיסכון               | `goal`, `Goal`, `goalReached`                                                                           | target, objective, wish                                        |
| The goal's picture                      | תמונה                          | `picture`, `GoalPicture`                                                                                | image, icon, thumbnail                                         |
| A picture search result                 | —                              | picture tile, `PictureTile`, `PictureTiles`; all of them `FoundPictures`; their emoji `foundEmoji`      | thumbnail, option, grid; `pictures` for the emoji              |
| Why no pictures show                    | —                              | `whyNoPictures`, `NoPicturesReason`                                                                     | state line, status, hint, empty state                          |
| How a goal ended                        | —                              | `ending`: `completed`, `cancelled`; values in `GOAL_ENDING`; type `GoalEnding`                          | status, result, outcome, done                                  |
| Asking to end a goal                    | —                              | `endRequest`, `GoalEndRequest`                                                                          | goalEnd, `GoalEnd`, end params                                 |
| Savings kept for a goal                 | שומרים עד היעד                 | `SavingsLockedError`, locked                                                                            | frozen, blocked                                                |
| A goal reached, shown                   | הגעת ליעד!                     | `Celebration`                                                                                           | confetti, party                                                |
| An amount of money                      | ₪                              | agorot unless the name ends `…Shekels`                                                                  | a bare `amount` holding shekels                                |
| The account being viewed                | —                              | `currentAccount`                                                                                        | selected, target                                               |
| The phone's mode, child or parent       | מצב ילד · מצב הורה             | `ViewMode` (`VIEW_MODE`); `VIEW_MODE_COOKIE`, `useViewMode`                                             | `AppViewMode`, `AppMode` (viewing/creating/editing), childView |
| Whole shekels, never more than there is | ₪                              | `floorToShekels`; on screen `MONEY_ROUNDING.floorToShekels`                                             | rounding to nearest on a child's screen, downToShekel          |
| How an amount is rounded on screen      | ₪                              | `rounding` (`MoneyRounding`): `MONEY_ROUNDING.nearestShekel`, `nearestHalfShekel`, `floorToShekels`     | allowHalf, roundDown                                           |
| Savings as the child sees it            | הפקדת · הרוויח לבד             | `savingsWithoutAgorot`: `balance`, `principal`, `interestEarned`, each through `withoutAgorot`          | deposited, gain                                                |
| Settings in the menu                    | הגדרות                         | `MenuAccountSettings`, `MenuUserSettings`                                                               | scope                                                          |
| Settings for every child on this phone  | הגדרות כלליות                  | `MenuGlobalSettings`                                                                                    | device settings, app settings                                  |
| Moving between screens                  | בית · תנועות · השיטה           | `navigation`: `NavigationTabs`, `NavigationDestination`                                                 | nav, screen                                                    |
| The Method page's opening section       | מה אנחנו מנסים להשיג           | `purpose`, `PURPOSE_COPY`                                                                               | goal; that is the saving goal                                  |
| The Method page's to-do list            | מה צריך לעשות                  | `checklist`                                                                                             | action                                                         |
| The main call-to-action button          | —                              | `PrimaryButton`                                                                                         | action button                                                  |
| A panel rising from the screen's bottom | —                              | `BottomSheet`, `BottomSheetScrim`; the drawer and the picture search are built on it                    | popup, drawer base, modal box                                  |
| A request, sent until answered          | —                              | `requestState`: `REQUEST_STATE` idle · pending · failed                                                 | `isSaving`, `isSubmitting`, `hasError`                         |
| Signing in                              | —                              | `signIn`, `SIGN_IN_PATH`                                                                                | login                                                          |
| A finger on the screen, in e2e          | —                              | `tap`                                                                                                   | click                                                          |
| Where data is saved                     | —                              | `store`, `StoreContents`, `storePath`                                                                   | data, seed                                                     |
| A test stand-in                         | —                              | `mockCamelCase`                                                                                         | `UPPER_CASE`, seed, `createMock…`                              |
