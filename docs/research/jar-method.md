# The Jar Method — Research Dossier

> Reference doc for fun-saver. Written so we never have to research this again.
> Every claim here carries a source. Where the evidence is weak or contested,
> it says so explicitly — do not turn a hedged claim into a confident one when
> writing product copy.
>
> Companion files:
> - `docs/the-method.md` — how the method maps onto the code.
> - `docs/copy/method-page.he.md` — the Hebrew page copy (shipping).
> - `docs/copy/method-page.en.md` — the English copy (parked until i18n lands).
> - `docs/backlog.md` — what we decided to build later.
>
> Last researched: 2026-09-14.

---

## 0. TL;DR

1. "The Jar Method" is **folk practice, not a named theory**. It has no single
   founder and no canonical percentages. Don't cite it as if it were a school
   of thought.
2. The thing underneath it that *does* have peer-reviewed support is
   **mental accounting** (Thaler) and specifically **earmarking + partitioning**
   (Soman & Cheema 2011): the same money, split into two labelled containers,
   produced **72% more saving** than one container.
3. The marshmallow test is **badly over-claimed**. The 2018 replication cut the
   effect roughly in half, and by two-thirds once you control for family
   background. Do not build copy on "kids who wait become successful adults".
4. The finding that actually matters for us is **Kidd, Palmeri & Aslin (2013)**:
   a child's willingness to wait depends on whether adults have kept their
   promises. **Paying the allowance reliably is the intervention.** The app's
   job is to make the parent reliable.
5. Allowance on its own does nothing — and in one large dataset, **unconditional
   allowance correlated with the *lowest* financial literacy scores** (Mandell).
   The structure and the conversation are the product, not the money.

---

## 1. What the method actually is

There is no single "Jar Method." There are two documented commercial lineages
and a large body of folk practice that banks and credit unions repackage.

### 1.1 Money Savvy Pig — 4 chambers

Susan Beacham, a banker turned financial educator, founded Money Savvy
Generation and created the **Money Savvy Pig**: a piggy bank with four separate
chambers — **Save, Spend, Donate, Invest**. It won a Parents' Choice Gold Award
(2002) and a NAPPA Gold Award (2008).

- https://www.moneysavvy.com/main/about.html
- https://en.wikipedia.org/wiki/Susan_Beacham

Note the fourth chamber: **Invest**, kept distinct from Save. fun-saver folds
"invest" into the savings wallet via interest instead of separating it.

### 1.2 The 6 JARS — adults

T. Harv Eker teaches a six-account system in *Secrets of the Millionaire Mind*:
Necessities 55% / Long-Term Savings for Spending 10% / Play 10% / Financial
Freedom Account 10% / Education 10% / Give 5%.

- https://www.harveker.com/blog/6-step-money-managing-system/
- Kids' variant: https://www.harveker.com/blog/6-jars-money-management-system-for-kids/

Eker's own framing is the useful part: *"The habit of managing your money is
much, much more important than the amount."*

### 1.3 The 3-jar child version — Spend / Save / Share

This is what fun-saver implements. It is taught by the **US Mint**, by
credit unions, and by most parenting literature. It has **no single author**.

- https://kids.usmint.gov/resources/coin-activities/spend-save-share

### 1.4 There is no correct split

Published splits, all presented as "the" method:

| Split (Spend/Save/Give) | Source |
| --- | --- |
| 50 / 40 / 10 | **fun-saver's current default** — `src/lib/constants.ts` |
| 70 / 20 / 10 | https://www.kidsmoney.org/parents/money-management/three-jar-method/ |
| 50 / 25 / 25 | https://www.goamplify.com/blog/moneymanagement/three-jar-method/ |
| 60 / 20 / 20 | https://www.treasurecard.com/blog/how-to-set-up-jar-system-allowance |
| 80 / 10 / 10 | https://banzai.org/wellness/resources/three-jar-allowance-for-kids |
| 33 / 33 / 33 | common "equal thirds" folk version |

**Product implication:** never claim 50/40/10 is "the right split". Claim it is
*a sane default*, and let presets be configurable (see `docs/backlog.md`).

---

## 2. The mechanism that has real evidence: mental accounting

This section is the intellectual backbone of the product. If you only read one
section, read this one.

### 2.1 Mental accounting (Thaler)

Richard Thaler — *Mental Accounting and Consumer Choice* (Marketing Science,
1985) and *Mental Accounting Matters* (Journal of Behavioral Decision Making,
1999). People organise money into cognitive "accounts" and treat it as
**non-fungible** depending on its label, origin, and intended use. A shekel in
the "savings" account is not a perfect substitute for a shekel in the
"spending" account, even though economically it must be.

- Paper (PDF): https://people.bath.ac.uk/mnsrf/Teaching%202011/Thaler-99.pdf
- Wiley: https://onlinelibrary.wiley.com/doi/abs/10.1002/(SICI)1099-0771(199909)12:3%3C183::AID-BDM318%3E3.0.CO;2-F
- Primer: https://www.behavioraleconomics.com/resources/mini-encyclopedia-of-be/mental-accounting/

Classical economics calls this a *violation of fungibility* — i.e. a bias.
The jar method's entire trick is to **deliberately induce that bias in a
direction you want.**

### 2.2 Earmarking + partitioning (Soman & Cheema 2011) — the key study

Dilip Soman & Amar Cheema, *"Earmarking and Partitioning: Increasing Saving by
Low-Income Households"*, **Journal of Marketing Research, 48 (Special Issue),
S14–S22, 2011**.

Field experiment with **146 day labourers in Indian slums**. Savings were
earmarked (labelled for children's education) and then either pooled in **one**
envelope or split across **two** envelopes.

| Condition | Mean saved |
| --- | --- |
| One envelope | 241 rupees |
| **Two envelopes** | **414 rupees (+72%)** |

Same money. Same label. Same people. **The partition alone produced the
effect.** The authors attribute it to the psychological cost of "breaking open"
a sealed, labelled container.

- JMR: https://journals.sagepub.com/doi/10.1509/jmkr.48.SPL.S14
- PDF: https://www-2.rotman.utoronto.ca/facbios/file/earmarking-jmrPP.pdf
- Working paper: http://www-2.rotman.utoronto.ca/dilip%20soman/EarmarkingSavingsMS.pdf
- Summary: https://besci.org/papers/cheema-soman-2011

**Three direct product consequences:**

1. **Three wallets beat one balance.** This is the empirical justification for
   the whole app, and it is stronger than anything in the parenting literature.
2. **No transfers between wallets.** The partition only works if it is sealed.
   fun-saver enforces this by *omission* — `TransactionType` has no `transfer`
   member (`src/lib/types.ts`). That absence is a feature; document it so
   nobody "helpfully" adds transfers later.
3. **Visible labels and a visual reminder of the goal** were part of the
   intervention. Our donut + wallet cards + (future) savings goal are doing the
   same work.

### 2.3 Commitment devices (Laibson 1997)

David Laibson, *"Golden Eggs and Hyperbolic Discounting"*, Quarterly Journal of
Economics 112(2), 443–478. People discount the near future far more steeply
than the far future (**present bias**), which makes their preferences
*dynamically inconsistent* — today's plan to save gets overridden by tomorrow's
self. The rational response is to **pre-commit**: put the money somewhere your
future self cannot casually reach.

- PDF: https://scholar.harvard.edu/files/laibson/files/golden_eggs_and_hyperbolic_discounting.pdf
- QJE: https://academic.oup.com/qje/article-abstract/112/2/443/1870925

The savings wallet with a goal-lock **is** a golden egg. That is the theory
behind the backlog item, and it's worth saying so in the copy: the lock isn't
distrust, it's the point.

---

## 3. Delayed gratification — what is true and what is myth

### 3.1 The original claim

Shoda, Mischel & Peake (1990) followed up preschoolers from Mischel's Stanford
delay-of-gratification studies (the "marshmallow test", first run 1972) and
reported strong correlations between seconds waited at age ~4 and adolescent
academic and socio-emotional outcomes. This became one of the most repeated
findings in popular psychology.

### 3.2 The replication that deflated it

**Watts, Duncan & Quan (2018)**, *"Revisiting the Marshmallow Test: A Conceptual
Replication Investigating Links Between Early Delay of Gratification and Later
Outcomes"*, **Psychological Science**.

Larger, far more diverse sample (NICHD SECCYD). Findings:

- Among children whose mothers had not completed college, **one extra minute
  waited at age 4 predicted ~0.1 SD** in achievement at age 15.
- That bivariate correlation was **about half the size** reported originally.
- It was **reduced by roughly two-thirds** once controlling for family
  background, early cognitive ability, and home environment.

- Abstract: https://journals.sagepub.com/doi/abs/10.1177/0956797618761661
- APS write-up: https://www.psychologicalscience.org/publications/observer/obsonline/a-new-approach-to-the-marshmallow-test-yields-complex-findings.html
- Commentary: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6335313/
- Direct comparison of the two studies: https://pubmed.ncbi.nlm.nih.gov/31850833/

**Copy rule:** never write "children who can wait succeed in life". Write
"waiting is a skill that can be practised" — which is separately supported.

### 3.3 The finding that should drive our product rules

**Kidd, Palmeri & Aslin (2013)**, *"Rational snacking: Young children's
decision-making on the marshmallow task is moderated by beliefs about
environmental reliability"*, **Cognition 126(1), 109–114**.

Before the marshmallow task, children experienced an adult who either **kept**
or **broke** a promise (better art supplies that did or did not arrive).
Children in the **unreliable** condition ate the marshmallow far sooner.

Waiting is not purely a trait. It is **a rational bet on whether adults keep
their word.**

- ScienceDirect: https://www.sciencedirect.com/science/article/abs/pii/S0010027712001849
- PDF: https://www.strategian.com/fulltext/Kidd2013.pdf
- Archive: https://archive.org/details/kidd-palmeri-aslin-cognition-2013
- Plain-language: https://parentingscience.com/delayed-gratification-and-the-marshmallow-test/

**This is fun-saver's most important parent-facing rule:**

> Pay the allowance on the same day, every week, without being asked — and
> never take money out of the child's wallets as a punishment. If the parent is
> unreliable, the child is *correct* to spend everything immediately, and the
> app cannot fix that.

### 3.4 Delay is teachable

Mischel's later work argues the skill set is teachable. Strategies with support:

- **Hide the temptation** — out of sight is the single most effective move.
- **If–then implementation plans**, rehearsed in advance.
- **Self-distraction** and **"cooling" the reward** — thinking about it
  abstractly ("it's just a picture of a marshmallow") rather than viscerally.

- APA (free PDF, written for kids/parents): https://www.apa.org/pubs/magination/pdf/how-can-i-wait.pdf
- KQED summary: https://www.kqed.org/mindshift/43326/research-based-strategies-to-help-children-develop-self-control
- On wait strategies: https://www.sciencedirect.com/science/article/abs/pii/S0022096522002053
- Psychology Today: https://www.psychologytoday.com/us/blog/the-age-of-overindulgence/201912/strategies-to-teach-children-delayed-gratification

**Product translation:** the savings wallet *is* "hide the temptation"; the
savings goal *is* an if–then plan ("if I don't buy the toy now, then I get the
scooter in eight weeks").

---

## 4. Why a "Give" wallet earns its place

### 4.1 Giving feels good — measurably, and very early

**Aknin, Hamlin & Dunn (2012)**, *"Giving Leads to Happiness in Young
Children"*, **PLoS ONE 7(6): e39211**. Toddlers **under age 2** displayed
*greater* happiness when giving treats away than when receiving treats
themselves — and greatest of all when the giving was **costly** (giving away
their own treat rather than a windfall).

- Open access: https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0039211
- PubMed: https://pubmed.ncbi.nlm.nih.gov/22720078/
- Replication/extension (2025): https://pmc.ncbi.nlm.nih.gov/articles/PMC12994117/

Adult analogue — prosocial spending and happiness, robust across large samples:
- https://journals.sagepub.com/doi/10.1177/09637214221121100
- Replication of the original experiment: https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0272434

**Copy implication:** the Give wallet is not a moral tax bolted onto the
method. The claim "giving makes you feel good" is empirically defensible, and
the effect is *stronger when it costs you something* — which is exactly what a
dedicated wallet funded from the child's own allowance creates.

### 4.2 Hebrew-language cultural anchor: מעשר כספים

The 10% Give share maps directly onto **מעשר כספים** — the Jewish practice of
setting aside a tenth of income for charity. Useful for Hebrew copy because it
makes 10% feel like a known quantity rather than an arbitrary app default.

- Shulchan Aruch, Yoreh De'ah 249:1 sets the tiers: a fifth (חומש) is
  *מצווה מן המובחר*, **a tenth (מעשר) is מידה בינונית**, less than that is
  *עין רעה*.
- Textual hook: דברים י״ד:כ״ב — "עַשֵּׂר תְּעַשֵּׂר אֵת כָּל תְּבוּאַת זַרְעֶךָ"
  (extended from produce to money via Tosafot / Sifrei).
- Status is contested among poskim — most Acharonim treat it as *דרבנן* or a
  *מנהג טוב*, not biblical law.

- https://he.wikipedia.org/wiki/מעשר_כספים
- https://www.tzohar.org.il/?p=1695
- https://asif.co.il/wp-content/uploads/2024/01/18.-238-248.pdf

**Copy rule:** mention it as an optional cultural anchor, phrased so it works
for secular families too ("יש משפחות שקוראות לזה מעשר כספים"). Do not make the
page religious.

---

## 5. Does any of this actually work? The honest answer

This section exists so we don't oversell. Put the hedges in the copy.

### 5.1 Financial education: real but modest

**Kaiser & Menkhoff**, *"Financial education in schools: A meta-analysis of
experimental studies"*, Economics of Education Review (2020). 37 (quasi-)
experimental studies, 18 of them RCTs.

| Outcome | Effect |
| --- | --- |
| Financial **knowledge** | **+0.33 SD** (≈ +0.15 SD restricting to RCTs) |
| Financial **behaviour** | **+0.07 SD** |

- PDF: https://epub.ub.uni-muenchen.de/69210/1/187.pdf
- ScienceDirect: https://www.sciencedirect.com/science/article/abs/pii/S0272775718306940

Knowledge moves a lot more easily than behaviour. Also relevant: financial
education improved **intertemporal decision-making** in children and youth —
more patient, more consistent choices. That is the outcome we care about.

Broader review: Amagir, Groot, Maassen van den Brink & Wilschut (2018),
*"A review of financial-literacy education programmes for children and
adolescents"*: https://journals.sagepub.com/doi/full/10.1177/2047173417719555

Recent experimental evidence: https://www.sciencedirect.com/science/article/pii/S2214804325000679

### 5.2 The counter-evidence we must not hide

**Lewis Mandell**, analysing the **2000 Jump$tart national survey** of US
high-school seniors:

| Childhood allowance | Mean financial-literacy score |
| --- | --- |
| **No allowance** | **52.5% (highest)** |
| Chore-based allowance | 52.1% |
| **Unconditional allowance** | **49.1% (lowest)** |

Mandell reports this pattern as consistent across cultures and time periods in
his review of ~50 years of scholarship.

- http://lewismandell.com/child_allowances_-_beneficial_or_harmful

This is observational, not causal — reverse causation and confounding are wide
open. But it kills the lazy claim that "giving allowance teaches money skills".

**The defensible claim is the narrower one:**

> Money handed over teaches nothing on its own. What teaches is the structure
> around it — the split, the limit, the wait, and the conversation. That is
> what the app provides.

### 5.3 Allowance and adult outcomes: thin and mixed

- Positive association between regular, consistently-scheduled childhood
  allowance and adult money-management/budgeting, and negative association with
  adult financial worry (PSID data):
  https://www.cambridge.org/core/journals/journal-of-financial-literacy-and-wellbeing/article/how-childhood-allowance-affects-financial-literacy-and-monetary-attitudes-a-gender-perspective-study-from-japan/2D2A7D3D2A360134161B1A40A1885054
- Honest summary of how thin the literature is:
  https://hiwavemakers.com/blog/allowance-kids-money-habits-research/

### 5.4 Parent–child money conversations: the strongest lever

Family financial socialisation research (Jorgensen & Savla; Gudmunson &
Danes; LeBaron & Kelley) consistently finds that **parental modelling and
explicit money discussion** predict financial attitudes, knowledge and
behaviour in emerging adulthood — generally more than formal instruction.

- Decade review: https://pmc.ncbi.nlm.nih.gov/articles/PMC7652916/
- Purposive vs unintentional socialisation: https://files.eric.ed.gov/fulltext/EJ1241099.pdf
- Gen-Z, socialisation vs SES: https://www.nature.com/articles/s41599-024-03007-3

**Product implication:** the app's real job is to **manufacture a weekly
conversation**. Allowance day is a scheduled, recurring prompt to talk about
money. Design for that, not for the ledger.

---

## 6. What a ~7-year-old can actually understand

fun-saver's primary user right now is a child turning 7. Design to that.

### 6.1 Cognitive stage

**Berti & Bombi** (1970s–80s) interviewed ~100 children aged 3–8 and mapped
money understanding onto Piagetian stages:

- **Ages 4–5**: know money is used in shops, but often think *one coin buys one
  thing*. No grasp of divisibility or nominal value. Shopping is a ritual.
- **Ages 6–8**: nominal value, change-making, and the buy/sell exchange start
  to consolidate. This is direct-experience driven, still pre-operational.
- **~Age 11+**: profit, investment, and the bank's business model become
  graspable (formal operations).

- Berti, Bombi & De Beni (1986), *Acquiring Economic Notions: Profit*:
  https://journals.sagepub.com/doi/10.1177/016502548600900102
- Kalish, *Cognitive Development and Children's Understanding* (UW–Madison):
  https://web.education.wisc.edu/cwkalish/wp-content/uploads/sites/13/2017/10/FinancialEd.pdf
- Economic socialisation overview: https://eta.bibl.u-szeged.hu/3827/1/3_Economic%20socialization%20(1%20week).pdf
- Children's ideas about banks and interest (5th-graders): https://link.springer.com/article/10.1007/BF03173161

**Translation for a 7-year-old:**

| Concept | Ready at 7? | How to say it |
| --- | --- | --- |
| Money buys things, and then it's gone | ✅ | "כשנגמר — נגמר" |
| Three piles for three purposes | ✅ | show it, don't explain it |
| Waiting to buy something bigger | ✅ with a visible goal | goal picture + progress |
| Money grows if you leave it | ⚠️ only if visible weekly | "כל יום נוספים מטבעות" |
| Percentages (50/40/10) | ❌ | say "חצי / כמעט חצי / קצת" or use the donut |
| Interest as a rate, compounding | ❌ | do **not** explain the mechanism |
| Why a bank pays interest | ❌ (≈ age 11+) | skip entirely |

**Copy rule:** the child-facing surfaces must be **pictures and counts**, not
percentages. Percentages belong on the parent page.

### 6.2 The age-7 claim, stated correctly

**Whitebread & Bingham (2013)**, *"Habit Formation and Learning in Young
Children"*, report for the UK **Money Advice Service**, University of Cambridge.

What it says: the **cognitive and metacognitive foundations** of later
financial behaviour — self-control, working memory, ability to apply rules,
planning ahead, emotional regulation — are **largely in place by around age 7**.

What it does **not** say: "your money habits are fixed at 7." That is the
popular distortion. See the debunk:
https://kidwealth.com/money-habits-set-age-7/

- Coverage: https://www.yourmoney.com/investing/adult-money-habits-are-set-by-the-age-of-seven/
- https://sueatkinsparentingcoach.com/2013/07/your-childsmoney-habits-are-formed-by-the-age-of-7/

**Copy rule:** write "היסודות נבנים בגיל הזה", never "ההרגלים כבר נקבעו".

### 6.3 CFPB milestones, ages 6–12

The US Consumer Financial Protection Bureau's *Money as You Grow* is the best
free, research-grounded, age-banded parent resource in existence. Its model has
three building blocks — **executive function**, **financial habits and norms**,
**financial decision-making skills** — with *habits and norms* emerging
specifically in **middle childhood (6–12)**, which is exactly our window.

Six topics they recommend covering at 6–12: **Earning, Saving, Planning,
Shopping, Borrowing, Protecting**.

- Hub: https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/
- 6–12: https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/school-age-children-preteens/
- Milestones: https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/school-age-children-preteens/money-milestones/
- Building Blocks report (2016, PDF): https://files.consumerfinance.gov/f/documents/092016_cfpb_BuildingBlocksReport_ModelAndRecommendations_web.pdf
- Brief: https://files.consumerfinance.gov/f/documents/092016_cfpb_BuildingBlocksReportBrief_web.pdf
- Educator hub: https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/

### 6.4 OECD / EU competence frameworks

- OECD/INFE + EU **Financial competence framework for children and youth**:
  https://www.oecd.org/en/publications/financial-competence-framework-for-children-and-youth-in-the-european-union_bf059471-en.html
- PISA 2022 financial literacy results (15-year-olds, 20 economies):
  https://www.oecd.org/en/publications/pisa-2022-results-volume-iv_5a849c2a-en.html
- PISA framework PDF: https://www.oecd.org/content/dam/oecd/en/publications/reports/2024/06/pisa-2022-results-volume-iv_125a58b3/5a849c2a-en.pdf

Four content areas used throughout: **money and transactions; planning and
managing finances; risk and reward; the financial landscape.** Lowest-performing
15-year-olds can, at best, *distinguish needs from wants and make simple
everyday spending decisions* — i.e. "needs vs wants" is the genuine floor of
financial literacy, and is age-appropriate to start at 6–7.

---

## 7. Setting the rules — the parameters a family must decide

These are the five decisions the method needs, plus one rule that is **not** a
decision (§7.4). The app's setup flow should be those five, in this order.

### 7.1 How much

No jurisdiction sets a number. Israel has **no official amount or formula**.

**Israeli practical ranges** (mako, aggregating common practice):

| גיל | Typical |
| --- | --- |
| 5–7 | ₪5–15 / week |
| 8–10 | ₪10–30 / week |
| 11–13 | ₪60–150 / month |
| 14–16 | ₪150–350 / month |
| 17–18 | ₪250–600 / month |

https://www.mako.co.il/finances-money/Article-b585a099e13af91027.htm

Other Israeli guidance clusters at **₪5–20/week to start at ages 5–6**, rising
to ₪50–100/month at 13–15 and ₪150–300/month at 16–18:
- https://protocol.co.il/pocket-money/
- https://financa.co.il/דמי-כיס-לילדים/
- https://goola-group.com/blog/dme-kis-leyeladim-2026

**US benchmark:** the folk rule is **$1 per year of age per week** (some
sources soften it to $0.50–$1). Actual reported averages: ages 5–8 ≈ $6.66/wk;
9–11 ≈ $8.58/wk; 12–19 ≈ $18.11/wk.
- https://greenlight.com/learning-center/earning/average-allowance-by-age-for-kids
- https://www.pennytime.app/learn/blog/average-allowance-by-age-2026-data-and-guidelines/

**Our family's actual setting (documented for the copy examples):**
**₪30/week at almost-7.** For context, that is:
- roughly **2–3× the Israeli 5–7 guideline** and at the **top of the 8–10
  band**;
- roughly **in line with the US $1/year-of-age rule** (~$7/wk ≈ ₪26).

**Local price check (why ₪15/week of spending money is the right size here):**
a scoop of ice cream at the shop near home is **₪17**; a basic ice cream is
**₪10+**. So the weekly spending wallet buys roughly *one* treat — enough to
make a real choice, not enough to make the choice painless. That is the
correct calibration: the Spending wallet should force a trade-off every week,
and a number that can't buy anything teaches as little as one that buys
everything.

That is a legitimate family choice — the research consistently says
**consistency matters more than the amount** (Eker; the allowance literature;
the Israeli guides all converge on this). But the page should show the local
ranges so a parent picking a number has an anchor rather than a vacuum.

**At 50/40/10, ₪30/week splits into:**

| Wallet | Per week | Per month (≈4.33 wks) | Per year |
| --- | --- | --- | --- |
| 🛍️ Spending 50% | ₪15 | ₪65 | ₪780 |
| 🐷 Savings 40% | ₪12 | ₪52 | ₪624 |
| 💛 Good deeds 10% | ₪3 | ₪13 | ₪156 |

Nice anchor for Hebrew copy: **₪52/month into savings is almost exactly the
₪58/month the state deposits under חיסכון לכל ילד** (see §8.2). "The child is
matching the state."

### 7.2 How often — weekly, for this age

Young children's planning horizon is short. Consensus guidance:

- **Ages ~6–9: weekly.** A week is about as far as a 7-year-old plans. Monthly
  money is spent in week one, leaving three empty weeks and no lesson.
- **Ages ~10–11: bi-weekly** as a bridge.
- **Ages ~12+: monthly**, mirroring how adults are paid.

https://www.pennytime.app/learn/blog/how-much-allowance-by-age/ ·
https://www.withharmonia.com/en/blog/how-much-allowance-by-age

**Product implication:** weekly is the right default, and **a fixed named day**
matters more than the day chosen (see §3.3 — reliability *is* the intervention).

### 7.3 Chores: do not tie them to the allowance

Two independent lines of evidence point the same way.

**a) The overjustification effect.** Lepper, Greene & Nisbett (1973) at
Stanford's Bing Nursery School: preschoolers who already loved drawing were
either *promised* a "Good Player Award", given one as a *surprise*, or given
none. Only the **promised-reward** group showed a significant drop in voluntary
drawing later. Deci's earlier puzzle experiments found the same. Across ~128
experiments, **expected tangible rewards reliably undermine intrinsic
motivation** — though the effect is conditional, not universal.

- https://en.wikipedia.org/wiki/Overjustification_effect
- https://thedecisionlab.com/biases/overjustification-effect
- https://explorable.com/overjustification-effect

Paying a child to help the family converts "I help because I'm part of this
family" into "what's the rate?".

**b) "A Fine is a Price."** Gneezy & Rustichini (2000), Journal of Legal
Studies — **ten day-care centres in Haifa**, 20 weeks. Introducing a fine for
late pickup **increased** lateness, and removing the fine did not reverse it.
Attaching money to a social obligation **crowds out the norm** and replaces it
with a price — permanently.

- PDF: https://rady.ucsd.edu/_files/faculty-research/uri-gneezy/fine.pdf
- https://www.ius.uzh.ch/dam/jcr:ed3f9a0b-ab68-4cf6-a18c-a480b33c9456/Gneezy%20et%20al%20A%20Fine%20is%20a%20Price.pdf
- Robustness/replication discussion: https://www.sciencedirect.com/science/article/abs/pii/S0144818819302741

**c) Local expert position.** Renin Mordi, head of Bank Hapoalim's financial
growth centre: allowance should not be tied to household duties — the child has
obligations as a family member, and paying for them shifts motivation from
helping to reward-seeking.
https://www.ynet.co.il/economy/article/skk6czlcbg

**Caveat for honesty:** Mandell's data (§5.2) found *chore-based* allowance
scored marginally **above** unconditional allowance (52.1% vs 49.1%). So the
evidence is not unanimous.

**Our recommended rule, and the one the page should state:**

> The weekly allowance is **not** payment for chores, and is **never**
> withdrawn as punishment. Regular family chores are unpaid. If you want to pay
> for work, pay separately for **extra, optional jobs** that are outside the
> normal family baseline — and call it a job, not allowance.

### 7.4 The rescue rule — decide in advance

The single most common failure: the child blows the Spending wallet on day two
and asks for more. If the parent tops it up, the entire method collapses —
there is no consequence, therefore no lesson, and the partition becomes
decorative.

**This is a rule, not a family preference: the Spending wallet is not refilled
early, and is never refilled from Savings. When it runs out, you wait for next
week.** Presenting it as something to decide invites renegotiating it at the
checkout, which is precisely when it must not be renegotiable. fun-saver enforces the second half structurally: there is no
`transfer` transaction type, so wallets cannot be cross-funded in the app.

The parent's line should be rehearsed in advance, because it has to be said
calmly at a supermarket checkout. Suggested wording is in the copy files.

### 7.5 Loans and advances

Skip them at age 7. Borrowing is on the CFPB's 6–12 list but sits at the top of
it; "you pay back more than you borrowed" needs the interest concept, which
Berti & Bombi put nearer 11. Revisit at ~10.

### 7.6 The savings goal

Set **one** goal, with a **picture** and a **number**, and show progress. See
§10 for the evidence.

---

## 8. Israel-specific context

### 8.1 What Israeli families actually do

- **74% of Israeli parents give pocket money** in order to teach money
  management — Bank Hapoalim 2025 financial report, via ynet:
  https://www.ynet.co.il/economy/article/skk6czlcbg
- **Geocartography survey (published 4 Sep 2022)** — how allowance is delivered:

  | Method | Share |
  | --- | --- |
  | **Cash** | **85%** |
  | Direct deposit to a child credit account | 8% |
  | Transfer via an app | **7%** |
  | Parent's own credit card | 3% |

  By age band (monthly budget allocated per child):

  | Ages 6–11 | Ages 12–15 |
  | --- | --- |
  | 26% allocate ~₪100 | 14% allocate up to ₪100 |
  | 3% allocate ₪100–200 | 6% allocate ₪100–200 |
  | 0.8% allocate ₪200–300 | 3% allocate ₪200–300 |
  | 14% no fixed amount | 2% allocate ₪300–400 |
  | 31% don't budget for it at all | 17% give none |

  https://www.geokg.com/ · summary: https://finance.walla.co.il/item/3527261

  Sample size and methodology are **not published** — treat as indicative, and
  do not quote these as precise national statistics in marketing copy.

**Market read:** 85% cash, 7% app. The gap is the opportunity, and it is also
the risk (§11 — digital money is less tangible).

### 8.2 חיסכון לכל ילד (Savings for Every Child)

National programme run by ביטוח לאומי. The state deposits **₪58/month
(as of 1 Jan 2026)** for every child until age 18. Parents may match it with a
further ₪58 from the child allowance, doubling it to ₪116/month. Funds are
held in a provident fund or bank savings plan and are withdrawable at 18 (with
parental consent).

- https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/HisahonKupot.aspx
- https://www.btl.gov.il/About/faq/SaveMoneyFAQ/Pages/default.aspx
- https://www.kolzchut.org.il/he/תוכנית_"חיסכון_לכל_ילד"
- https://he.wikipedia.org/wiki/חיסכון_לכל_ילד

**Why it matters to us:** every Israeli child already has a long-horizon
savings account they cannot see or touch. fun-saver is the opposite — a
**short-horizon, highly visible** savings account. Worth saying so explicitly
in the copy: the two are complements, not competitors.

### 8.3 Financial education is becoming compulsory

The Ministry of Education is launching a financial-literacy curriculum starting
in **תשפ"ז (2026/27)** in secondary schools — one weekly hour across two years,
covering money/saving/investment and risk, the banking system, and conscious
consumerism. Financial education is already part of the primary-school
"מולדת, חברה ואזרחות" curriculum.

- Ministry portal: https://pop.education.gov.il/financial-education/
- Primary school: https://pop.education.gov.il/tchumey_daat/moledet_hevra_ezrahut/yesodi/noseem_nilmadim/hinuch_pinansi/
- Secondary: https://pop.education.gov.il/financial-education/financial-education-middle-high-school/
- Coverage: https://www.mako.co.il/news-education/2026_q1/Article-fc056f5311a8c91026.htm
- Ben-Gurion Univ. policy paper (PDF): https://www.pif.bgu.ac.il/wp-content/uploads/2020/11/חינוך-פיננסי-במערכת-החינוך.pdf
- Paamonim (NGO, school programmes): https://www.paamonim.org/he/financial_education/

**Positioning:** the state starts formal financial education in high school.
fun-saver operates in the years **before** that — 6 to 12 — which the CFPB
identifies as exactly when habits and norms form (§6.3).

---

## 9. Interest and compounding in fun-saver

### 9.1 What the code does today

`src/lib/constants.ts`:
- `SAVINGS_MONTHLY_RATE = 0.15` — **15% per month**, savings wallet only.
- Accrues **daily**, idempotent per day (`src/lib/interest/`), booked as
  `interest` transactions.

### 9.2 Is 15%/month defensible?

**No, as a model of the world. Yes, as a teaching device — if labelled.**

- 15%/month ≈ **435% per year**. No real instrument pays this.
- By the **rule of 72** (72 ÷ rate ≈ periods to double), 72 ÷ 15 ≈ **~5 months
  to double**. At a realistic 4%/year it would be **~18 years** — completely
  invisible to a 7-year-old, and therefore pedagogically useless.
- Rule of 72 references:
  https://www.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial/compound-interest-tutorial/v/the-rule-of-72-for-compound-interest ·
  https://www.investor.gov/additional-resources/information/youth/teachers-classroom-resources/what-compound-interest ·
  Federal Reserve lesson plan (PDF): https://www.federalreserveeducation.org/resources/lessons/lesson--6b-simple-and-compound-interest.pdf

**Scale of the distortion at our settings** (₪12/week ≈ ₪52/month into savings):

| | Deposited in year 1 | Balance after 1 year @15%/mo |
| --- | --- | --- |
| Savings wallet | ₪624 | **≈ ₪1,500** |

Interest would be **~2.4× the child's own deposits** — i.e. the app would teach
that saving is mostly magic, and the child's own restraint is the minor term.
That is the wrong lesson.

**Options, with the trade-off stated:**

| Rate | Doubling time | Visible to a 7-y-o? | Distortion |
| --- | --- | --- | --- |
| 0.3%/mo (≈4%/yr, realistic) | ~18 yrs | ❌ invisible | none |
| 2%/mo | ~36 mo | ❌ too slow | low |
| **5%/mo** | **~14 mo** | ⚠️ borderline | moderate |
| 15%/mo (**current**) | ~5 mo | ✅ very | high |

**Recommendation:** keep a high, visible rate — a 7-year-old cannot learn
compounding from an invisible one — but (a) make it **configurable per
account** so it can be dialled down as the child ages, and (b) **name it
honestly in the UI** as the family bank's rate ("הריבית של בנק המשפחה"),
never as what a real bank pays. Logged in `docs/backlog.md`.

### 9.3 What not to explain at 7

Do not explain the *mechanism* of compounding or why banks pay interest — both
sit around age 11 on the Berti & Bombi progression (§6.1). At 7 the correct
framing is purely observational: **"every day, a few more coins appear —
because you left the money there."**

---

## 10. Savings goals — the evidence for the backlog feature

### 10.1 Show progress, and start it above zero

**Nunes & Drèze (2006)**, *"The Endowed Progress Effect: How Artificial
Advancement Increases Effort"*, **Journal of Consumer Research 32(4),
504–512**. Car-wash loyalty cards: an 8-stamp card starting empty vs a
**10-stamp card with 2 stamps pre-filled**. Identical work required (8
purchases). Completion: **19% vs 34%** — nearly double.

- SSRN: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=991962
- Summary: https://www.coglode.com/nuggets/endowed-progress-effect

It also triggers the **goal-gradient effect** — effort rises as the goal nears.

**Product implications for the savings-goal feature:**
- Always render progress as a **bar/ring toward a target**, never a bare
  balance.
- Consider seeding the goal with whatever is already in the savings wallet so
  the bar is **never at zero on day one**.
- Expect and design for the final stretch — the closer the child gets, the
  more the visual should reward them.

### 10.2 One goal, pictured, named

Goal-setting theory (Locke & Latham): specific, challenging, proximal goals
outperform "do your best". For a 7-year-old that means **one** goal at a time,
with a **photo/icon**, a **name**, and a **number** — which is exactly the
`goalAmount` / `goalDescription` / `goalIcon` shape already specified in
`docs/backlog.md`.

### 10.3 The goal-lock is the commitment device

Per Laibson (§2.3), the rule "you can only withdraw from Savings once the goal
is reached" is not a restriction bolted on — it **is** the mechanism. Frame it
to the child as a promise they made to themselves, not a rule the parent
imposed.

---

## 11. The risk this app creates: digital money is less tangible

We are replacing cash — which 85% of Israeli families still use (§8.1) — with
numbers on a screen. That has a documented cost.

**Prelec & Simester (2001)**, *"Always Leave Home Without It: A Further
Investigation of the Credit-Card Effect on Willingness to Pay"*, **Marketing
Letters 12(1), 5–12**. Real auctions for Boston Celtics tickets. Bidders told
they would pay **by card bid roughly twice as much** as those told they would
pay cash — an effect up to **100%**, not explained by liquidity.

- https://link.springer.com/article/10.1023/A:1008196717017
- https://www.semanticscholar.org/paper/2b08823c4dd081167538dd187770e555aba421b0

This is the **"pain of paying"**: removing the physical handover of money
removes the friction that restrains spending.

Practitioner concern, specifically about children: a UK survey commissioned by
Prudential found **78% of teachers and 37% of parents** believed cashless
payments harm children's understanding of money.
https://phys.org/news/2018-11-pocket-money-apps-aim-kids.html

**Mitigations we should design for (and partly already have):**

| Risk | Mitigation |
| --- | --- |
| Number on a screen feels unreal | Draw **coins**, not digits — already done |
| Spending feels frictionless | Withdrawal is a deliberate, named action with a wallet choice |
| Can't feel the balance drop | Overdraft protection + visibly shrinking wallet |
| No physical handover | **Recommend the parent still hands over cash for the Spending wallet at this age**, and use the app as the ledger |

That last row belongs in the parent copy. It is a genuine limitation of the
product and saying it out loud is more credible than pretending otherwise.

- https://www.fidelity.com/learning-center/personal-finance/kids-and-money
- https://www.mother.ly/career-money/family-finances-budgeting/how-to-teach-digital-money-skills/

---

## 12. Jargon glossary — Hebrew / English

Terms that appear in the literature, with the wording we use in product copy.
**Column 4 is what a 7-year-old is told.** Never use column 1 with a child.

| Term (EN) | מונח (HE) | What it means | Say to the child (HE) |
| --- | --- | --- | --- |
| Financial literacy | אוריינות פיננסית | Knowledge + skills + attitudes to make good money decisions (OECD) | — (parent-only term) |
| Financial socialisation | חִבְרוּת פיננסי | How kids absorb money attitudes from parents, peers, media | — |
| Mental accounting | חשבונאות מנטלית | Treating money differently based on its label | "לכל קופה יש תפקיד" |
| Earmarking | ייעוד כספים | Labelling money for a specific purpose | "הכסף הזה שמור ל…" |
| Partitioning | חלוקה לקופות | Physically splitting money into separate containers | "שלוש קופות" |
| Fungibility | ברות-המרה / אחידות הכסף | A shekel is a shekel — the thing jars deliberately break | — |
| Delayed gratification | דחיית סיפוקים | Giving up a small reward now for a bigger one later | "לחכות בשביל משהו גדול" |
| Present bias | הטיית ההווה | Over-weighting right-now versus later | "עכשיו תמיד מרגיש חזק יותר" |
| Hyperbolic discounting | היוון היפרבולי | The mathematical form of present bias | — |
| Commitment device | מנגנון מחויבות | Locking your future self out on purpose | "הבטחה לעצמך" |
| Opportunity cost | עלות אלטרנטיבית | What you gave up to buy this | "אם קנית את זה — ויתרת על זה" |
| Needs vs wants | צרכים מול רצונות | Must-have vs nice-to-have | "צריך או מתחשק?" |
| Budget | תקציב | A plan for money before you spend it | "כמה יש לי השבוע" |
| Principal | קרן | The money you put in yourself | "הכסף שלך" |
| Interest | ריבית | Money paid for leaving money where it is | "מטבעות שנוספים לבד" |
| Compound interest | ריבית דריבית | Interest that itself earns interest | "גם המטבעות החדשים מביאים מטבעות" |
| Rule of 72 | כלל ה-72 | 72 ÷ rate ≈ periods to double | — |
| Savings goal | יעד חיסכון | A named, priced thing you're saving toward | "מה אנחנו אוספים בשבילו" |
| Goal-gradient effect | אפקט מדרון המטרה | You try harder the closer you get | — |
| Endowed progress | התקדמות מוענקת | A head start makes people finish | — |
| Overjustification effect | אפקט ההצדקה היתרה | Paying for something enjoyable kills the enjoyment | — |
| Pain of paying | כאב התשלום | The friction of handing money over | — |
| Charity / giving | צדקה / נתינה | The Give wallet's purpose | "מעשים טובים" |
| Tithe (10%) | מעשר כספים | Traditional 10%-to-charity practice | "עשירית" |
| Overdraft | משיכת יתר / מינוס | Spending money you don't have — blocked here | "אי אפשר להוציא מה שאין" |
| Allowance | דמי כיס | Regular, scheduled money for a child | "דמי כיס" |

**Wallet names as used in code / UI / English copy:**

| Code | UI (HE) | English copy |
| --- | --- | --- |
| `spending` | 🛍️ הוצאות | Spending |
| `savings` | 🐷 חיסכון | Savings |
| `goodDeeds` | 💛 מעשים טובים | Good deeds (a.k.a. Give / Share) |

---

## 13. Gaps and open questions

Things we looked for and could **not** establish. Do not fill these with
confident copy.

1. **No RCT of the three-jar method itself.** The partitioning evidence
   (§2.2) is with adults, in India, over weeks. Nobody has randomised children
   into jars-vs-one-pot and measured outcomes. Our claim must be "the mechanism
   underneath it is evidenced", not "the method is proven".
2. **No evidence for any specific split.** 50/40/10 vs 70/20/10 has never been
   tested. Purely a values choice.
3. **Optimal allowance amount is unknown** and almost certainly unknowable —
   it's family-income-relative. Every source says consistency > amount.
4. **Whether a digital wallet teaches as well as physical jars is untested.**
   The pain-of-paying literature (§11) suggests a real risk. This is the biggest
   open question for the product.
5. **Israeli survey data is thin.** The Geocartography figures (§8.1) have no
   published sample size or methodology; the Bank Hapoalim 74% figure is quoted
   secondhand via ynet, not from a primary report we could retrieve.
6. **Whitebread & Bingham (2013)** — we could not retrieve the primary PDF from
   the (now-defunct) UK Money Advice Service; all citations here are secondary.
   Re-source before quoting it verbatim in public marketing.
7. **Mandell's allowance finding (§5.2)** is observational and from 2000. It
   should be presented as a caution, never as causal evidence that allowance
   harms children.
8. **Long-run effects of any of this are unmeasured.** Financial education
   shifts behaviour by ~0.07 SD (§5.1). That is real but small. Keep promises
   proportionate.

---

## 14. Full source index

### Peer-reviewed / primary
- Thaler, *Mental Accounting Matters*, JBDM 12(3), 1999 — https://people.bath.ac.uk/mnsrf/Teaching%202011/Thaler-99.pdf
- Soman & Cheema, *Earmarking and Partitioning*, JMR 48, 2011 — https://journals.sagepub.com/doi/10.1509/jmkr.48.SPL.S14
- Laibson, *Golden Eggs and Hyperbolic Discounting*, QJE 112(2), 1997 — https://scholar.harvard.edu/files/laibson/files/golden_eggs_and_hyperbolic_discounting.pdf
- Watts, Duncan & Quan, *Revisiting the Marshmallow Test*, Psych Science, 2018 — https://journals.sagepub.com/doi/abs/10.1177/0956797618761661
- Kidd, Palmeri & Aslin, *Rational Snacking*, Cognition 126(1), 2013 — https://www.strategian.com/fulltext/Kidd2013.pdf
- Aknin, Hamlin & Dunn, *Giving Leads to Happiness in Young Children*, PLoS ONE 7(6), 2012 — https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0039211
- Nunes & Drèze, *The Endowed Progress Effect*, JCR 32(4), 2006 — https://papers.ssrn.com/sol3/papers.cfm?abstract_id=991962
- Prelec & Simester, *Always Leave Home Without It*, Marketing Letters 12(1), 2001 — https://link.springer.com/article/10.1023/A:1008196717017
- Gneezy & Rustichini, *A Fine is a Price*, J. Legal Studies 29(1), 2000 — https://rady.ucsd.edu/_files/faculty-research/uri-gneezy/fine.pdf
- Kaiser & Menkhoff, *Financial education in schools: a meta-analysis*, EER, 2020 — https://epub.ub.uni-muenchen.de/69210/1/187.pdf
- Amagir et al., *Review of financial-literacy education programmes*, 2018 — https://journals.sagepub.com/doi/full/10.1177/2047173417719555
- Berti, Bombi & De Beni, *Acquiring Economic Notions: Profit*, 1986 — https://journals.sagepub.com/doi/10.1177/016502548600900102
- *Financial Socialization: A Decade in Review*, 2020 — https://pmc.ncbi.nlm.nih.gov/articles/PMC7652916/
- Lepper, Greene & Nisbett (1973) / overjustification — https://en.wikipedia.org/wiki/Overjustification_effect

### Institutional
- CFPB *Money as You Grow* — https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/
- CFPB *Building Blocks* report (2016) — https://files.consumerfinance.gov/f/documents/092016_cfpb_BuildingBlocksReport_ModelAndRecommendations_web.pdf
- OECD/EU financial competence framework for children and youth — https://www.oecd.org/en/publications/financial-competence-framework-for-children-and-youth-in-the-european-union_bf059471-en.html
- OECD PISA 2022 financial literacy (Vol. IV) — https://www.oecd.org/en/publications/pisa-2022-results-volume-iv_5a849c2a-en.html
- APA, *How Can I Wait?* (self-control for kids, PDF) — https://www.apa.org/pubs/magination/pdf/how-can-i-wait.pdf
- Federal Reserve Education, simple & compound interest lesson — https://www.federalreserveeducation.org/resources/lessons/lesson--6b-simple-and-compound-interest.pdf
- US Mint, *Spend, Save or Share* — https://kids.usmint.gov/resources/coin-activities/spend-save-share

### Israel
- ביטוח לאומי — חיסכון לכל ילד — https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/HisahonKupot.aspx
- כל-זכות — תוכנית חיסכון לכל ילד — https://www.kolzchut.org.il/he/תוכנית_"חיסכון_לכל_ילד"
- משרד החינוך — חינוך פיננסי — https://pop.education.gov.il/financial-education/
- ynet — דמי כיס: פרס על מטלות או כלי חינוכי? (Bank Hapoalim 2025 data) — https://www.ynet.co.il/economy/article/skk6czlcbg
- גיאוקרטוגרפיה — סקר דמי כיס (2022) — https://www.geokg.com/
- mako — כמה דמי כיס מקובל לתת, מדריך לפי גיל — https://www.mako.co.il/finances-money/Article-b585a099e13af91027.htm
- פעמונים — חינוך פיננסי בבתי ספר — https://www.paamonim.org/he/financial_education/
- ויקיפדיה — מעשר כספים — https://he.wikipedia.org/wiki/מעשר_כספים
- צהר — קיצור הלכות צדקה — https://www.tzohar.org.il/?p=1695

### Method / practitioner
- Money Savvy Generation (Susan Beacham) — https://www.moneysavvy.com/main/about.html
- T. Harv Eker, 6 JARS — https://www.harveker.com/blog/6-step-money-managing-system/
- Kids' Money, 3-jar method — https://www.kidsmoney.org/parents/money-management/three-jar-method/
- Greenlight, average allowance by age — https://greenlight.com/learning-center/earning/average-allowance-by-age-for-kids
- Mandell, *Child Allowances — Beneficial or Harmful?* — http://lewismandell.com/child_allowances_-_beneficial_or_harmful
- Debunk: "money habits set by age 7" — https://kidwealth.com/money-habits-set-age-7/
