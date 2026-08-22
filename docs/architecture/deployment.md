# Deployment

Staged to match the roadmap's cost ceilings in `docs/prd/00-overview.md`. Pipeline (GitHub → Jenkins → Docker → deploy target) stays the same across terms; only the deploy target changes.

## Pipeline shape (all terms)

Three Jenkins jobs, not one — full detail in `jenkins-setup.md`. Summary:

1. Push to `main` — `goalyst-build` picks it up (Poll SCM today; a webhook once Jenkins has a public address, see `jenkins-setup.md`).
2. `goalyst-build` runs: install → lint → test → `next build` → Docker build (`infra/docker/Dockerfile.web`) → push to `ghcr.io/<org>/goalyst-web`, tagged by git SHA. This is the only job that ever builds an image.
3. `goalyst-build` triggers `goalyst-deploy-dev` automatically, passing that image tag.
4. `goalyst-deploy-dev` pulls and runs that exact tag against Dev, then health-checks it. It never rebuilds.
5. `goalyst-deploy-prod` is triggered manually (that click is the production approval), pulls the same tag, deploys to the current term's target (below), and health-checks it.

## Term 1–2 — single VM

- **Target:** One small VM — Oracle Cloud "Always Free" ARM instance (genuinely free) or a $6/mo DigitalOcean droplet if Oracle's free tier isn't available in your region.
- **Runtime:** `docker compose up -d` on the VM, behind Caddy or Nginx for automatic TLS.
- **Why:** Keeps Term 2's $0–20/mo ceiling intact. No managed-service bill yet.
- **`goalyst-deploy-prod`'s deploy step:** SSH into the VM, pull the new image, `docker compose up -d`, verify the health check endpoint responds.

## Term 3+ — managed containers

- **Target:** AWS ECS Fargate or GCP Cloud Run (pick one — don't run both).
- **Why:** Term 3 introduces the AI coach's usage-based cost; a managed, auto-scaling container platform means infra cost tracks actual usage instead of a fixed VM sized for peak load. No server patching either.
- **`goalyst-deploy-prod`'s deploy step:** call the provider's deploy API/CLI (`aws ecs update-service` or `gcloud run deploy`) with the image tag `goalyst-build` already pushed.

## Term 4 — add a CDN

- **Add:** Cloudflare in front of the deployed service for the institute-pilot traffic spikes and static asset caching.
- **Reconsider:** A managed Postgres upgrade if Supabase's tier is outgrown; this is a data-layer decision, not a deploy-target decision, and should get its own doc if/when it comes up.

## What does NOT change

- Registry (ghcr.io), CI tool (Jenkins), and container format (Docker) stay constant across all terms — only the runtime target moves up the stack as cost/scale demands it. This avoids a pipeline rewrite at every term boundary.
