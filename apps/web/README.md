# apps/web

The Goalyst web app — Next.js (App Router, TypeScript). Frontend and API routes in one deployable unit.

## Getting started

```bash
cp .env.local.example .env.local   # fill in Supabase + API keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Health check

`GET /api/health` returns `{ "status": "ok" }`. Required by `infra/docker/docker-compose.yml`'s healthcheck and the Jenkins pipeline's post-deploy check — don't remove or rename it without updating both.

## Where things come from

- Every feature here should trace back to a PRD in `../../docs/prd/`. If a feature doesn't have one yet, write it first.
- Tech choices (Supabase, Claude API, etc.) are decided in `../../docs/architecture/tech-stack.md`.
- Deployed via Docker + Jenkins, not Vercel's git-push deploy — see `../../docs/architecture/deployment.md` for why and how.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (also run by Jenkins and the Dockerfile) |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
