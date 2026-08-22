# PRD — Coach Chat

**Status:** Rule-based version built (Term 1); AI upgrade planned Term 3
**Depends on:** Goal Wizard (reads/writes milestone dates); Claude API (Term 3 only)

## Summary

A chat interface a student can ask about their prep at any time. Rule-based today — free at this tier, always. Genuine memory-holding AI (Claude API, server-side) is the Term 3 upgrade, not a bait-and-switch: the free rule-based tier keeps working regardless.

## User stories

- As a student, I want to ask a real question about my prep and get a specific next step, not a canned pep talk.
- As a student who's fallen behind, I want the coach to offer to adjust my milestone plan, not just sympathize.
- As a student, I want to know clearly whether I'm talking to a rule-based responder or a real AI, so trust isn't built on a false premise.

## Functional requirements (Term 1 — rule-based)

- FR1: Coach MUST recognize a small set of intent patterns (e.g. "I'm behind on X," "what should I study today") and respond with a specific, actionable suggestion tied to the student's actual goal data — not a generic string.
- FR2: When a suggestion involves changing the plan (e.g. shifting milestone dates), the coach MUST surface an explicit confirm action (e.g. "Yes, shift dates" / "No, I'll catch up") — never silently mutate the plan.
- FR3: The free tier of Coach Chat MUST remain available after the Term 3 AI upgrade ships — it does not get pulled behind a paywall.

## Functional requirements (Term 3 — AI upgrade)

- FR4: The Claude API key and all prompt/system-instruction logic MUST be held server-side only — never shipped to the client (see `docs/architecture/tech-stack.md`).
- FR5: The AI coach MUST have access to the student's goal and history data (with the student's consent) to hold genuine memory across sessions, not just within one chat.
- FR6: Rate-limiting and usage tracking MUST be in place before this ships publicly, since this is the first feature with a real per-use cost (see Term 3 cost line in the roadmap, `00-overview.md`).

## Acceptance criteria

- Given a student says they're behind on a topic, when the coach responds, then the response names the specific topic and proposes a concrete plan change with an explicit confirm/decline choice.
- Given the Term 3 AI coach is live, when a free-tier student opens Coach Chat, then they still get a working (rule-based or capped-AI) response — the free tier is never a dead end.

## Success metric tie-in

Coach messages / active user / week ≥3 (from `00-overview.md`) is the signal this feature is replacing a forum tab rather than sitting idle as a demo.
