# Kids' money apps: market research

Researched 2026-09-25. Sources are linked in each row. "Unclear" means the claim could not be verified.

Companion: `docs/research/market-research.html`, published at [Kids' Money Apps Landscape](https://claude.ai/artifact/Sy64sjaDzSUo5RikXwAWBG).

## Fun Saver in one line

A Hebrew, parent-run virtual ledger. Each child has three wallets (savings, spending, good deeds), every deposit splits 50/40/10, and savings earn parent-paid daily compounding interest drawn as coins. No real card.

## Bottom line

No app found, in Israel or abroad, combines all of Fun Saver's mechanics: a fixed 50/40/10 auto-split, a giving wallet, parent-set daily compounding interest drawn as coins, and Hebrew. This is likely rather than proven, because not every app was tried hands-on.

## Answers

### 1. Do they teach money skills, or only help kids save?

Mostly they only help kids save or track money.

- **Worldwide:** about 30% put real weight on teaching. That is either standalone games (Zogo, MoneyPrep, MoneyTime, Visa Financial Football) or the big card apps with lessons built in (Greenlight Level Up, GoHenry Money Missions, Modak quizzes, Mydoh Learn). The other ~20 apps are allowance, chore or bank apps with light tips or none.
- **Israel:** the market splits in two. Banks and card companies have real money and cards but almost no teaching. The Hebrew teaching products (FinanKids, Kal-Klili, Bank of Israel booklets, Paamonim school programs) teach but keep no money ledger.
- **Nobody ties lessons to the child's own money.** Goalsetter tried, by locking spending until quizzes were passed, and closed its consumer app in February 2026.

### 2. Do any let kids actually pay?

Yes. The well-funded players have all moved to real cards.

- **Worldwide:** debit or prepaid cards from Greenlight, Acorns Early, GoHenry, Pixpay, BusyKid, Step, Current, FamZoo, Rooster Card, Osper, Revolut <18, Monzo, Starling, Till, Modak, Mydoh and Spriggy. Apple/Google Pay is confirmed for Till (13+) and common among the neobanks. Revolut and Step have P2P transfers.
- **Israel:** Poalim Junior (card; Google Pay 13+, Apple Pay 14+), PayBox Young (NFC, card, P2P between PayBox Young users), prepaid cards MyMAX, My Cal and Isracard Netantchik (any age, parent holds the account), Leumi CASH (14+), youth bank accounts (14+). bit is P2P only and effectively 14+.
- **Can't pay:** every virtual ledger and every education app, in both markets.

### 3. Who is closest to Fun Saver?

- **FamZoo (US):** save/spend/give split, parent-paid compound interest, free virtual "IOU" mode. Closest match on mechanics.
- **NatWest Rooster Money (UK):** free virtual ledger with spend/save/give pots and parent-paid interest. A paid card is the upgrade.
- **BusyKid (US):** save/share/spend with a percentage split on payday, parent-paid interest and matching. Card-based.
- **iAllowance, Homey, Bankaroo:** virtual jars with auto-split and (in iAllowance and Bankaroo) interest. Old or quiet.
- **KidBank.io:** interest growth simulator chart, the nearest thing to Fun Saver's interest visual.
- **FinanKids (Israel):** Hebrew, parent-managed virtual coins, savings goals, lessons, ages 7–14. No auto-split, no giving wallet, no interest.
- **Poalim Junior, PayBox Young (Israel):** interest and savings pots, but real money, one bank, and interest set by the bank or conditional.

## Philosophy: chores or not

Many competitors pay for chores. Fun Saver deliberately doesn't.

**The commission model (pay for chores):** money is earned, and no work means no pay. The aim is to teach that money comes from effort.

| App                                               | How chores fit in                                      |
| ------------------------------------------------- | ------------------------------------------------------ |
| BusyKid, S'moresUp, Joon                          | Built around chores; payday is chore-driven            |
| FinanKids (closest Hebrew app)                    | Chores are part of its game loop                       |
| Rooster Money, GoHenry, Greenlight, FamZoo, Homey | Support both: a fixed allowance, paid chores, or a mix |

Not every app's settings were checked. The "support both" apps lead with chores in their marketing but can be used without them.

**Fun Saver's position** (Method page, `src/components/Method/copy/setup.ts`): the allowance is not tied to chores, and that's the recommendation.

- **Overjustification effect** (Lepper, Greene & Nisbett, 1973): a promised reward weakens motivation the child already had.
- **A Fine is a Price** (Gneezy & Rustichini, 2000): attaching money to a social obligation replaces the obligation. Chores become a job the child can decline ("I don't need the money this week") instead of part of belonging to the family.
- The allowance is a teaching tool. It arrives reliably, and what teaches is the structure around it: the three wallets, "wait for next week", and the weekly conversation.

**Weak point in our evidence:** Mandell's data (see `docs/research/jar-method.md`) shows chore-based allowance scoring slightly higher on financial literacy than unconditional allowance (52.1% vs 49.1%). It's observational, and Fun Saver is unconditional _plus structure_, not bare unconditional. But the strongest support for our side is the motivation research, not literacy scores.

**Positioning:**

- The no-chores stance sets Fun Saver apart, especially against FinanKids in Hebrew. It's a stance, and some parents will reject it.
- The common middle ground is an unconditional base allowance plus optional paid "extra jobs" beyond normal family duties. If parents ask for chores, that version doesn't contradict the Method page.

## Gaps Fun Saver could own

1. **A giving wallet.** No Israeli product has one, though it fits the ma'aser custom. Worldwide, giving is optional or buried (NSPCC-only at GoHenry, a $10 minimum at Greenlight).
2. **Daily compounding drawn as coins.** Parent-paid interest elsewhere is weekly or monthly and shown as a number.
3. **Ages 5–8.** Israeli banks start at 8 or 14, phone wallets at 13–14. A free, card-less, bank-agnostic ledger serves the youngest kids.
4. **Lessons triggered by the child's own money,** for example "your savings just earned 3 agorot, here's why".
5. **Modern virtual-only ledger.** The virtual apps are mostly old or abandoned (iAllowance, PiggyBot, Bankaroo; ThreeJars is gone). A virtual ledger needs no KYC or banking licence, and avoids the Synapse collapse that ended Copper's banking.
6. **Price.** Card apps cost $5–20 a month.

**Risk:** parents may eventually want a real card. Rooster Money's path, free virtual first and a paid card later, is the proven route. In Israel that means partnering with an issuer such as Isracard, Max or PayBox.

## How the big players make money

Four models; most players combine two. Pricing comes from the tables below; how each company profits is general industry knowledge, not checked against financial reports.

| Model                               | Who                                                                                                                             | How it earns                                                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Family subscription**             | Greenlight ($5.99–19.98/mo), GoHenry (£3.99–9.99), Acorns Early ($8–12), BusyKid ($48/yr), FamZoo, Till, Spriggy, Osper, Pixpay | Monthly fee per family is the main revenue; card fees and upsells to investing tiers add to it                                                        |
| **Bank acquiring future customers** | NatWest Rooster Money, RBC Mydoh, Monzo and Starling Under 16s, Revolut <18, Poalim Junior, PayBox Young                        | Free or cheap and loss-making alone. The bank buys the parent's loyalty now and the child as a customer for decades; kids' deposits are cheap funding |
| **Card fees, float and credit**     | Step, Current, Revolut partly                                                                                                   | Free to the family. Earns the fee shops pay per purchase plus interest on held balances; Step builds teens toward credit                              |
| **Selling to institutions**         | Zogo (paid by banks and credit unions), Goalsetter since Feb 2026, Visa Financial Football                                      | Free to users; a bank or brand pays for the lessons as marketing or outreach                                                                          |

- **Big standalone apps end up inside a bank or investment company:** Acorns bought GoHenry, Barclays is buying GoHenry UK, NatWest owns Rooster, RBC runs Mydoh, MrBeast's company bought Step. A subscription alone seems hard to sustain.
- **In Israel it's all banks and card companies.** Poalim Junior is free with 4% (customer acquisition). PayBox Young charges ₪4.9–7.9 a month, and its 6% applies only if the parent spends over ₪2k a month on their card, so it drives the parent's spending. Prepaid cards charge ₪1–3.5 per load.

## A card model for Fun Saver

Goal: go worldwide with card integration, keep it very cheap for families, and at least cover costs.

### Why "free card, earn on purchases" doesn't work in Israel

- ₪30 a week with ₪15 to spending ≈ ₪780 a year of card spending per child.
- The fee shops pay per purchase is capped low in Israel, about 0.3% for debit (**unverified**).
- ₪780 × 0.3% ≈ **₪2.3 a year per child**, before the card provider takes its share. Per-card costs (identity checks, account fees, fraud, support) are very likely higher.
- Free works for US apps (issuers exempt from the cap earn ~1.3%, plus float and credit) and Israeli banks (loss leader). Fun Saver has neither.

### Recommended model: free tracking, card at cost plus a thin margin, priced per family

| Tier                         | What's in it                                                       | Price                                                | What it costs us                                                                               |
| ---------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Free, always**             | Ledger, 3 wallets, 50/40/10 split, interest, Method page, all kids | Free                                                 | Hosting only, cents per family. Brings families in worldwide with no per-country payment setup |
| **Family card**              | Cards for every child, parent controls, weekly loads               | Cost + ~20%, **one price per family, not per child** | Provider fees, identity checks, support                                                        |
| **Physical card** (optional) | Plastic on top of the phone card                                   | One-time fee at cost                                 | Printing and shipping                                                                          |

### Cost levers that decide the price

1. **Phone-only cards by default.** Apple/Google Pay has no printing or shipping; plastic is opt-in.
2. **Charge only for active cards.** Providers usually bill per active card per month; an unused card costs and pays nothing.
3. **Take payment on the web, not in the app stores.** About 3% instead of Apple's or Google's 15–30%, the biggest cost difference on a cheap plan.
4. **One provider across many countries.** Airwallex runs its card program in many countries (see `docs/research/real-money-provider.md`), so a new country is a settings change, not a new integration.
5. **Price each country separately,** from local costs, purchasing power and the local per-purchase fee: US ~1.3% (exempt issuers), EU/UK capped ~0.2%, Israel ~0.3% (unverified). The family card could be near free in the US and ₪8–10 in Israel.

### Rough break-even per family

**Every number is an assumption until a provider quotes.** Family with 2 kids, both with phone cards:

| Item                                                        | Monthly cost (assumed)         |
| ----------------------------------------------------------- | ------------------------------ |
| 2 active cards × ~$1                                        | $2.00                          |
| Identity checks for 3 people (~$1.5 each) over 2 years      | $0.20                          |
| ~8 purchases per kid × ~$0.05                               | $0.80                          |
| Support                                                     | $0.30                          |
| Web payment processing, 3%                                  | $0.10                          |
| **Cost**                                                    | **≈ $3.40**                    |
| Minus shop fees on ~$100/mo spending: Israel 0.3% / US 1.3% | −$0.30 / −$1.30                |
| **Break-even**                                              | **≈ $3.10 Israel, ≈ $2.10 US** |

With a 20% margin: roughly **$2.5–4 per family per month**, against Greenlight from $5.99, GoHenry from £3.99 per child, and PayBox Young ₪4.9–7.9.

### Stay away from

- **Ads, selling data, or nudging spending.** Children's privacy law (COPPA, GDPR's children's rules) makes it risky, and it contradicts the Method.
- **Counting on interest from kids' balances.** Under most providers' terms it stays with the issuer; negotiate it, don't budget it.

### Later: income that keeps the family price low

License the localized lessons and the ledger to banks or credit unions (the Zogo route). It reuses what's built, and it's what a bank would buy.

### Next step

Get the Airwallex quote: per-card, per-purchase and monthly fees, and whether it shares the purchase fee. Also confirm Israel's exact cap on debit and prepaid purchase fees.

## Israel: rules that matter

- **Bank account:** from 14 with written parental consent; from 16 alone (in-app at Discount and Hapoalim).
- **Cards:** ATM/limited debit from 14 with consent (₪400/day withdrawal cap until 18). Debit from 16, or 15 with a regular salary. Credit from 16 with consent.
- **Prepaid cards** from card companies have no minimum age, because the parent holds the account. Bank prepaid products start at 8 (Poalim Junior, PayBox Young).
- **bit** needs an Israeli current account or debit card in the user's own name, so no use under 14 (exact age unverified).
- **Phone wallets:** Hapoalim states Google Pay from 13 and Apple Pay from 14 for a kid's card. Google's supervised Wallet for kids is not available in Israel; Apple Cash Family likely isn't either (inferred).
- **No global kids' app operates in Israel:** Greenlight, GoHenry, Current and Revolut <18 are unavailable.

## Recent changes

- Goalsetter closed its consumer app on 2026-02-13; it now sells education to institutions.
- Copper dropped banking and debit in May 2024 after Synapse collapsed.
- GoHenry US now trades as Acorns Early. Barclays is buying GoHenry UK, completion expected Q4 2026.
- MrBeast (Beast Industries) bought Step in February 2026.
- Poalim Junior launched July 2026. PayBox Young launched November 2024.
- The leumi.me teen app's Play listing returns 404, so it is probably discontinued (unverified).

## Israel and Hebrew products

| Name                                                                                 | Type                               | Age                              | Hebrew        | Education                                    | Giving                 | Interest                                       | Kid can pay                         | Status 2026                                                    | Source                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------ | ---------------------------------- | -------------------------------- | ------------- | -------------------------------------------- | ---------------------- | ---------------------------------------------- | ----------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Poalim Junior (Hapoalim, in Poalim Wonder)                                           | Bank sub-account + prepaid card    | 8+                               | Y             | Light (fin-ed section, Fingrow for parents)  | N (savings goals only) | 4% fixed, daily, up to ₪30k                    | Card; Google Pay 13+, Apple Pay 14+ | Launched Jul 2026, free                                        | [bankhapoalim.co.il](https://www.bankhapoalim.co.il/he/poalim-digital/junior), [calcalist](https://www.calcalist.co.il/local_news/article/bjy0ipbvfl)                                         |
| PayBox Young (Discount)                                                              | Digital wallet + prepaid card      | 8–18 (digital-only reported 14+) | Y             | Light                                        | N (savings pots)       | Up to 6%, only if parent's card spend > ₪2k/mo | NFC, card, P2P between Young users  | Active, ₪4.9/7.9 a month                                       | [payboxapp.com](https://www.payboxapp.com/paybox-young), [calcalist](https://www.calcalist.co.il/investing/article/bjs5zhxmke)                                                                |
| MyMAX (Max)                                                                          | Prepaid card                       | Any                              | Y             | None                                         | N                      | N                                              | Card, digital wallet                | Active, ₪1 per load                                            | [max.co.il](https://www.max.co.il/cards/my-max)                                                                                                                                               |
| My Cal (Cal)                                                                         | Prepaid card                       | Any                              | Y             | None                                         | N                      | N                                              | Card                                | Active, ₪2.9 per load                                          | [mako](https://www.mako.co.il/finances-money/Article-58bf31c71916f91026.htm)                                                                                                                  |
| Netantchik (Isracard)                                                                | Prepaid card                       | Any                              | Y             | None                                         | N                      | N                                              | Card, Apple/Google Pay              | Active, ₪3.5 per load, ₪1k cap                                 | [isracard.co.il](https://www.isracard.co.il/credit-cards/prepaidcard)                                                                                                                         |
| Leumi CASH / leumi.me                                                                | Prepaid card + teen app            | 14–18                            | Y             | Light                                        | N                      | N                                              | Card                                | CASH active; leumi.me probably discontinued (unverified)       | [leumi.co.il](https://www.leumi.co.il/he/account-types/leumi-card-cash)                                                                                                                       |
| Youth bank accounts (Leumi, Hapoalim Young, Discount, Mizrahi-Tefahot, FIBI, Pepper) | Bank account                       | 14+                              | Y             | None to light                                | N                      | Deposit products                               | Debit/ATM card                      | Active                                                         | [bluewhitefinance](https://bluewhitefinance.com/teens-manage-money/), [mizrahi-tefahot](https://www.mizrahi-tefahot.co.il/faq/age/)                                                           |
| ONE ZERO                                                                             | Digital bank                       | 18+ only                         | Y             | –                                            | –                      | –                                              | –                                   | No youth product                                               | [Play](https://play.google.com/store/apps/details?id=il.co.firstdigitalbank)                                                                                                                  |
| bit (Hapoalim)                                                                       | P2P wallet                         | Effectively 14+ (unverified)     | Y             | None                                         | N                      | Adults only                                    | P2P                                 | Active, no kids product                                        | [ice.co.il](https://www.ice.co.il/digital-140/news/article/966367)                                                                                                                            |
| KashCash                                                                             | Stored-value phone wallet          | Any                              | Y             | None                                         | N                      | N                                              | Participating shops only            | Active, small                                                  | [kashcash.co.il](https://www.kashcash.co.il/)                                                                                                                                                 |
| FinanKids                                                                            | Virtual tracker + gamified lessons | 7–14                             | Y (+ English) | Structured (videos, quizzes, chores, levels) | N (savings goals)      | N                                              | No, virtual coins                   | Active since Aug 2025, ~1,500 families                         | [App Store](https://apps.apple.com/il/app/id6748967998)                                                                                                                                       |
| Docli Kids                                                                           | Education + allowance helper       | Grades 3, 8 (pilot)              | Y             | School subjects, not finance                 | N                      | N                                              | No                                  | Pilot                                                          | [kids.docli.co.il](https://kids.docli.co.il/)                                                                                                                                                 |
| PayKid (CloseApp)                                                                    | Virtual ledger                     | Kids                             | Y             | None                                         | N                      | N                                              | No                                  | 2021 MVP, likely dormant                                       | [closeapp.co.il](https://closeapp.co.il/)                                                                                                                                                     |
| Kal-Klili                                                                            | Story-based lessons                | 9–11                             | Y             | Structured                                   | N                      | N                                              | No                                  | Updated Dec 2025                                               | [App Store](https://apps.apple.com/us/app/id6744107979)                                                                                                                                       |
| Chisachon LeKol Yeled (Bituach Leumi)                                                | Government long-term savings       | 0–18                             | Y             | None                                         | N                      | Market returns                                 | No                                  | ₪58/mo from gov + optional ₪58 parent (2026); no dedicated app | [btl.gov.il](https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/default.aspx)                                                                                                       |
| Bank of Israel "Kesef Katan", kids.gov.il, Paamonim, ORT, Shekel Kids                | Education content                  | Varies                           | Y             | Structured                                   | Giving not central     | N                                              | No                                  | Active                                                         | [boi.org.il](https://www.boi.org.il/information/community-relations/small-moneyar/books/), [paamonim.org](https://www.paamonim.org/he/financial_education/), [ort](https://money.ort.org.il/) |

**Not found in Israel:** Kido, Kidsli, Tikun, Bamboo, Moneyline, "Leumi Teen", "Poalim Teen" (the real names are Poalim Junior and Poalim Young), a One Zero youth product. Mozper was founded by Israelis but runs in Latin America.

## Global products

| App                          | Country      | Model                            | Ages   | Education                   | Giving                                      | Interest                                  | Pricing                      | Status 2026                   | Source                                                                                                                               |
| ---------------------------- | ------------ | -------------------------------- | ------ | --------------------------- | ------------------------------------------- | ----------------------------------------- | ---------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Greenlight                   | US           | Debit card + investing           | ~6–18  | Structured (Level Up)       | Y (Giving account)                          | Parent-paid custom rate + Greenlight 2–6% | $5.99–19.98/mo               | Active                        | [help.greenlight.com](https://help.greenlight.com/hc/en-us/articles/360020603133)                                                    |
| Acorns Early (ex-GoHenry US) | US           | Debit card + custodial investing | 6–18   | Structured (Money Missions) | Unclear                                     | Unclear                                   | $8–12/mo                     | Active                        | [acorns.com](https://www.acorns.com/early/)                                                                                          |
| GoHenry UK                   | UK           | Prepaid card                     | 6–18   | Structured (80+ missions)   | Y (NSPCC micro-donations)                   | Real ~2.63% AER                           | £3.99–9.99/mo                | Active; Barclays sale pending | [gohenry.com](https://www.gohenry.com/uk/pricing/)                                                                                   |
| Pixpay                       | FR/ES/IT     | Card + IBAN                      | 8–18   | Light                       | Unclear                                     | Unclear                                   | €3.99–9.99/mo                | Active (Acorns)               | [moneyvox.fr](https://www.moneyvox.fr/epargne/pixpay)                                                                                |
| BusyKid                      | US           | Prepaid card + stocks            | ~5–17  | Light                       | Y (Save/Share/Spend split)                  | Parent-paid + match                       | $48/yr                       | Active                        | [busykid.com](https://busykid.com/faq/)                                                                                              |
| Step                         | US           | Secured card, credit-building    | 13–18+ | Light                       | N                                           | Real high-yield                           | Free                         | Active; bought by MrBeast     | [cnbc](https://www.cnbc.com/2026/02/10/youtube-mrbeast-youth-financial-services-app-step-beast-industries-acquires-fintech-app.html) |
| Current Teen                 | US           | Debit card                       | 13–17  | Light                       | Y (giving balances)                         | Real ~0.25%                               | Free                         | Active                        | [current.com](https://support.current.com/hc/en-us/sections/52070560473499-Teen-Banking)                                             |
| FamZoo                       | US           | Prepaid card or IOU ledger       | Any    | Light                       | Y (Save/Spend/Give split)                   | Parent-paid compound                      | $4.99–5.99/mo; IOU free      | Active                        | [finder](https://www.finder.com/kids-banking/famzoo)                                                                                 |
| NatWest Rooster Money        | UK           | Virtual ledger + prepaid card    | 3–17   | Light–medium                | Y (Spend/Save/Give pots)                    | Parent-paid                               | Card £1.99/mo                | Active                        | [roostermoney.com](https://roostermoney.com/pricing/)                                                                                |
| Osper                        | UK           | Prepaid card                     | ~6–18  | Light                       | Unclear                                     | Unclear                                   | £2.50/child/mo               | Active                        | [osper.com](https://osper.com/pricing)                                                                                               |
| Revolut <18                  | EU/UK/US     | Card + vaults                    | 6–17   | Light                       | N                                           | Real daily (UK)                           | Via parent plan (unverified) | Active                        | [revolut.com](https://www.revolut.com/kids-and-teens/kids-savings-account/)                                                          |
| Monzo Under 16s              | UK           | Bank account + card              | 6–15   | Light                       | N                                           | Real ~3% AER                              | Free                         | Active                        | [monzo.com](https://monzo.com/help/monzo-for-under-16s/under-16s-interest)                                                           |
| Starling Under 16s           | UK           | Bank account + card              | 6–15   | Light                       | N                                           | Unclear                                   | Free (unverified)            | Active                        | [finder](https://www.finder.com/uk/banking/childrens-banking/monzo-under-16s-vs-starling-under-16s)                                  |
| Till                         | US           | Debit card                       | Any    | Light                       | Partial (Give Link is gifting, not charity) | Parent-paid monthly                       | $7.99/mo                     | Active                        | [tillfinancial.com](https://www.tillfinancial.com/faq)                                                                               |
| Copper                       | US           | Rewards/education only           | Teens  | Light                       | N                                           | N                                         | Free                         | Banking dropped May 2024      | [geekwire](https://www.geekwire.com/2024/fintech-startup-copper-forced-to-discontinue-banking-services-amid-synapse-fiasco/)         |
| Modak                        | US           | Debit card                       | <18    | Medium (daily quizzes)      | Unclear                                     | N                                         | Free; paid tier              | Active                        | [collegeinvestor](https://thecollegeinvestor.com/80994/modak-review/)                                                                |
| Mydoh (RBC)                  | Canada       | Smart Cash card                  | ~6–17  | Medium (Learn hub)          | Partial (donate goal)                       | N                                         | Free                         | Active                        | [mydoh.ca](https://www.mydoh.ca/faq/savings-goals/)                                                                                  |
| Spriggy                      | Australia    | Prepaid card + investing         | 6–17   | Light                       | Unclear                                     | Unclear                                   | A$5–9/mo                     | Active                        | [spriggy.com.au](https://www.spriggy.com.au/plans/)                                                                                  |
| Goalsetter                   | US           | Was card + quizzes               | Kids   | Structured                  | N                                           | 0.25% cashback                            | Was free                     | Consumer app closed Feb 2026  | [goalsetter.co](https://goalsetter.co/faq/)                                                                                          |
| Bankaroo                     | Global       | Virtual ledger                   | ~5–14  | Light (badges)              | Y (charity account)                         | Virtual                                   | Free; Plus $4.99 once        | Live, looks dormant           | [bankaroo.com](https://bankaroo.com/)                                                                                                |
| iAllowance                   | Global (iOS) | Virtual ledger                   | Any    | None                        | Y (spend/save/charity auto-split)           | Y                                         | Paid app                     | Old but listed                | [App Store](https://apps.apple.com/us/app/iallowance-chores-allowances/id398299456)                                                  |
| Homey                        | US           | Virtual ledger / IOU             | Any    | None                        | Y (jars, % split)                           | N                                         | Free; $29.99–49.99/yr        | Active                        | [homeyapp.net](https://www.homeyapp.net/)                                                                                            |
| S'moresUp                    | US           | Points ledger                    | Any    | None                        | N                                           | N                                         | Freemium                     | Active                        | [smoresup.com](https://www.smoresup.com/pricing)                                                                                     |
| Joon                         | US           | Game coins, not money            | ~6–12  | None                        | N                                           | N                                         | $12.99/mo                    | Active                        | [joonapp.io](https://www.joonapp.io/)                                                                                                |
| Moonjar                      | US           | Physical 3-jar box + app         | 3+     | Light                       | Y (Save/Spend/Share)                        | N                                         | ~$20–30 once (unverified)    | Active                        | [moonjar.com](https://moonjar.com/index.php/products/classic-moonjar-moneybox/)                                                      |
| Penny Time                   | US           | Virtual ledger + tools           | 8–14   | Medium                      | Y (suggests 50/30/20)                       | N                                         | Free                         | Active (new)                  | [pennytime.app](https://www.pennytime.app/)                                                                                          |
| KidBank.io                   | US           | Virtual ledger                   | Any    | Light (growth simulator)    | N                                           | Y (monthly growth chart)                  | Unclear                      | Active                        | [kidbank.io](https://kidbank.io/)                                                                                                    |
| PiggyBot                     | US (iOS)     | Virtual IOU ledger               | Kids   | None                        | Y (save/share/spend)                        | N                                         | Free                         | Likely abandoned              | [commonsensemedia](https://www.commonsensemedia.org/app-reviews/piggybot)                                                            |
| Zogo                         | US           | Education only                   | Teens+ | Structured (1,200+ modules) | N                                           | N                                         | Free (bank-funded)           | Active                        | [zogo.com](https://zogo.com/)                                                                                                        |
| Visa Financial Football      | Global       | Education game                   | 11–18+ | Structured                  | N                                           | N                                         | Free                         | Active                        | [practicalmoneyskills.com](https://www.practicalmoneyskills.com/en/play/financial_football.html)                                     |
| MoneyPrep                    | Global       | Education games                  | 5–12   | Structured                  | N                                           | N                                         | Freemium                     | Active                        | [App Store](https://apps.apple.com/us/app/moneyprep-kids-learning-games/id1575939249)                                                |
| MoneyTime                    | US/UK/AU     | Online course + simulation       | 10–15  | Structured (30 lessons)     | N                                           | N                                         | ~$7/mo                       | Active                        | [moneytimekids.com](https://www.moneytimekids.com/)                                                                                  |

## Unverified

- bit's exact minimum age; PayBox Young's digital-only age.
- Whether leumi.me is live; whether kids.gov.il "Where's the money?" is maintained.
- Starling pricing and interest; Osper and Spriggy giving or interest; Revolut pricing; Acorns Early donations; KidBank pricing.
- Whether Bankaroo and PiggyBot are still maintained; KashCash's scale.
