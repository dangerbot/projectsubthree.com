# Runner Context Model

The data structure that defines who a runner is, where they are, and how ready they are to break three hours. This is the core of the AI companion — everything it says and suggests flows from this context.

This document is a living draft. We're capturing dimensions one at a time, then building the algorithms and AI logic around them.

## Foundational Influence

The training philosophy behind Project Sub Three is heavily inspired by **"Daniel's Running Formula" by Jack Daniels, PhD**. His coaching principles and research form the backbone of our approach — training paces, periodization, the science of physiological adaptation. We credit his work as the lead inspiration and will incorporate specific ideas and principles from the book into our system.

Future sessions will pull out specific Daniels concepts (phase-based periodization, etc.) and map them into our context model and coaching logic.

### VDOT 54 — the sub-three target

Daniels' VDOT is a single-number fitness score that links race performances across distances. For sub-three, we target **VDOT 54**, which corresponds to a marathon time of 2:58:47.

**Race equivalencies at VDOT 54:**

| Distance | Time | What it tells us |
|---|---|---|
| 5K | 18:40 | Good sign — you have the raw speed |
| 10K | 38:42 | Better sign — speed plus some endurance |
| Half marathon | 1:25:40 | Strong sign — closest predictor of marathon ability |
| Marathon | 2:58:47 | The target |

Important: running a 5K in 18:40 does NOT mean you can race a sub-three marathon. The shorter the distance, the weaker the prediction — speed without endurance is not enough. A half marathon at 1:25:40 is a much stronger signal because it tests sustained effort closer to the actual demands.

**Training paces at VDOT 54:**

| Workout type | Pace | Purpose |
|---|---|---|
| Easy runs | 8:00/mile | Aerobic base — most miles here |
| Marathon pace | 6:49/mile | Goal race effort (a few seconds faster than 6:51 for buffer) |
| Threshold | 6:26/mile | Lactate threshold work — intervals and steady state |
| Interval | 88 sec/400m | VO2max development — short hard efforts |
| Repetition | 82 sec/400m | Neuromuscular/mechanics (unlikely to use, for reference) |

These paces are what the AI companion will prescribe for workouts once a runner's context supports quality training. Data stored in `data/vdot_54_reference.json`.

**How VDOT connects to the readiness model:** A runner's current VDOT (estimated from recent race results or time trials) compared to the target VDOT of 54 is one of the clearest signals of how close they are. If their current half marathon time implies VDOT 48, we know exactly how much fitness needs to be built — and the training paces adjust accordingly until they reach 54.

**VDOT is not static.** As a runner progresses through training, their VDOT will rise. Each time they race or time-trial, we get a new data point. Training paces should update with the new VDOT — a runner at VDOT 48 today trains at different easy/threshold/interval paces than they will at VDOT 52 six months from now. The companion should track VDOT over time as a key fitness trajectory signal.

**Open questions — VDOT:**
- Should we build a full VDOT lookup table into the system (not just 54) so we can prescribe paces at any level?
- How often should VDOT be re-estimated? After every race? Periodically via time trials?
- Can we estimate VDOT from workout data (e.g., threshold pace in training) rather than requiring a race?
- How do we handle a runner whose 5K VDOT and half marathon VDOT don't match? (Speed without endurance, or endurance without speed — both are diagnostic.)

### Key data: The diminishing returns curve (Figure 1.5)

One of the most important concepts from Daniels is the relationship between weekly mileage and percentage of running potential achieved. The curve shows massive early gains that flatten dramatically at higher volumes. We've extracted this data into `data/daniels_diminishing_returns.json` for use in our algorithms.

The critical insight the graph alone doesn't show: **these must be sustained miles built through progressive training cycles — not single-week spikes.** A week of 60 after weeks of 20 isn't adaptation, it's an injury.

This curve will feed directly into our readiness scoring: mapping a runner's sustained weekly mileage to a base percentage of potential, then layering in long run history, quality work, and nutrition signals to produce overall sub-three probability.

---

## The AI Companion — How It All Comes Together

The runner interacts with an AI agent — conversational, like a knowledgeable training partner who has been through it. Think of it as a coach who listens more than lectures.

### How context builds over time

The companion starts by getting to know the runner through conversation and any data they share. Early interactions are high on questions, light on prescription. As the context model fills in — mileage history, long run data, race results, injury patterns, nutrition habits — the companion's suggestions get sharper and its readiness assessments get more accurate.

This is a relationship that compounds. Week 1, the companion might say "tell me about your running history." Week 12, it says "your sustained mileage is holding at 52 and your last three long runs were 18, 20, and 19 — you're ready to push into a 22-mile effort in the next cycle, but let's talk about your fueling plan for it first."

### The three numbers

At any point, the companion can surface three key readiness indicators:

1. **Sub-three probability today** — If you raced a marathon tomorrow, what's your estimated chance of breaking three? Based on current sustained mileage, long run readiness, pace data, and fueling. Honest, possibly humbling, always grounded in the data.

2. **Injury risk** — Based on rate of mileage increase, training load vs. history, recovery patterns, and red flags. This is the guardrail. Pushing probability up too fast pushes injury risk up with it.

3. **Weeks to 95% probability** — The estimated timeline to reach a high-confidence sub-three, assuming consistent training at the recommended progression. This number might be long — and that's the point. We're not selling shortcuts.

These numbers are not guarantees. The science is fuzzy. But the sub-three marathon is a well-studied effort with decades of data across thousands of runners. We can take a meaningful pass at these estimates and refine them as the runner's context deepens.

### The relationship between the three numbers

Probability and injury risk are in tension. The fastest way to raise probability is to increase training load — but doing it too fast raises injury risk, which can reset everything. The companion's job is to navigate this tension honestly: build as fast as safely possible, no faster.

The "weeks to 95%" number is what keeps expectations grounded. It respects the biology. It tells the runner: this is what the math says based on where you are right now. The timeline is the timeline.

---

## 1. Long Run History

### Why it matters

To break 3 hours, you need experience with distance. There's no shortcut. Some runners try to get away with 18 miles as their longest run before an attempt, but unless they have raw talent to compensate, 18 miles is exactly where they'll hit the wall. (Steve's first marathon: longest training run was 18 miles. Failed at mile 18.)

During sub-three training, a runner should work up to multiple long runs over 22 miles — possibly as far as 24 — within 4-8 weeks of race day.

Runners who have done long runs in the past but not recently may have a mental advantage (they know what to expect), but they still need to build back up physically.

### What we track

"Long run" = any run over 15 miles. A half marathon is long, but not long enough to be "long" for marathon training purposes.

| Data Point | Value | Date |
|---|---|---|
| Longest single run ever | x miles | date |
| Longest run in last 12 months | x miles | date |
| Longest run in last 6 months | x miles | date |
| Longest run in last 3 months | x miles | date |
| Longest run in last 4 weeks | x miles | date |
| Longest run in last 7 days | x miles | date |

### Signals & insights (to develop)

- **Never run over 15 miles?** Sub-three is a long way off. Start with marathon completion first.
- **Longest run is 18 miles?** You'll need to push past this ceiling multiple times before race day. The wall lives here.
- **22+ miles in the last 8 weeks?** Good foundation. The body knows what's coming.
- **22+ miles but more than 8 weeks ago?** Experience is banked mentally, but you need to rebuild the physical readiness.
- **Multiple 20+ mile runs in training?** Strong indicator of distance readiness (distinct from pace readiness).

### Guardrails & coaching logic

**Cap at 24 miles for training runs.** Runs over 26.2 miles are not necessary and not recommended. The extra stress increases injury risk without proportional benefit. If a runner has the endurance to go beyond marathon distance, that energy is better redirected into pace-specific workouts — the goal isn't to run farther, it's to run faster for 26.2.

**Marathons as "training runs" — flag with caution.** A runner may want to use a marathon as a training run on the way to their goal race. This is risky for multiple reasons:
- Temptation to race it (too fast, too much recovery needed)
- Timing may not align with the larger training progression
- Expensive — race fees add up for something that could hurt more than help
- Unless it fits cleanly into the training plan as a controlled effort, recommend skipping it

**Prior marathon completions are still valuable context.** A runner who has finished a marathon before — even years ago — has mental and physical reference points. They know what mile 20 feels like. Track this separately from training-run long runs.

### Open questions

- How do we weight recency vs. lifetime experience?
- What's the interaction between long run distance and long run pace? (A 22-miler at 9:00/mile is very different from 22 at 7:00/mile)
- Should we track total count of runs over 20 miles (lifetime and recent)?
- How does elevation/terrain factor in?
- How do we handle a runner who insists on a "training marathon"? Discourage? Or help them plan it as a controlled effort (target pace, recovery plan)?

---

## 2. Weekly Mileage

### Why it matters — the real goal of training

6:51/mile is not that fast. If you can't run it for at least 1 mile, you're probably not a candidate for sub-three right now. That's the minimum bar.

But 6:51 for 26.2 miles is a completely different problem. For most of us, that pace sits above our **lactate threshold** — the point where our body accumulates lactate faster than it can clear it. Human physiology limits sustained effort above lactate threshold to roughly 90 minutes for a highly trained runner. Sub-three requires 180 minutes.

**The real goal of training is to push lactate threshold above 6:51/mile pace.** If you can do that, your chances of breaking three are very high — only injury and fueling would hold you back (and those can hold you back).

### The physiological adaptations we're chasing

To get 6:51 below lactate threshold, the body needs fundamental changes:
- **Heart grows physically larger** — pumps more blood per beat
- **Blood becomes more efficient at carrying O2** (aerobic capacity)
- **Muscles develop more blood vessels** (capillarization) — better access to oxygenated blood
- **Muscles, tendons, ligaments, fascia strengthen** — more efficiency, less wasted energy
- **Fat metabolism improves** — body learns to burn fat after carbohydrate stores are depleted

**How do you get there? Miles. Miles and miles and miles.** Long, slow miles. Speed is not as important as volume. In fact, if running fast prevents you from running long, slow down so you can run farther. At VDOT 54, easy pace is 8:00/mile — over a minute slower than race pace. Most runners run their easy days too fast, which adds fatigue without adding aerobic benefit, and compromises the quality sessions that actually build speed. This is the single most important part of the training. It makes no sense to run fast if you haven't done the physiological adaptations that will allow you to run 6:51 below lactate threshold. Volume doesn't guarantee you'll get there, but without it, you have no chance.

### What we track

Weekly mileage history, measured in miles (or km) per week:

| Data Point | Value |
|---|---|
| Miles this week (current/in progress) | x miles |
| Miles per week for last 4-8 weeks | [array of weekly totals] |
| Peak weekly mileage — last 4 weeks | x miles |
| Peak weekly mileage — last 3 months | x miles |
| Peak weekly mileage — last 6 months | x miles |
| Peak weekly mileage — last 12 months | x miles |
| Peak weekly mileage — lifetime | x miles |

### Training cycle structure (periodization)

Mileage is built up in **cycles**, each with a single purpose — not two, not three. Early cycles are purely about building mileage volume.

**4-week cycles** (for mileage up to ~40-50 miles/week):
- 3 weeks building up → 1 recovery week
- Good for early gains when the increases are modest

**6-week cycles** (for mileage above ~50 miles/week):
- 5 weeks building up → 1 recovery week
- As training load increases, the body needs more time to adapt and more recovery

**Recovery weeks** are easier but not off — enough to let the body recover while maintaining the stress adaptations already built.

### Guardrails & coaching logic

**Minimum target: 60 miles/week.** To have a real shot at sub-three, the runner needs to build to at least 60 miles/week during peak training.

**No rushing the buildup.** Jumping from 20 to 60 miles/week might be possible for a single week, but injury is almost certain. The rate of increase depends on the runner's experience and injury resistance (rules for increase rates TBD). The key insight: **we are NOT training for a specific marathon you signed up for. We are breaking sub-three, and it takes the time it takes.** Runners often fail because they signed up too late and compressed the timeline.

**Upper limit: ~80 miles/week.** Beyond 80, there may not be meaningful additional benefit for a sub-three goal. (In the 1970s, runners would push 100+, but that's overkill for this goal.) Runners targeting significantly faster times (e.g., 2:30) are a different story and likely need professional coaching — that training load is on the edge of what the body can handle.

**Cap on per-cycle increase: TBD.** We'll develop specific rules for how much weekly mileage can increase per cycle based on current level, history, and injury risk.

### Signals & insights (to develop)

- **Currently under 20 miles/week?** Sub-three is a long-term project. Start building volume — months of base work needed before any speed work matters.
- **40-50 miles/week consistently?** Ready to transition to longer cycles and push toward 60+.
- **60+ miles/week with multiple cycles completed?** Volume foundation is there. Can start layering in pace-specific work.
- **Big gap between peak ever and current?** Runner has been here before — body may adapt faster on the rebuild, but still needs progressive loading.
- **Inconsistent week-to-week?** Consistency matters more than any single big week. Flag this.

### Open questions

- Exact rules for safe mileage increase per cycle (10% rule? More nuanced?)
- How do we detect if a runner is building too fast vs. too conservatively?
- Relationship between weekly mileage and long run distance within that week (what % of weekly total should the long run be?)
- How to handle weeks missed due to illness, travel, life — how much do you lose and how fast do you rebuild?
- At what point in the training progression do we shift cycle focus from "build mileage" to "build speed at mileage"?

---

## 3. Quality / Speed Work

### Why it matters

Mileage is #1. Without it, nothing else matters. But mileage alone may get you to 7:21/mile — not 6:51. At some point in the training progression, you need to teach the body what 6:51 feels like and build the capacity to hold it.

Quality work gets layered in as mileage builds. It does not replace mileage — it rides on top of the volume foundation. Too early and you're building speed on a weak base. Too much and you're injured or overtrained.

### Types of quality workouts

- **Fartlek runs** — unstructured speed play within a run, good early introduction to faster efforts
- **Threshold intervals** — sustained efforts at or near lactate threshold pace, training the body to clear lactate at higher intensities
- **Yasso 800s** — classic marathon predictor workout (800m repeats where time in minutes:seconds predicts marathon time in hours:minutes)
- **Fast-finish long runs** — long-ish runs where the final miles are at or near goal pace, teaching the body to run fast on tired legs
- **Sprint work** — short, fast efforts that improve running mechanics and neuromuscular efficiency

### Racing as training

While a full marathon as a "training run" is risky (see Section 1), shorter races can be valuable training tools:
- **5K** — good for testing raw speed, leg turnover
- **10K** — closer to threshold effort, good fitness benchmark
- **Half marathon** — strong indicator of marathon potential, tests sustained effort without the full recovery cost of a marathon

These races give real data points on current fitness and can slot into training cycles without the injury/recovery risk of a marathon.

### Integration with training cycles

Quality work is introduced in dedicated cycles after a mileage base is established. A cycle focused on quality still maintains the mileage volume — it doesn't trade miles for speed. The cycle's single purpose might shift from "build mileage" to "build threshold pace at current mileage" or "develop race-pace feel."

### Weighted miles — a better way to measure training load

**The problem:** Not all miles are equal. A mile at easy pace and a mile at threshold pace put very different stress on the body. Daniels addresses this with a points-per-minute system across intensities (easy ~10-15 pts/hr, marathon pace ~21-35 pts/hr, threshold ~35-40 pts/hr, and higher for faster work). But as a practical tool for runners, it's hard to follow.

**Our approach: weighted miles.** Instead of converting to time-based points, we stay in miles (since we're training for a specific distance at a specific time) and apply a weight multiplier based on intensity. A threshold mile might count as 1.5 weighted miles. A mile of interval work might count as 2.0. Easy miles stay at 1.0. The exact conversion factors will be developed over time.

**Daniels' argument for time over distance:** A pro and a recreational runner both running 10 minutes at the same relative effort cover very different distances. True — but since we're targeting a specific time (sub-3:00) for a specific distance (26.2 miles), we can apply a "special relativity" of sorts and stick with miles as the unit, weighting them to reflect actual stress.

**Critical rule: weighted miles are NOT a substitute for actual miles.**
- You cannot run faster to artificially inflate your way to 60 weighted miles on 40 actual miles. You NEED 60+ real miles as the aerobic base. The physiological adaptations require actual volume.
- Weighted miles serve a different purpose: **moderating total training load when quality work is introduced.** When you add threshold intervals or tempo runs on top of base mileage, the weighted total goes up — even if actual mileage stays flat or drops slightly. This helps us monitor whether we're adding stress on stress.

**How we'll use this:**
- During base-building cycles: weighted miles ≈ actual miles (almost all easy running)
- When quality cycles begin: actual mileage may drop slightly, but weighted miles should stay controlled — not spike
- If weighted miles are climbing too fast relative to recent history → flag injury risk
- The gap between actual and weighted miles tells us how much intensity is in the training mix

**Conversion factors (TBD — to be refined):**

| Intensity | Weight per mile | Notes |
|---|---|---|
| Easy / recovery | 1.0 | The foundation — most miles should be here |
| Marathon pace | ~1.3-1.5 | Goal race effort |
| Threshold / tempo | ~1.5-2.0 | Lactate threshold work |
| Interval (VO2max) | ~2.0-2.5 | Short, hard efforts |
| Repetition / sprint | ~2.5-3.0 | Neuromuscular, mechanics work |

These are starting estimates. We'll calibrate based on Daniels' point system, real runner data, and Steve's experience.

### What we track (to develop)

- Types of quality workouts completed and frequency
- Paces achieved in quality sessions vs. goal pace (6:51)
- Race results at 5K, 10K, half marathon distances (with dates)
- Ratio of quality work to easy mileage within a week

### Open questions

- At what weekly mileage / cycle count does quality work get introduced?
- How many quality sessions per week at different training phases?
- How do we use race results to predict marathon readiness? (Yasso, McMillan, Daniels equivalencies?)
- How to periodize quality types across cycles (fartlek first → threshold → race pace → taper?)

---

## 4. Nutrition & Fueling

### Why it matters

The marathon "wall" is fundamentally a fueling problem. It's the point where your body runs out of easily accessible liver glycogen (carbs) and starts switching to fat as its primary energy source. Fat is harder to metabolize and produces energy more slowly — so you slow down, sometimes dramatically.

For most runners, this switch happens somewhere around 90-120 minutes of sustained effort. For a sub-three attempt, that means the wall hits roughly between miles 18-22 — exactly where most attempts fail.

Steve's experience: cramping was a major issue across multiple attempts. The root cause wasn't fitness — it was being a "carb machine." The body was trained to run on easy carbs, and when those ran out, the switch to fat was catastrophic.

### The goal

Train the body to:
1. **Become better at using fat as fuel** — so the transition from carbs to fat is smoother and less abrupt
2. **Become more accustomed to burning fat** — so it doesn't feel like hitting a wall
3. **Still use carbs effectively** — you need them, but you can't depend on them exclusively for 3 hours

This isn't about cutting carbs. Most runners eat too many carbs relative to their fat adaptation needs. The training goal is metabolic flexibility — the ability to use both fuel sources efficiently.

### What we track (to develop)

- General dietary patterns (high carb dependency vs. balanced)
- Pre-run fueling habits (what and when)
- During-run fueling strategy (gels, hydration, timing)
- Post-run recovery nutrition
- History of cramping or bonking in long runs / races
- Any experience with fat-adapted training approaches

### Integration with training

Fueling strategy isn't separate from run training — it happens during the same cycles:
- Long runs are opportunities to practice race-day fueling
- Some long runs may be done in a lower-carb state to train fat metabolism
- Quality sessions may need different fueling than easy mileage days
- What you eat before, during, and after runs all contribute to metabolic adaptation

### Open questions

- How prescriptive should the AI be about nutrition? (Suggestions vs. tracking vs. just awareness?)
- Should we integrate with any nutrition tracking tools?
- How do we distinguish cramping caused by fueling vs. electrolytes vs. dehydration vs. overexertion?
- What's the right way to introduce fat-adapted training without bonking in key workouts?

---

## Training Philosophy Summary

The path to sub-three, in order of priority:

1. **Mileage first.** Build to 60+ miles/week through progressive cycles. This creates the physiological foundation — bigger heart, more capillaries, stronger connective tissue, better aerobic capacity. Without this, nothing else matters.

2. **Long runs.** Multiple 22-24 mile runs in the final 4-8 weeks. The body and mind need to know what the distance feels like.

3. **Quality work.** Layer in threshold, tempo, and race-pace efforts once the mileage base is solid. The goal: make 6:51 feel like it's below lactate threshold.

4. **Nutrition & fueling.** Train the body's metabolic flexibility so the carb-to-fat switch doesn't become "the wall."

5. **Race readiness.** Taper, mental prep, race-day strategy (TBD).

**The timeline is the timeline.** Steve took a full year of all-in focus after 5 years and 11 failed attempts. The math of progressive cycles dictated the timeline — not a race date on a calendar. The AI companion should respect this: we're not training for a race you signed up for, we're building toward a body that can break three hours.

---

## Future Dimensions (to be developed)

_Steve will add more context dimensions over time. Candidates include:_

- Pace data profiles (easy pace, tempo pace, current threshold pace vs. 6:51 target)
- Race history & PRs (marathon and shorter distances)
- Recovery patterns & injury history
- Training consistency / streak data
- VO2 max or equivalent fitness indicators
- Body weight & composition trends
- Sleep & lifestyle factors
- Mental readiness / confidence signals
- Taper strategy & race-day planning

---

## Race-Day Factors (to be developed)

These don't affect training directly but change the target — what "sub-three effort" actually requires on a given course. We'll need to adjust pace targets and probability estimates based on these.

### Altitude differential

If you train at a different elevation than race day, performance will be affected. Training at altitude and racing at sea level is generally an advantage. Training at sea level and racing at altitude is a disadvantage. We'll need to quantify this — how many seconds per mile does a given altitude differential cost or gain? TBD.

### Course profile

This one is nuanced. Even a course with zero net elevation change can be significantly harder than a flat course if it's hilly. The key insight: **humans are not wheels.**

**Slight uphill** — we're actually fairly efficient at small grades, but it slows us down. The problem: to maintain 6:51 pace on an uphill, effort goes above lactate threshold. So we either slow down (and need to make it up elsewhere) or burn matches we don't have.

**Slight downhill (0.5-1% grade)** — this may actually feel like how running "should" feel. Gravity assists without much braking cost. A net-downhill course with a gentle grade might genuinely be faster.

**Steeper downhill (>1% grade)** — the "stored gravitational energy" argument breaks down. Unlike a wheel that rolls freely, a runner has to actively brake with every step. This is eccentric muscle loading — it's actually destructive to muscle fibers. The energy "gained" from gravity is lost to braking forces, and the quad damage accumulates for later miles.

**Net effect:** A hilly course — even one that's net-zero elevation — will almost always be harder than a flat course. The time lost going uphill is greater than the time gained coming down. We may need to:
- Adjust target pace based on course elevation profile
- Adjust sub-three probability based on course difficulty
- Potentially recommend specific hill training if the target race has a challenging profile
- Help runners choose appropriate goal races (flat courses = better odds for a first sub-three attempt)

**To develop:** A model that takes a course elevation profile and estimates the time cost relative to a flat course. Even a rough estimate would be valuable — "this course profile adds an estimated 2-3 minutes to your flat-equivalent time."

---

## Master Open Questions

_Consolidated from all sections. These are the things we need to resolve as we build the algorithms and the companion experience._

**Training progression:**
- Exact rules for safe mileage increase per cycle — is the 10% rule right, or more nuanced?
- At what mileage / cycle count does quality work get introduced?
- How to periodize quality types across cycles (fartlek → threshold → race pace → taper?)
- How many quality sessions per week at different training phases?
- What % of weekly mileage should the long run be?
- How to handle missed weeks (illness, travel, life) — how much fitness is lost and how fast to rebuild?

**Measurement & scoring:**
- Should we build a full VDOT table (not just 54) for pacing at any fitness level?
- How to estimate VDOT from training data vs. requiring races?
- How to handle mismatched VDOT across distances (speed vs. endurance gap)?
- Weighted mile conversion factors — calibrate from Daniels points + real data
- How to combine all dimensions into a single sub-three probability score?
- How to model injury risk quantitatively?
- How to estimate "weeks to 95% probability" — what's the formula?

**Long runs:**
- How to weight recency vs. lifetime long run experience?
- Interaction between long run distance and long run pace?
- Track total count of 20+ mile runs (lifetime and recent)?
- How to handle a runner who insists on a "training marathon"?

**Nutrition:**
- How prescriptive should the AI be? (Suggestions vs. tracking vs. awareness?)
- Integration with nutrition tracking tools?
- Distinguishing cramp causes (fueling vs. electrolytes vs. dehydration vs. overexertion)
- How to introduce fat-adapted training safely?

**Race-day factors:**
- Altitude differential impact — quantify seconds/mile cost or gain
- Course profile time-cost model — give courses a difficulty score and adjust expectations/pacing
- Race selection guidance (which courses favor a first sub-three attempt?)
- Target race date alignment: what happens when the plan is too long for the date (honest conversation about readiness) or too short (how to fill time productively without overtraining)

**Taper:**
- 3-week taper structure before race day (volume drops, intensity maintained)
- How aggressive should the taper be? (48 → 36 → 20 is a rough starting point)
- How does taper interact with the readiness numbers? Probability should peak at race day, not at peak mileage.

**AI companion experience:**
- Name for the companion (TBD)
- Onboarding flow — what does the first conversation look like?
- How does data get into the system? (Manual input? Strava/Garmin sync? Conversation?)
- How often does the runner interact with the companion?
- What triggers proactive outreach from the companion vs. waiting for the runner to check in?

---

## File Index

| File | Purpose |
|---|---|
| `runner_context_model.md` | This file — the coaching brain |
| `project_sub_three_brief.md` | Product brief and origin story |
| `build_log.md` | Step-by-step record of the build journey |
| `data/daniels_diminishing_returns.json` | Extracted curve data — mileage vs. % potential |
| `data/vdot_54_reference.json` | VDOT 54 race equivalencies and training paces |
| `site/index.html` | Animated hero landing page |
