# apps/web

The Next.js app — frontend and API routes for Goalyst. Not scaffolded yet.

When you're ready to start building:

```
npx create-next-app@latest . --typescript --app --src-dir --import-alias "@/*"
```

Run from inside `apps/web/`, then wire up:
- Supabase client (`docs/architecture/tech-stack.md`)
- `/api/health` endpoint — required by `infra/docker/docker-compose.yml` and the Jenkins pipeline's health check
- Feature work should trace back to a PRD in `docs/prd/` — if a feature doesn't have one yet, write it first
