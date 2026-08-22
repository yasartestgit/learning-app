# Tech Stack

Mirrors `docs/plan/goalyst-plan.html` Sheet 09 — keep both in sync if this changes.

| Layer | Tool | Why |
|---|---|---|
| Frontend | React (Next.js) | One codebase for the web app; component layer carries over cleanly into the Capacitor wrap later |
| Backend & API | Next.js API routes | Serverless by default — no separate backend service to run or pay for at this scale |
| Database & auth | Supabase (Postgres) | Free tier covers Term 1–2; relational tables fit goals → milestones → mocks naturally; row-level security isolates student data |
| AI coach (Term 3) | Claude API, server-side | Held server-side only — API key and prompt logic never ship to the client |
| Hosting & deploys | See `deployment.md` — staged, not fixed to one provider | Cost ceiling per term drives the choice |
| CI/CD | Jenkins | Per user decision — builds, tests, builds Docker image, pushes to registry, triggers deploy |
| Container registry | GitHub Container Registry (ghcr.io) | Free, colocated with source, no extra credential to manage in Jenkins |
| Payments (Term 4) | Razorpay | Built for ₹ subscriptions and UPI — the standard choice for an India-first product; Stripe's India coverage falls short |
| Native wrap (Term 4) | Capacitor | Wraps the existing web app for Play Store/App Store without a separate native rewrite |

## Source control

GitHub, monorepo (see `repo-strategy.md`).

## Local development

- `docker compose -f infra/docker/docker-compose.yml up` runs the web app in a container matching production.
- Supabase local dev via the Supabase CLI (not containerized here — it manages its own local Postgres/auth stack).
