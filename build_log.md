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

**The UX breakthrough — the companion mockup:**

Steve described the product experience via voice (text-to-speech brain dump), and it crystallized the entire product in one shot: a split-screen interface modeled after Claude's layout — because it works.

- **Left panel:** Conversational AI companion. The runner talks to it about their training, disruptions, questions. It adapts in real-time.
- **Right panel (top):** Three readiness numbers — sub-3 probability, injury risk, weeks to 95%.
- **Right panel (mid):** This week's recommended workouts with completion status and cycle position.
- **Right panel (bottom):** Runner context — sustained mileage, long run history, race PRs, VDOT progress bar.

Built a full interactive mockup showing a runner mid-journey (VDOT 47, 48 mi/wk sustained, 22 weeks from ready). The sample conversation nailed the companion's personality: a runner asks "I ran with friends at the wrong pace, what should I change this week?" and the companion adjusts Thursday's run, protects Saturday's long run, and explains why missing a regular Tuesday run doesn't matter but missing the long run does.

**Key product insight from Steve:** The flexibility is built into the cycle structure. 4-6 week cycles absorb life's chaos. It's the sustained time in the process that adapts the body, not perfection in any single week. The companion should have a point of view — and that point of view is usually "don't panic, stay the course."

**Next:** Dig into Daniels' phase-based periodization. Refine the companion UX mockup. Story page for the website. Start working toward a prototype readiness calculator.

---

## Article Ideas (raw material from the build so far)

_These are potential article or content pieces based on what we've built and learned. Not drafts — just hooks._

### Article 1: "Building a product I've wanted for 20 years"
The origin story. 12 marathon attempts, building coaching tools at Adidas while failing to coach yourself, and finally breaking through. Why now? Because AI makes it possible to build the companion I wished I'd had. The tools have caught up to the idea.

### Article 2: "We started with a landing page, not a product"
The decision to build brand first. Why "Project Sub Three" as an identity matters more than any feature. The animated 3:00:00 → 2:59:59 countdown. Round number psychology. "Join the chase" — selling belonging, not software. From blank folder to deployed site in one session with Claude.

### Article 3: "The coaching brain — why your training plan doesn't know you"
The runner context model. Why every running app gives you a plan and leaves you alone. The four dimensions (mileage, long runs, quality, nutrition) and why they're prioritized in that order. The lactate threshold thesis: the real goal isn't to run 6:51, it's to make 6:51 feel easy. Daniels' diminishing returns curve and what it means for your weekly mileage.

### Article 4: "Three numbers that tell you if you're ready"
Sub-three probability, injury risk, weeks to 95%. Why these are in tension — pushing probability up too fast pushes injury risk up with it. The companion's job is to navigate this tension honestly. "The timeline is the timeline."

### Article 5: "I built the product interface in a conversation"
The UX session. How describing the split-screen layout via voice-to-text turned into a working mockup in minutes. The Claude-inspired layout. Why the dashboard exists alongside the chat — runners need to see where they stand without having to ask. The sample conversation about running with friends and missing workouts.

### Article 6: "Weighted miles — a better way to measure training stress"
Taking Daniels' point system and making it practical. Why time-based points are hard to follow. Why miles are the right unit for a distance-specific goal. The critical rule: weighted miles don't substitute for actual miles. "Special relativity for runners."

### Article 7: "Humans are not wheels — why hilly courses are harder than the math suggests"
Course profile effects on marathon performance. The uphill/downhill asymmetry. Eccentric muscle loading on descents. Why a net-zero course can still cost you minutes. How to choose the right goal race for your first sub-three attempt.

### Article 8: "Do you even need me? Building a product with AI as your engineering team"
The meta-story of how we're building this. Steve is a product leader with 20 years of experience at Nike and Adidas — but not an engineer. Claude writes the code, sets up the architecture, teaches the concepts along the way. Steve brings the vision, the domain expertise, the coaching philosophy, and the product instincts. The article would cover: how to set up an AI to be most useful (project instructions, context documents, iterative brain dumps), when to push back vs. let it run, the skate-bike-run approach to complexity, and why the partnership works — AI is fast but directionless without product sense, and product people are full of direction but bottlenecked by implementation. The honest version of "I built an app with AI" that doesn't pretend it was magic or trivial.

### Article 9: "Skate, bike, run — why we built a chatbot before a database"
The architecture strategy. Why we shipped a companion that forgets you every time you refresh before bothering with user accounts. Each stage is a real product, not a broken piece of the final thing. The skateboard proves the conversation works. The bicycle proves memory matters. The run proves the companion can act. How this maps to content milestones — each transition is a publishable story about what we learned.

---

## Step 3: Next.js App Scaffold & Companion UI (2026-04-26)

**What happened:** Initialized the Next.js app inside the repo and built the first version of the split-screen companion UI — the core product interface.

**Tech setup:**
- Next.js 16 with React 19, TypeScript, Tailwind CSS v4
- App lives in `app/` directory within the repo
- Dark-first theme: custom CSS variables for background (#0a0a0a), surface (#141414), borders, accent green (#22c55e), warning/danger colors
- Geist Sans + Geist Mono fonts (clean, modern, technical feel)

**Split-screen layout built:**
- **Left panel:** ChatPanel — conversational interface with the AI companion. Includes message bubbles (user vs companion), text input with Enter-to-send, and the S3 branding header. Placeholder conversation where the companion opens by checking in on the week.
- **Right panel (420px fixed):** DashboardPanel containing three stacked sections:
  1. **ReadinessNumbers** — the three core metrics: Sub-3 Probability (34%), Injury Risk (Low), Weeks to 95% (22). Color-coded by severity.
  2. **WeeklyPlan** — this week's workouts with completion checkmarks, showing cycle position (Week 3 of 5, Base Building). Includes threshold work, long run with marathon pace finish, easy days, and rest.
  3. **RunnerContext** — sustained mileage (48 mi/wk), peak week, longest run, VDOT progress bar (47 → 54), and recent race results.

**Mock data represents a realistic mid-journey runner:**
- VDOT 47 (needs to reach 54 for sub-3)
- 48 mi/wk sustained, building toward 60+
- Half marathon PR of 1:32:14 — solid but not yet sub-3 ready
- 22 weeks out at current trajectory

**Key decisions:**
- Dark theme only for now — matches the landing page aesthetic and brand identity
- Green accent color for positive metrics and the send button — evokes "go" energy
- Chat messages use subtle styling differences: companion messages have borders, user messages get the dark green background
- Dashboard is scrollable independently of chat
- All data is mock/placeholder — will connect to real runner context model and Claude API next

**Component structure:**
```
app/
  app/
    page.tsx              — split-screen layout (chat | dashboard)
    layout.tsx            — metadata, fonts, dark theme
    globals.css           — CSS variables, Tailwind v4 theme
    components/
      ChatPanel.tsx       — conversation interface
      DashboardPanel.tsx  — right panel container with mock data
      ReadinessNumbers.tsx — three readiness metrics
      WeeklyPlan.tsx      — weekly workout schedule
      RunnerContext.tsx    — mileage, VDOT, race history
```

**What we learned:**
- The split-screen pattern (inspired by Claude's own layout) translates cleanly to Next.js + Tailwind
- Having realistic mock data in the components helps validate the UX before any backend exists
- The three readiness numbers at the top immediately communicate "where you stand" — the most important thing a runner opening the app wants to know

**Next:** Run `npm run dev` locally to verify. Connect to Claude API for real companion chat. Start building the runner onboarding flow ("tell me about your running").

---

## Architecture Strategy: Skate → Bike → Run (2026-04-27)

We're building this product in layers, following the skate-bike-run philosophy: ship the simplest version that actually works, then iterate toward the full vision. Each stage is usable on its own — not a broken piece of the final thing, but a real thing that does less.

### The Skateboard (now → next few sessions)

**What it is:** A working companion you can talk to about running sub-three.

**Architecture:**
```
Browser  →  one API route file (app/api/chat/route.ts)  →  Claude API
```

That's it. One file is the entire server. Next.js turns it into a live endpoint automatically. The system prompt carries the coaching brain — Daniels philosophy, four training dimensions, pacing framework, the "don't panic" personality. The conversation isn't saved anywhere. Refresh the page, it's gone. No accounts, no login, no database.

**Why this is enough:** It proves the core product. Can an AI companion, loaded with the right coaching philosophy, have a useful training conversation? If yes, everything else is worth building. If no, we learn that before investing in infrastructure.

### The Bicycle (after the skateboard works)

**What it adds:** Memory. The companion knows who you are across sessions.

**Architecture:**
```
Browser  →  API route  →  Claude API
                ↕
            Supabase
         (database + auth)
```

Supabase gives us two things at once: a Postgres database for storing runner profiles, conversation history, training logs, and the runner context model — plus built-in authentication so runners can log in (email, Google, Apple). The API route reads from Supabase before each conversation to build a personalized system prompt: "this runner is at VDOT 47, week 3 of base building, missed Thursday's run last week." That's how the companion "knows you" between sessions.

**Why it matters:** This is when the product becomes *yours* — not a generic running chatbot, but a companion that remembers your 18-mile long run last Saturday and asks how your legs feel on Monday.

### The Run (after persistence works)

**What it adds:** The companion takes actions, not just gives advice.

**Architecture:**
```
Browser  →  API route  →  Claude API (with tool use)
                ↕
            Supabase
         (database + auth)
```

We give Claude a set of tools it can call during conversation: `log_run`, `update_workout`, `mark_complete`, `adjust_plan`, `update_context`. When a runner says "I ran 7 miles this morning at 7:45 pace," Claude recognizes the intent, calls `log_run`, the database updates, and the dashboard reflects it in real-time. The chat becomes the primary way to interact with the entire system — not forms, not settings pages, not menus. Just talk to it.

**Why this is the vision:** This is what every other running app gets wrong. They give you a plan and leave you alone. Our companion listens, remembers, adapts, and acts. The chat isn't a feature of the app — it *is* the app.

### The principle

Each layer is a real product, not a broken version of the next one. The skateboard isn't missing a database — it doesn't need one yet. The bicycle isn't missing tool use — it's proving that persistence makes conversations better. We build confidence at each stage before adding complexity.

This also maps to content milestones. Each transition is a story: "How we made the AI companion talk," "How it learned to remember you," "How it learned to take action."

---

## Step 4: Wiring Up the Companion Brain (2026-04-27)

**What happened:** Built the full chat pipeline — system prompt, API route, and streaming frontend. The companion can now talk, and it talks like *us*.

**The system prompt (app/lib/system-prompt.ts):**
This is the most important file in the project. It defines who the companion is, what it believes, and how it talks. Written entirely from the runner context model we built in Step 2. Key sections:
- Coaching philosophy (Daniels-based: mileage → long runs → quality → nutrition, in that order)
- The lactate threshold thesis ("make 6:51 feel easy, not fast")
- VDOT framework with paces that adjust to the runner's current level, not just the target
- Training cycle structure (4-week and 6-week cycles with recovery)
- The three readiness numbers and the tension between them
- Personality: direct, honest, doesn't panic, has a point of view, celebrates the process
- What it doesn't do: diagnose injuries, prescribe nutrition plans, guarantee outcomes
- Conversation starters for new runners — open-ended questions that build context naturally

**The API route (app/api/chat/route.ts):**
One file, ~50 lines. Receives messages from the frontend, sends them to Claude (Sonnet) with the system prompt, and streams the response back. Uses the official Anthropic TypeScript SDK. This is the "your server is one file" architecture from the skateboard phase.

**The ChatPanel upgrade:**
- Replaced hardcoded echo responses with real API calls to /api/chat
- Added streaming: response text appears word-by-word as Claude generates it
- Added a green pulsing cursor while streaming (like a typing indicator)
- Empty state with S3 branding: "Ready when you are — tell me about your running"
- Auto-scroll to newest messages
- Input disabled while companion is responding
- Error handling: if API fails, shows a helpful message about checking the API key

**Dependencies added:**
- `@anthropic-ai/sdk` — official Anthropic TypeScript SDK

**Files added:**
- `app/lib/system-prompt.ts` — the companion's brain
- `app/api/chat/route.ts` — the one-file API server
- `app/.env.local` — API key config (gitignored)

**Files updated:**
- `app/components/ChatPanel.tsx` — full rewrite with streaming + API integration
- `app/package.json` — added Anthropic SDK dependency

**Blocked by:** Stripe error on Anthropic console preventing API key creation. All code is in place — just needs the key pasted into .env.local.

**What we learned:**
- The system prompt is where the product lives. The API route is dumb plumbing. The frontend is the face. The prompt is the soul.
- Writing the system prompt from our own runner context model (not generic running advice) is what makes this different from "ChatGPT talks about running"
- The skateboard architecture (browser → one file → Claude) is genuinely simple. Three new files and the companion talks.

**Next:** Get API key working (Stripe issue). Test the companion conversation. Refine the system prompt based on how it feels. Start thinking about the onboarding flow.
