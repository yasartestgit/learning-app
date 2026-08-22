# Deployment

Staged to match the roadmap's cost ceilings in `docs/prd/00-overview.md`. Pipeline (GitHub → Jenkins → Docker → deploy target) stays the same across terms; only the deploy target changes.

## Pipeline shape (all terms)

1. Push to `main` (or a merged PR) triggers Jenkins via a GitHub webhook.
2. Jenkins runs: install → lint → test → `next build`.
3. Jenkins builds a Docker image (`infra/docker/Dockerfile.web`) and tags it with the git SHA.
4. Jenkins pushes the image to `ghcr.io/<org>/goalyst-web`.
5. Jenkins deploys the new image to the current term's target (below) and runs a health check before considering the deploy complete.

## Term 1–2 — single VM

- **Target:** One small VM — Oracle Cloud "Always Free" ARM instance (genuinely free) or a $6/mo DigitalOcean droplet if Oracle's free tier isn't available in your region.
- **Runtime:** `docker compose up -d` on the VM, behind Caddy or Nginx for automatic TLS.
- **Why:** Keeps Term 2's $0–20/mo ceiling intact. No managed-service bill yet.
- **Jenkins deploy step:** SSH into the VM, pull the new image, `docker compose up -d`, verify the health check endpoint responds.

## Term 3+ — managed containers

- **Target:** AWS ECS Fargate or GCP Cloud Run (pick one — don't run both).
- **Why:** Term 3 introduces the AI coach's usage-based cost; a managed, auto-scaling container platform means infra cost tracks actual usage instead of a fixed VM sized for peak load. No server patching either.
- **Jenkins deploy step:** Push image to the registry, then call the provider's deploy API/CLI (`aws ecs update-service` or `gcloud run deploy`) with the new image tag.

## Term 4 — add a CDN

- **Add:** Cloudflare in front of the deployed service for the institute-pilot traffic spikes and static asset caching.
- **Reconsider:** A managed Postgres upgrade if Supabase's tier is outgrown; this is a data-layer decision, not a deploy-target decision, and should get its own doc if/when it comes up.

## What does NOT change

- Registry (ghcr.io), CI tool (Jenkins), and container format (Docker) stay constant across all terms — only the runtime target moves up the stack as cost/scale demands it. This avoids a pipeline rewrite at every term boundary.
