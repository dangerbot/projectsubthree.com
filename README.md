# Project Sub Three

An AI training companion for marathon runners chasing sub-three hours.

## The Story

I ran my first marathon at a blazing sub-three pace. Until mile 18. The wall. I finished in 4 hours, the hardest way possible.

After that, it was on. I tried 11 more times. All failures. During this time I was building coaching platforms at Adidas, working alongside some of the top running coaches in the world — literally building the tools while trying to coach myself.

On attempt #12, after a full year of dedicated focus: **2 hours, 58 minutes.**

Project Sub Three takes what I learned across those 12 attempts and puts it in an AI companion that can help other runners get there in fewer tries.

## What This Is

Not a training plan generator. A companion that knows *you* — your history, your readiness, your tendencies, your weak spots. It builds a living plan that adapts as you train, not a PDF you print and forget.

The architecture follows a simple principle: **AI decides, tools execute.** The companion handles conversation, context-building, and coaching judgment calls. Deterministic engines handle the mechanical work — generating plans, calculating mileage, assigning workouts. The AI sends ~100 bytes of coaching decisions; the plan engine stamps out a full 56-week periodized plan in ~5ms.

## Current State

We're building in public, in layers:

- **Skateboard** *(done)* — Browser → one API route → Claude. No database, no auth. System prompt carries the coaching brain. Proves the companion concept works.
- **Bicycle** *(now)* — Tool use is live. The AI calls functions mid-conversation (`generate_training_plan`). Plan engine encodes a 14-phase base plan. Living plan foundations in place.
- **Car** *(next)* — Supabase for persistence. Watch data integration. Nutrition. Real-time plan adaptation based on actual training.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React, TypeScript
- **AI:** Claude API (Sonnet) with tool use / streaming
- **Plan Engine:** TypeScript — 14 phases, workout assignment with constraints, entry point detection
- **Styling:** Custom CSS variables, dark theme, split-screen layout (chat + dashboard)
- **Deployment:** Vercel (planned)

## Running Locally

```bash
cd app
npm install
cp .env.example .env.local  # Add your ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Fill in your runner context on the right, tap Apply, and start talking.

## Project Structure

```
app/                          # Next.js application
  app/
    api/chat/route.ts         # Streaming API with tool use loop
    components/
      ChatPanel.tsx           # Conversation UI with streaming
      DashboardPanel.tsx      # Right panel — context, plan, readiness
      TrainingPlanView.tsx    # Collapsible plan view with phase headers
      RunnerContext.tsx        # Editable runner profile
      ReadinessNumbers.tsx    # Sub-3 probability, injury risk, weeks to 95%
      ThinkingBolt.tsx        # Lightning bolt thinking indicator
    lib/
      system-prompt.ts        # The coaching brain
      runner-context.ts       # Runner data model
      training-plan.ts        # Plan types and converters
      plan-engine/
        base-plan.ts          # 14-phase training plan as data
        generator.ts          # Deterministic plan generation
        tool-definition.ts    # Claude tool schemas
docs/
  architecture-tool-use.md    # Why the companion needed hands
  base-plan-v1.md             # Base plan documentation
site/                         # Landing page
```

## The Plan Engine

The base training plan encodes 14 phases from Pre-Phase through Race Week. Each phase defines weekly mileage templates, rest week patterns, and workout slots. The generator takes a few coaching decisions — where to start, whether to compress or extend phases, target race date — and produces a complete plan with every day filled in.

Workout assignment follows constraints: threshold and Yasso 800s never land adjacent to long runs, workout density scales with phase intensity, and everything pulls back as mileage approaches peak. The engine enforces these rules deterministically — zero constraint violations across any generated plan.

## The Living Plan

The core differentiator. Plans change two ways:

1. **Coach-initiated:** The AI monitors progress and suggests modifications. Missed two weeks? Extend the current phase. Crushing every workout? Compress and move up.
2. **Runner-initiated:** "Can I move my long run to Sunday?" The plan rebuilds instantly and the probability numbers update in real time.

This is possible because plan generation is deterministic and fast (~5ms). If the AI had to regenerate a 56-week plan from scratch every time, the experience would be unusable.

## Building in Public

This project is being built and documented as a case study in using AI tools to ship a real product. The build log, architecture decisions, and design process are all in the repo. More at [projectsubthree.com](https://projectsubthree.com) (coming soon).

## License

MIT
