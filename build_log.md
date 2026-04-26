# Project Sub Three — Build Log

A running record of what we built, why, and what we learned. Raw material for future articles and videos.

---

## Step 0: The Brief (2026-04-23)

**What happened:** Steve wrote the project brief (`project_sub_three_brief.md`) capturing the origin story, product concept, and technical direction. First conversation with Claude to align on vision.

**Key decisions:**
- The AI companion is the core experience — not a training plan generator, but an agent that "knows you" via a runner context model
- The companion needs a name (TBD — brainstorm needed)
- App is free; brand/merch is the revenue model
- Web-first, React, Claude API backend
- Document the entire build journey for content (articles + videos)

**What we learned:**
- Steve and Claude are aligned on starting with a hero landing page to establish identity, design language, and start capturing interested runners
- The coaching model (readiness scoring, workout suggestions, timeline estimates) is conceptual — we'll pull it apart piece by piece
- Steve built the predecessor systems (miCoach, etc.) — this project carries hard-won knowledge about what those systems got wrong

**Next:** Design and build the hero landing page.

---

## Step 1: Landing Page & Repo Setup (2026-04-23)

**What happened:** Designed, iterated, and built the hero landing page. Set up the GitHub repo and pushed the first commit.

**Design process:**
- Started with a static mockup: dark minimal aesthetic, oversized "SUB THREE" typography, pace breakdown grid (6:51/mile, 4:15/km, 8.8 mph), email capture CTA
- Iterated on copy — killed the "honest buddy" angle, landed on speaking directly to the obsession rather than selling the goal
- Added animations: 3:00:00 → 2:59:59 countdown, pace numbers counting up from zero, staggered fade-ins
- Final copy: "This isn't for everyone. But if you're the kind of runner who thinks about pace in the shower and adds an extra mile just to hit a round number — *you might have a sub-three in you.* Let us get to know you and find out."

**Key decisions:**
- Don't sell the goal. The audience already wants sub-3 — give them a home, not a pitch.
- Round number psychology is core to the brand (Nike Breaking2, Bannister's 4-min mile, runners adding distance to hit round numbers)
- "Join the chase" as the CTA
- Story/origin page will be separate from the landing page
- Repo named `projectsubthree.com` at github.com/dangerbot
- Will deploy via Vercel, connect to real domain when ready

**Brand insights from Steve:**
- Sub-3 doesn't take an elite athlete — it takes mindset, dedication, consistency, and maybe a little crazy
- The AI companion will build a context model of each runner: who you are, readiness scoring, workout suggestions, timeline to goal
- Steve also owns the sub-four domain — potential follow-up product

**Repo:** https://github.com/dangerbot/projectsubthree.com.git

**Files:**
- `site/index.html` — animated hero landing page (responsive, mobile-friendly)
- `site/README.md` — project README
- `site/.gitignore` — standard web project ignores
- `project_sub_three_brief.md` — product brief
- `build_log.md` — this file

**Next:** Deploy to Vercel. Wire up email capture. Start thinking about the story page.

---

## Step 2: Vercel Deploy, Email Capture, and the Runner Context Model (2026-04-26)

**What happened:** Deployed the landing page to Vercel, wired up email capture with Formspree, and began the deep brain dump of the runner context model — the coaching brain behind the product.

**Vercel deployment:**
- Connected GitHub repo (dangerbot/projectsubthree.com) to Vercel
- Live on a .vercel.app URL for prototyping
- Will connect projectsubthree.com domain when ready to go public

**Email capture:**
- Integrated Formspree (endpoint: xpqknlqp) for "Join the chase" email collection
- AJAX submission keeps the user on the page
- Confirmation message: "2:59:59 — You're in. The chase starts soon."

**Runner context model — first major brain dump:**
- Created `runner_context_model.md` — the core data structure for understanding a runner
- Documented four training dimensions in order of priority:
  1. **Long run history** — why 18 miles isn't enough, why 22-24 is the target, guardrails on marathons as training runs
  2. **Weekly mileage** — the lactate threshold thesis (make 6:51 feel easy, not fast), progressive cycle structure (4-week → 6-week), 60+ mi/wk target
  3. **Quality/speed work** — fartleks, threshold intervals, Yasso 800s, fast-finish longs, sprint mechanics. Layered on top of mileage, never replaces it.
  4. **Nutrition/fueling** — the wall is a fueling problem (glycogen depletion → fat switch), metabolic flexibility as the goal
- Credited Jack Daniels PhD ("Daniel's Running Formula") as the foundational training philosophy
- Extracted the diminishing returns curve (Figure 1.5) — digitized into `data/daniels_diminishing_returns.json`
- Defined the three readiness numbers: sub-three probability today, injury risk, and weeks to 95% probability
- Outlined how the AI companion builds context over time through conversation — from "tell me about your running" to precise cycle-by-cycle coaching

**Key insight documented:**
- "We are NOT training for a specific marathon you signed up for. We are breaking sub-three, and it takes the time it takes."
- The fastest way to raise probability raises injury risk. The companion navigates this tension.

**Files added:**
- `runner_context_model.md` — the coaching brain (living document)
- `data/daniels_diminishing_returns.json` — extracted curve data for algorithms

**Later in the session — VDOT, weighted miles, and race-day factors:**
- Defined VDOT 54 as the sub-three target — captured race equivalencies (5K 18:40, 10K 38:42, half 1:25:40) and all five training paces (easy 8:00, marathon 6:49, threshold 6:26, interval 88s/400m, rep 82s/400m)
- Created `data/vdot_54_reference.json` for use in algorithms
- Developed the "weighted miles" concept — a practical alternative to Daniels' time-based point system. Stays in miles (intuitive for runners) but applies intensity multipliers. Key rule: weighted miles moderate load, they don't substitute for actual miles.
- Documented race-day factors: altitude differential and course profile effects. Key insight: "humans are not wheels" — hilly courses cost more than they give back, even at net-zero elevation.
- Restructured repo to put git at the project root (not inside site/). Updated Vercel root directory to `site/`.
- Consolidated all open questions into a master list in the context model.

**Files added/updated:**
- `runner_context_model.md` — expanded with VDOT, weighted miles, race-day factors, master open questions, file index
- `data/vdot_54_reference.json` — VDOT 54 paces and race equivalencies

**Next:** Dig into Daniels' phase-based periodization. Begin sketching the AI companion interaction model (onboarding flow, data input, conversation patterns). Story page for the website. Start working toward a prototype readiness calculator.
