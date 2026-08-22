# PRD — Goalyst: Product Overview

**Status:** Living document — derived from `docs/plan/goalyst-plan.html`. Update this file when the plan changes; don't let them drift apart.
**Owner:** Yasar Khan
**Last updated:** 2026-08-22

## 1. Problem

Students preparing for a dated goal (NEET/JEE, a state police or SSC exam, a skill, or a habit) run their prep across five disconnected tools: a notes channel, a generic habit tracker with no exam awareness, forum threads for doubts, a study plan nobody re-opens, and AI tutoring that's priced per subject. No single tool owns the full loop: **plan the goal → practice like it's real → coach the gap in between.**

## 2. Product thesis

Goalyst turns any goal into a dated plan, a daily practice loop, and a coach that answers the same question for the hundredth time without getting tired.

| It is NOT | It IS |
|---|---|
| Another PDF library | A goal-first planner that builds the syllabus timeline for you |
| A generic habit app | Milestones and streaks tied to one named, dated goal |
| A question-bank dump | Full timed mocks with the real marking scheme, then a full review |
| A paid-only AI tutor | A coach that's genuinely free at the core, honest about what's rule-based today |

## 3. Target users

| Profile | Need |
|---|---|
| A — NEET/JEE aspirant | A milestone plan that survives falling behind; mocks with real negative marking |
| B — State-exam aspirant (SSC, state police) | A state-wise library of eligibility, pattern, and previous papers — not a NEET-shaped tool relabeled |
| C — Skill-builder | Milestones that manufacture their own deadlines, since there's no external exam date |
| D — Habit-builder | A streak that feels earned, not gamified for its own sake |

## 4. Competitive landscape (summary)

No existing player owns the whole loop — see `docs/plan/goalyst-plan.html` Sheet 04 for the full comparison against Testbook/Adda247 (mocks, no plan or coach), Unacademy/PhysicsWallah (lectures, priced for a full course, one-way), Habitica/Streaks (good streak mechanics, no exam awareness), and ad-hoc ChatGPT/Gemini use (flexible, but forgets the goal every chat).

## 5. Features (see individual PRDs)

| Feature | PRD | Status |
|---|---|---|
| Goal Wizard | `01-goal-wizard.md` | Built |
| Mock Test Engine | `02-mock-test-engine.md` | Built |
| Exam & Papers Library | `03-exam-papers-library.md` | Planned — Term 2 |
| Coach Chat | `04-coach-chat.md` | Rule-based built; AI upgrade Term 3 |
| Streak & Habit Log | `05-streak-habit-log.md` | Built |
| Progress & Review | `06-progress-review.md` | Expanding |
| Peer Leaderboard | `07-peer-leaderboard.md` | Planned |

Non-functional requirements (performance, cost ceilings per term, security, monetization) are in `08-non-functional-requirements.md`.

## 6. Success metrics

| Metric | Target by end of Term 2 |
|---|---|
| Day-7 retention | ≥15% |
| Goals with a 7-day streak | ≥25% |
| Mocks completed / active user / month | ≥2 |
| Coach messages / active user / week | ≥3 |
| Free → premium conversion (once Premium exists, Term 3) | 3–5% |

## 7. Roadmap (terms map to release phases, not fixed calendar dates)

| Term | Ships | Cost |
|---|---|---|
| 1 — Today | Goal wizard, milestone plans, streaks, mood log, rule-based coach | $0/mo |
| 2 — Weeks 2–4 | Rebrand, cross-device accounts, wider mock banks, Exam & Papers Library | $0–20/mo |
| 3 — Month 2–3 | Real AI coach backend (Claude API, server-side, with memory) | $20–100/mo |
| 4 — Month 4+ | Premium tier, native app wrap, first institute pilot | $100–500+/mo |

## 8. Out of scope (for now)

- Live/real-time government vacancy tracking (seat counts, application deadlines) — explicitly deferred; requires a continuously-accurate live data source and carries real liability if wrong. Current scope is static exam pattern + previous papers only.
- Video lectures / live classes — Goalyst is a planning + practice + coaching layer, not a content-delivery competitor to Unacademy/PhysicsWallah.
- Multi-language UI — English-first until there's usage data to justify localization investment.
