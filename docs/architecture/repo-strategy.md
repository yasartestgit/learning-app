# Repo Strategy — Monorepo

**Decision:** Monorepo. One GitHub repo holds `apps/`, `packages/`, `docs/`, and `infra/`.

## Why

- One product, one builder, one release cadence. Separate repos pay off when different teams own different services with independent versioning — that's not the current situation.
- The Next.js app already unifies frontend and API routes into one deployable unit. Splitting repos would add cross-repo PR-syncing overhead for no ownership benefit.
- The Term 4 native wrap (Capacitor) wraps the *same* web build — it isn't a separate codebase, so it doesn't need a separate repo.
- Jenkins can still scope pipelines by changed path within a monorepo (only rebuild/deploy what changed) — monorepo doesn't mean "always build everything."

## When to reconsider

Split a piece into its own repo only when it has genuinely separate:
- **Ownership** — a dedicated team or contractor owns it end to end.
- **Release cadence** — it ships on a different schedule than the main app (e.g. a content-only admin tool that content editors deploy without touching product code).
- **Runtime** — it's not a Next.js app at all (e.g. a future native-only codebase that isn't just a Capacitor wrap).

None of these apply as of this plan (Term 1–2). Revisit at Term 4 if the institute-pilot or native-app work grows a dedicated owner.
