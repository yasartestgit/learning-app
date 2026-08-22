# PRD — Non-Functional Requirements

## Cost ceilings (must not be exceeded without a conscious decision)

| Term | Ceiling |
|---|---|
| 1 | $0/mo |
| 2 | $0–20/mo |
| 3 | $20–100/mo |
| 4 | $100–500+/mo |

Any change that pushes a term over its ceiling (e.g. a Supabase tier upgrade, a Claude API usage spike) needs an explicit call-out before merging, not a surprise on the next bill.

## Security

- The Claude API key and all coach prompt logic live server-side only (Next.js API routes) — never in client-shipped code. See `docs/architecture/tech-stack.md`.
- Supabase row-level security is mandatory on every table holding student data — one student must never be able to read another's goals, mocks, or chat history via a misconfigured query.
- Payment data (Term 4, Razorpay) is never stored directly — handled via Razorpay's hosted checkout/tokenization.

## Privacy

- Peer Leaderboard participation is opt-in only (see `07-peer-leaderboard.md`).
- Coach Chat's use of a student's goal/history data for AI memory (Term 3) requires clear consent, since this is minors' educational data in many cases.

## Performance

- Goal Wizard: goal creation completes in ≤2 minutes of user interaction (see `01-goal-wizard.md`).
- Mock Test Engine: timer accuracy must not drift — a mock's countdown is the core trust mechanic for exam-condition practice.

## Monetization tiers (for reference — full detail in the plan, Sheet 11)

| Tier | Price | Includes |
|---|---|---|
| Free — always | ₹0 | Goal planning, milestones, streaks, limited mocks, rule-based coach |
| Premium — Term 3+ | ₹99–199/mo | Unlimited mocks, AI coach with memory, priority doubt-solving, full analytics |
| Institute license — later | Negotiated | White-label/co-branded, sold once there's real usage data |

The free tier must stay genuinely useful indefinitely — it's the trust mechanism the whole GTM strategy (`docs/plan/goalyst-plan.html`, Sheet 13) depends on.

## Success metrics (tracking requirement)

Every metric in `00-overview.md` section 6 needs actual instrumentation (event logging) before Term 2 ends — a target with no measurement isn't a target.
