# Project Sub Three — Demo Script (v1)

**Format:** Short video + companion article
**Length target:** ~2-3 minutes spoken (~350-450 words)
**Audience:** Hinge Health hiring team (Lead PM, Robin) + general
**Tone:** Builder-thinking-out-loud, confident but humble about prototype status

---

## 1. Hook (15-20 sec)

> With a hammer in hand, everything looks like a nail.

Right now AI chat is the hammer. It's so useful, so available, that every problem in the world is starting to look like a chatbot.

And sure — a lot of problems *can* be solved that way. But I think the experiences that will actually win aren't the ones that just bolt a chat window onto an old product. They're the ones where the chat is deeply contextual, takes real actions on the user's behalf, and feels like a native part of the experience.

## 2. Why I built this (30-40 sec)

So I built a prototype to test that thesis on something I care about: training to run a sub-three-hour marathon.

I wanted an AI companion that knows my training context — what I ran yesterday, how I'm feeling today, what's coming up — and can actually do something about it. Not a chatbot that suggests I "consider" a recovery day. One that updates my plan when I tell it I played tennis last night and skipped my run. One that re-runs the math on my goal probability when conditions change.

It's a passion project, but it's also a real test of how an AI experience should be designed when the stakes are personal and the data is yours.

## 3. Quick demo (60-90 sec)

*[Screen recording of the app. Narrate over the actions.]*

Here's the prototype. Two panels — chat on the left, dashboard on the right. Same shape as Claude or Cursor, because that's the pattern that works for AI-native tools.

- *[Show top of dashboard]* The three numbers at the top are my readiness signals — they update as the plan and my inputs change.
- *[Show chat]* I can tell it I finished my long run today, and it marks it complete. No form to fill out.
- *[Show plan view]* When I ask it to adjust this week because I'm traveling, it doesn't just give advice — it actually rewrites the plan and shows me how that affects my probability of hitting sub-3.
- *[Show probability/risk numbers update]* That's the living plan idea — it changes as life changes, both directions: the AI suggests adjustments, and I can request them.

## 4. Under the hood (30-45 sec)

A quick note on the build, because this matters: this isn't a custom GPT or a wrapper.

It's a Next.js app talking to the Claude API directly, with Supabase persisting context so the companion remembers who I am across sessions. The actions you just saw — marking runs complete, rewriting the plan — those run through tool use. The model decides when to call a specific, narrow function, and the function does one thing well.

That separation is the point. The conversation is open-ended. The actions are tightly scoped. That's what makes it feel safe enough to let it actually *do* things, not just talk about them.

## 5. Why this matters / close (20-30 sec)

I'm putting this out because I'm applying to lead the product team for Robin at Hinge Health — an AI tool that helps members navigate their care experience. The parallels here are real: consumer journey, conversational interface, AI that has to be helpful in a domain where context and trust matter a lot.

This prototype is a starting point, not a finished product. It has a long way to go. But I built it fast on purpose — to prove the feasibility, feel the seams, and earn the right to talk about how AI products like this should actually be designed.

If you're working on something like this, I'd love to talk.

---

## Delivery notes for the script tool / editor

- The Hinge Health / Robin mention in section 5 is direct. If you want a softer public version (for posting broadly), swap to: *"I'm exploring this for a Lead PM role I'm applying to — an AI consumer experience in healthcare. The parallels are real..."* Keep the direct version for the application itself.
- The hammer line lands best with a small pause after it. Don't rush.
- Section 3 is the most important — keep the demo tight and let the product do the talking. Resist the urge to narrate every UI element.
- "Living plan" and "tool use" are the two concepts that distinguish this from a generic chatbot demo. Make sure both land.
- Closing line is a soft CTA. If you want a harder one: *"Hinge Health team — if you're reading this, I'd love to dig in."*
