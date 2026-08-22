# Goalyst

Goal-first exam prep and coaching app for Indian students. Turns any goal — an exam, a skill, a habit — into a dated plan, a daily practice loop, and a coach.

## Repo layout

```
apps/web/           Next.js app (frontend + API routes) — the whole product lives here
packages/shared/    Code shared between the web app and the future native wrap
docs/plan/          The product plan (Goalyst Product Plan, published as an artifact)
docs/prd/           Feature-by-feature PRDs derived from the plan
docs/architecture/  Tech stack, repo strategy, and deployment decisions
infra/docker/       Dockerfile(s) and docker-compose for local + deployed containers
infra/jenkins/      Jenkins pipelines — build.Jenkinsfile, deploy-dev.Jenkinsfile, deploy-prod.Jenkinsfile
```

This is a **monorepo** — one product, one builder, one release cadence today. See `docs/architecture/repo-strategy.md` for why, and when to reconsider.

## Where to start

- Product plan: `docs/plan/goalyst-plan.html` (open in a browser)
- What to build, feature by feature: `docs/prd/`
- What it runs on: `docs/architecture/tech-stack.md`
- How it ships: `docs/architecture/deployment.md`
