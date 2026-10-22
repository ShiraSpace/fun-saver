# Child Mode Engagement — Research Dossier

> What makes a child want to open child mode again, and which animations and
> game mechanics help without turning into dark patterns. It builds on the
> child view from PR #171.
>
> Companion files:
> - `mockups/2026-10-04-child-piggy-bank.html` — the agreed piggy-bank design (`#piggy-bank`), the four exploration directions (`#child-engagement`) and the five piggy styles (`#piggy-styles`).
> - `docs/research/jar-method.md` — the jar method, mental accounting, endowed progress, Kidd et al.
> - `docs/superpowers/specs/2026-10-03-saving-goal-design.md` (on `docs/saving-goal-design`) — the saving goal that direction C builds on.
>
> Sources marked *secondary* are summaries, not the original papers. Cite the
> original before turning any of them into product copy.
>
> Last researched: 2026-10-04.

---

## 0. TL;DR

- **Money habits start forming around age 7, and parents are the biggest influence on them** [1][2]. Child mode works best as a shared ritual between parent and child, not as a solo engagement loop.
- **Children keep doing something when they feel in control and capable.** Self-Determination Theory (SDT) names three needs: autonomy, competence and relatedness [10]. Expected, tangible rewards undermine that motivation, more so in children [11]. The reward should be the child's own growing money, made visible. Never give badges or points for opening the app.
- **Children wait longer for a reward when they trust it will arrive** [8]. The most powerful thing fun-saver already has is daily interest that is predictable and always paid. The design's job is to make that reliability visible.
- **Daily interest is tiny, abstract and exponential.** Young children perceive numbers on a log-like scale [5], and even adults see exponential growth as a straight line [15]. So the interest has to be magnified, turned into objects, and projected over time spans the child can picture [4].
- **Avoid:**
  - streaks that a missed day breaks
  - guilt notifications
  - characters that look sad when the child is away
  - random rewards

  All four are documented dark patterns in children's apps [18][20][21], and they conflict with the UK Children's Code [19].

## 1. Developmental stages

| Age | Money and numbers | Time | Reading and attention | Design implication |
|---|---|---|---|---|
| **5–7** | Recognise coins and notes, and know that money is exchanged for things. By about 7 they can count money, understand earning, plan ahead and delay a choice [2]. Number sense is still log-like: small numbers look far apart and large numbers bunch together [5]. | Can tell "weeks or months away" from "many months away", but mix up the near future with the recent past [4]. | Beginning readers. NN/g groups 6–8 as beginning readers; children under 6 don't read [3]. Need larger type, about 14pt [3]. | Pictures and countable objects (coins, fruit, leaves), not decimals. "Tomorrow, next week, your birthday", not dates. Icons or voice alongside text. |
| **8–10** | Norms about money are forming but unstable and contradictory until about 9 [6]. Ages 6–12 are when financial habits and norms form [1]. Number-line estimation becomes linear for 0–100 by about grade 2, and for 0–1000 over grades 2–6 [5]. | Place events accurately within the year from 8–10 [4]. "In 3 months" means something. | Tentative to fluent readers. Still enjoy animation and sound [3]. | Real shekel amounts with a visual. Projections to the next holiday or birthday. |
| **11–12** | More coherent, abstract economic concepts from about 10–13 [6]. Fourth graders can be taught deposits, loans and interest, and still understand them 8 months later [6]. | Reason about a year or more. | Scan text like adults [3]. Reject anything that looks "babyish" [3]. | Real rates and real charts. A "grown-up" view. |

**One design will not suit every age.** NN/g found that children reject designs aimed at another age group [3], so a single look for ages 5–12 will be wrong for most of them.

## 2. What draws and holds attention

- **Motion and sound are welcome.** 8-year-olds spent minutes trying to trigger sound and animation [3]. Kids explore and want to be entertained, not to finish a task [3]. A balance that does something when poked suits their age.
- **No ads, and no promotions for features.** Children cannot tell ads apart from content [3].
- **Anticipation.** People speed up as a goal gets closer (the goal-gradient effect) [12]. A visible "almost there" brings a child back without a notification.
- **Make abstract money concrete.** Money put in a labelled envelope with a family photo was saved more [14]. Three jars that look physically different, each with its own picture, use the same mechanism.
- **Make the future vivid.** Adults shown an aged picture of themselves saved more [16]. For a child, the "future self" is a future thing: the bike, the birthday.

## 3. Motivation, and where it turns into a dark pattern

**SDT** [10]:
- *Autonomy*: the child chooses the goal, its picture, the colours and the companion's name.
- *Competence*: the child can predict what happens ("I knew it would grow!").
- *Relatedness*: the child shares it with a parent.

**Overjustification** [11][28]. Children promised a "Good Player Award" for drawing later drew less in free play. A meta-analysis of 128 studies found that rewards which are expected, tangible and given for completing a task undermine intrinsic motivation, and children are hit harder. Unexpected feedback that only tells the child what happened does not undermine it. So celebrations should be informational ("your savings passed ₪100"), never a prize for showing up.

**Goal-gradient** [12]. Effort rises as the goal gets closer. This is safe when the goal is the child's own.

**Endowed progress** [13]. A progress card with 2 of 10 steps already stamped was finished more often than a blank card of 8 steps. This is fine when the head start is real money already saved. It becomes manipulative when the progress is fake.

**Variable rewards** [21]. Random reward schedules are the mechanism behind loot boxes, and loot-box spending correlates with problem gambling. **No randomness in rewards.** Interest is deterministic, and that is the lesson.

**Reliability is what makes a child wait** [7][8]. Children waited about 4× longer, 12 minutes against 3, when the adult had kept a promise earlier [8]. The marshmallow test's predictive power shrank by two-thirds once family background was controlled for [7]. **Daily interest is that reliable environment.** Say so every time: "interest arrived again today, like every day".

**Attention while waiting** [9, secondary]. Children waited longer when the reward was covered. Showing the goal object helps keep the goal wanted. Don't place the spending jar next to it as a temptation.

## 4. Gamification: what works

Gamification has small positive effects on learning [17]:

| Effect | Size | Stability |
|---|---|---|
| Cognitive | g=.49 | stable |
| Motivational | g=.36 | weaker under rigorous designs |
| Behavioural | g=.25 | weaker under rigorous designs |

Expect modest gains, and only from mechanics tied to the real behaviour.

| Mechanic | Verdict | Why |
|---|---|---|
| Goal with a picture and a progress bar | **Strong** | Goal-gradient [12], earmarking with an image [14], future self [16], autonomy [10]. GoHenry and Rooster Money lead with picture goals [26][27]. |
| A creature or plant that grows with the balance | **Good, with care** | Makes the amount concrete. A creature that wilts or looks sad is "parasocial pressure", which Radesky et al. coded as manipulative [18]. It only grows or rests; it never suffers. |
| Milestones and badges | **OK if informational** | Tie them to money facts ("first ₪1 of interest"), never to logins [11]. |
| Levels | **Weak** | Adds abstraction. Use balance thresholds as milestones instead. |
| Streaks | **Avoid the loss-based kind** | They work through loss aversion. Duolingo's streak nag reached a 9-year-old [22, anecdotal]. 5Rights recommends "streak holidays" [20]. Let the money's streak be the hero: "interest arrived 47 days in a row". |
| A rate the parent sets | **Valuable** | Greenlight parents set about 18% on average [25]. A high, visible rate makes growth noticeable; tell kids that real banks pay less. |

## 5. Making interest visible

- **The size problem.** A few agorot a day is invisible to a log-scale number sense [5]. Three ways to deal with it:
  - *Magnify the unit*: a coin drops into the jar however small the interest is.
  - *Add it up*: "this week your money earned you ₪X".
  - *Project it*: "if you leave it until summer…".
- **The fun-saver numbers.** At 15% a month, daily interest is about 0.47%, roughly 69 agorot a day on ₪148. PR #171 shows whole shekels, so on some days the child sees no change at all. A "next coin" meter that fills with agorot toward the next shekel makes every day visible without decimals (mockup A).
- **A daily tick on open.** "Since you last looked: +₪0.43". This is the competence moment: my money worked while I slept. It also repeats the reliability message [8]. It is honest and deterministic, not a variable reward.
- **Growth metaphors.** A tree (in Hebrew too, money grows), a jar that fills, a piggy that gets rounder. Keep the mapping monotonic and proportional. If the picture hits a ceiling, say so.
- **Exponential growth bias** [15]. Almost everyone underestimates compounding. A "wait and see" slider helps: drag through next week, the holiday and the birthday, and watch principal and interest grow in two colours. The app's `principal` concept already exists.

## 6. Guardrails (hard rules for child mode)

- **No nudges that extend use.** UK Age Appropriate Design Code standard 12, best interests of the child, minimal data [19].
- **Banned** [18][21]:
  - "come back tomorrow and get X"
  - characters that nag when the child is idle
  - characters that are sad, hungry or sick
  - purchase pressure
  - random rewards
  - fake progress
- **No notifications to the child by default** [20]. A parent may choose to turn on a positive one.
- **No punishment for being away.** Interest accrues whether or not the child looks, and the app says exactly that.
- **Involve the parent.** In PISA 2022, children who discuss money with their parents score higher [24]. Add a "show a grown-up" moment.
- **Honest rate.** For ages 10+, say plainly that the family's rate is higher than a bank's [25]. This matches the backlog's "הריבית של בנק המשפחה".
- **Reduced motion.** Honour `prefers-reduced-motion` (WCAG 2.3.3 [23]). Sound is off by default. `src/theme/motion.ts` already handles reduced motion.
- **Privacy.** Child mode stays read-only, with no tracking of the child's behaviour [19].
- **RTL.** Progress runs right to left (our inference, not sourced).

## 7. Ranked ideas for fun-saver

1. **"While you were away" on open.** A coin drops into the savings jar and the screen says "+₪0.43 since yesterday" [8][10][21]. *Mockups A, B, C, D.*
2. **A goal with the child's own picture and a progress bar** [12][14][16]. *Mockup C, on the saving-goal spec.*
3. **"Wait and see" slider** with principal and interest in two colours [4][15]. *Not mocked yet.*
4. **Presentation by age** [3][5][6]:
   - 5–7: objects and counts
   - 8–10: shekels with a visual
   - 11–12: real rates and a chart
5. **A growing tree or plant** that only grows, and rests rather than wilts [18]. *Mockup B.*
6. **Interest as "what it buys"**, e.g. "an ice cream this month" [2][5].
7. **Informational milestones** such as first ₪1 of interest, ₪100 saved, savings doubled. Never tied to logins [11]. *Mockup D.*
8. **The money's streak, not the child's**, e.g. "47 days in a row" [8][20][22]. *Mockup A.*
9. **"Show a grown-up"**: a full-screen celebration to hand to the parent [10][24].
10. **Jars that look physical**, each with its own personality, that react when tapped [3][14].
11. **The good-deeds jar shows impact, not amount** [1][10]. *Mockup B's flowers.*
12. **An honest head start on a new goal**: the goal starts at the current balance [13]. Already in the goal spec.
13. **Tap-to-play micro-interactions**, muted by default [3][23]. *Mockup D's Piggy.*
14. **Spending kept calm**, never shown as a temptation next to the goal [9].
15. **The guardrails in §6 written into the design rules** [18–21].

## 8. How the four mockups map

| | A · Living jar | B · Money tree | C · Road to the goal | D · Piggy + stickers |
|---|---|---|---|---|
| Main idea | Interest drop on open, the money's streak, the next-coin meter | A tree that grows by stage, interest as fruit, donations as flowers | Goal-gradient on a path; time left in weeks; interest as a helper | A companion, plus informational milestones |
| Best age | All | 5–9 | 7–12 | 5–8 |
| Risk | Least pull to come back | Illustration cost; tapping fruit could feel like a chore | Needs the saving goal | Feels babyish at 10+; risk of parasocial pressure |
| Effort | Small | Medium–large | Medium, after the goal ships | Medium; stickers need stored milestones |

## Sources

1. CFPB, Building blocks of financial capability — https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/
2. Whitebread & Bingham (2013) for the Money Advice Service, *Habit Formation and Learning in Young Children* (*secondary*) — https://sueatkinsparentingcoach.com/2013/07/your-childsmoney-habits-are-formed-by-the-age-of-7/ ; MaPS, Measuring financial literacy age 4–6 (2022) — https://maps.org.uk/content/dam/maps-corporate/en/our-work/uk-strategy-for-financial-wellbeing/maps-measuring-financial-literacy-age-4-to-6-testing-2022.pdf
3. Nielsen Norman Group, Children's UX — https://www.nngroup.com/articles/childrens-websites-usability-issues/
4. Friedman, The development of children's knowledge of the times of future events — https://digitalcommons.oberlin.edu/faculty_schol/2377
5. Siegler & Booth (2004), log-to-linear shift (APS summary) — https://www.psychologicalscience.org/observer/early-development-of-estimation-skills
6. Children's understanding of economic phenomena (review; Berti & Bombi) — https://jps.ecnu.edu.cn/EN/Y2015/V38/I5/1123
7. Watts, Duncan & Quan (2018), Revisiting the Marshmallow Test — https://journals.sagepub.com/doi/10.1177/0956797618761661
8. Kidd, Palmeri & Aslin (2013), Rational snacking — https://pmc.ncbi.nlm.nih.gov/articles/PMC3730121/
9. Mischel & Ebbesen (1970), attention in delay of gratification (*secondary*) — https://en.wikipedia.org/wiki/Stanford_marshmallow_experiment
10. Ryan & Deci (2000), Self-Determination Theory (*secondary*) — https://en.wikipedia.org/wiki/Self-determination_theory
11. Deci, Koestner & Ryan (1999), rewards and intrinsic motivation meta-analysis — https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf
12. Kivetz, Urminsky & Zheng (2006), The Goal-Gradient Hypothesis Resurrected — https://business.columbia.edu/sites/default/files-efs/pubfiles/1200/goalgradient.pdf
13. Nunes & Drèze (2006), The Endowed Progress Effect — https://ideas.repec.org/a/oup/jconrs/v32y2006i4p504-512.html
14. Soman & Cheema (2011), Earmarking and Partitioning — https://www.russellsage.org/sites/default/files/u137/jmr-C-s014-s021-online.pdf
15. Exponential growth bias (Stango & Zinman 2009; Levy & Tasoff) — https://personal.lse.ac.uk/levymr/papers/LevyTasoff.pdf
16. Hershfield et al. (2011), Age-progressed renderings of the future self — https://vhil.stanford.edu/publications/increasing-saving-behavior-through-age-progressed-renderings-future-self
17. Sailer & Homner (2020), The gamification of learning: a meta-analysis — https://link.springer.com/article/10.1007/s10648-019-09498-w
18. Radesky et al. (2022), Manipulative design in apps used by children, *JAMA Netw Open* — https://pmc.ncbi.nlm.nih.gov/articles/PMC9206186/
19. ICO Age Appropriate Design Code, the 15 standards — https://www.afslaw.com/perspectives/alerts/ico-releases-code-practice-age-appropriate-design-online-services
20. 5Rights Foundation, *Disrupted Childhood* (2023) — https://5rightsfoundation.com/uploads/Disrupted-Childhood-2023-v2.pdf
21. Zendle & Cairns, Adolescents and loot boxes — https://pmc.ncbi.nlm.nih.gov/articles/PMC6599795
22. On the Duolingo streak (opinion, *anecdotal*) — https://designbuddy.substack.com/p/is-duolingo-unethical
23. W3C, WCAG SC 2.3.3 Animation from Interactions — https://w3c.github.io/wcag/understanding/animation-from-interactions
24. OECD, PISA 2022 Financial Literacy — https://www.oecd.org/en/topics/student-financial-literacy
25. Greenlight, Parent-Paid Interest — https://help.greenlight.com/hc/en-us/articles/360020603133
26. GoHenry savings goals — https://www.finextra.com/pressarticle/58177/gohenry-introduces-saving-features-for-kids
27. GoHenry vs NatWest Rooster Money — https://www.finder.com/uk/gohenry-vs-natwest-rooster-money
28. Lepper, Greene & Nisbett (1973), cognitive evaluation theory (*secondary*) — https://en.wikipedia.org/wiki/Cognitive_evaluation_theory

## 9. Making the piggy bank look good

The first glass-piggy mockup (B2) looked cheap for four reasons:
- thin outlines
- flat pastel with no light or shadow
- coins drawn as a repeating pattern, which read as a waffle
- no expression

A throwaway mockup put five fixes side by side. Every style uses nostrils side by side, and every style has the tappable interest coins from B2.

| Style | How it is made | Fits | Watch out |
|---|---|---|---|
| **Real glass** | A tinted back wall, a gradient rim brighter on the lit side, one big soft reflection plus one sparkle, a soft shadow on the ground. The coins inside are separate 3D discs (face, edge, ring, glint), piled from the bottom with a slight tilt. Icons8 groups this look as "3D glassy" [29]. | Literal "see your money grow" | The hardest of the three to keep looking good at small sizes |
| **Soft clay with a window** | Light from the top-left, a soft shade underneath, a white highlight, no outlines. This is claymorphism, now an established style for kids' apps and friendly fintech [30]. The coins show through a round window, like a real toy piggy bank. | The app's chunky cards and lip shadows already look like this | Can look plasticky if every surface has the same gradient |
| **Bold and flat** | Duolingo's illustration rules: only rounded rectangles, circles and rounded triangles; nothing pointy; as few shapes as possible; shade with a darker flat shape [31][32]. | The cheapest to keep consistent, and it scales down well | Reads young for ages 10+ |
| **Face to face** | The same clay look, but the pig faces the child with big shiny eyes; the coins sit in a glass belly under the face. | Ages 5–8, who respond most to a character | The most babyish for 10+ |
| **Night light** | Frosted glass on a night sky. Warm glow around the pig that brightens as it fills, so the progress is the light. | A calm look before bed | Needs its own background, plus a day version for the other themes |

**Chosen (2026-10-04): version 4, Face to face.** It has floppy ears and a thin slot. It is now B2, drawn in `mockups/2026-10-04-child-piggy-bank.html#piggy-bank`. Interest waits above the slot as at most 3 coins, and a longer absence puts more into each coin rather than adding coins. Tapping a coin drops it through the slot, and the remaining coins slide over to close the gap.

**How it should get built.** Hand-drawn SVG is enough to choose a direction, but not for production.
- **Rive** state machines take a number input (0–1) that drives an animation. "Fill level" would be one input, and "coin drop" and "wiggle" would be triggers [33][34].
- **Lottie** has ready-made piggy-bank and coin-drop animations, but they play fixed timelines. A fill level that follows the balance is harder to do with them [35].
- **Recommendation:** commission or buy the chosen piggy bank as a Rive file, with:
  - one number input, `fillLevel`
  - two triggers, `coinDrop` and `tap`
  - a static first frame for reduced motion

Sources (continuing the list above):

29. Icons8, 3D glassy illustration style — https://icons8.com/illustrations/t/gradient-pointer/style--3d-glassy
30. Setproduct, Claymorphism UI design guide — https://preview.setproduct.com/blog/claymorphism-design-guide
31. Duolingo design, Illustration — https://design.duolingo.com/illustration
32. Duolingo blog, Shape language: Duolingo's art style — https://blog.duolingo.com/shape-language-duolingos-art-style/
33. Rive docs, State machine inputs — https://rive.app/docs/runtimes/inputs
34. Viget, Create Rive-ting animations — https://www.viget.com/articles/create-rive-animations/
35. LottieFiles, Piggy bank animations — https://lottiefiles.com/free-animations/piggybank
