# Jenkins Setup

## Job structure: one job per pipeline concern, not per code package

Three Jenkins Pipeline jobs, each pointed at a different file in `infra/jenkins/`:

| Jenkins job name | Script path | Triggered by |
|---|---|---|
| `goalyst-build` | `infra/jenkins/build.Jenkinsfile` | Poll SCM (see below) |
| `goalyst-deploy-dev` | `infra/jenkins/deploy-dev.Jenkinsfile` | Automatically, by `goalyst-build`'s last stage |
| `goalyst-deploy-prod` | `infra/jenkins/deploy-prod.Jenkinsfile` | Manually only — nothing auto-triggers this one |

Create each as a Jenkins **Pipeline** job (not Multibranch — one repo, one branch that matters, `main`), with **Pipeline script from SCM** pointed at this repo and the Script Path set per the table above.

This is split by *pipeline concern* (build vs. deploy-to-X), not by code package — there's still exactly one deployable unit (`apps/web`) today. Splitting further by package (e.g. a separate job per feature) would isolate nothing and just be overhead; see `repo-strategy.md` for the same reasoning applied to the source repo itself.

**When to add a fourth job:** each new environment gets one more `deploy-<env>.Jenkinsfile` + Jenkins job, shaped like `deploy-dev.Jenkinsfile` or `deploy-prod.Jenkinsfile` depending on whether it should auto-trigger or require a manual click. Same pattern, no restructuring needed.

## Environments: build once, promote the same image — never rebuild per job

This is the one rule that has to survive any amount of job-splitting: **`goalyst-build` is the only job that ever runs `docker build`.** It builds one image per commit, tags it immutably by git SHA (`IMAGE_TAG`), and pushes it to `ghcr.io` once. Every deploy job downstream takes that tag as a **parameter** and only pulls + runs it — it never rebuilds from source. If a deploy job ever built its own image, "it passed on Dev" would stop meaning anything about what Prod is about to run.

| | Dev | Prod |
|---|---|---|
| Job | `goalyst-deploy-dev` | `goalyst-deploy-prod` |
| Where | This Jenkins agent's own machine (your laptop) | A separate VM, over SSH |
| Trigger | Automatic — `goalyst-build` calls it with the new `IMAGE_TAG` | Manual — you run "Build with Parameters" yourself |
| Port | 3001 (3000 is `npm run dev`) | 80 |
| Env file | `apps/web/.env.dev` (local, gitignored) | `/opt/goalyst/apps/web/.env.prod` on the VM (gitignored, never leaves that machine) |
| Docker Compose project name | `goalyst-dev` | `goalyst-prod` |

Dev needs no SSH at all — Jenkins already runs on that machine, so `deploy-dev.Jenkinsfile` is just a local `docker compose up -d`. Fine for a solo builder: zero cost, instant feedback. The tradeoff to revisit later: Dev only exists while your laptop is on, and nobody else can reach it — once a second person (e.g. the subject-matter reviewer or design partner from the plan's Team sheet) needs to test against Dev remotely, either tunnel it the same way as Jenkins itself, or move it to a small VM.

**Gotcha if Jenkins itself runs inside a container (ours does):** `deploy-dev.Jenkinsfile`'s pipeline steps execute *inside the Jenkins container*, but the Dev container it deploys gets created via the host's Docker socket — so it's a sibling on the real host, not nested inside Jenkins' own network namespace. `localhost:3001` from a Jenkins pipeline step is Jenkins' own loopback, not the real host's. The health check step uses `host.docker.internal:3001` (Docker Desktop's built-in DNS name for the real host) instead — don't "fix" it back to `localhost` if you ever touch that stage.

**Production approval, with separate jobs, is simpler than an in-pipeline gate:** `goalyst-deploy-prod` has no trigger at all — the only way anything reaches Prod is you manually starting that specific job and typing/pasting the image tag (visible in `goalyst-build`'s build description, or copy it from a successful `goalyst-deploy-dev` run). Restrict *who* can trigger that job via Jenkins' own project-based authorization (**Manage Jenkins → Security**) if anyone besides you ever gets access to this Jenkins instance — the Jenkinsfile itself can't enforce that.

## Triggering `goalyst-build` with Jenkins on localhost

GitHub can't push a webhook to `http://localhost:8080` — it's not internet-reachable. Three options, matched to how far along you are. Note: only `goalyst-build` needs a trigger at all — the deploy jobs are triggered by `goalyst-build` (Dev) or by hand (Prod), never by SCM directly.

### 1. Poll SCM — what's configured now

`build.Jenkinsfile` has:

```groovy
triggers {
  pollSCM('H/5 * * * *')
}
```

Jenkins checks GitHub for new commits every 5 minutes and runs `goalyst-build` if there are any. No exposure, no extra setup — works immediately on a localhost Jenkins. The tradeoff is a build can lag up to 5 minutes behind a push, not instant.

### 2. Tunnel (ngrok / Cloudflare Tunnel) — for testing instant triggers now

Gives your local Jenkins a temporary public URL so a real GitHub webhook can reach it:

```bash
ngrok http 8080
```

Then in the GitHub repo: **Settings → Webhooks → Add webhook**, payload URL `https://<ngrok-id>.ngrok.io/github-webhook/`, content type `application/json`, event: `Just the push event`. Swap `build.Jenkinsfile`'s `pollSCM` trigger for `githubPush()` while testing this. Free-tier ngrok URLs change on restart, so this is a "try it out" path, not a permanent setup.

### 3. Move Jenkins onto the Prod VM — do this by Term 2

The Prod VM in `deployment.md` already exists once Term 2 starts. Running Jenkins there instead of a laptop:

- Gives Jenkins a stable public (or at least static) address, so a real GitHub webhook works without a tunnel.
- Means `goalyst-deploy-prod` no longer needs to SSH out anywhere — it can run `docker compose up -d` locally, one less credential (`deploy-vm-ssh`) to manage.
- `goalyst-deploy-dev` deliberately keeps depending on your laptop being on — that's fine, it's still true even after this move (Dev and the Jenkins agent that builds are two different concerns; only where Jenkins *itself* lives is changing here).

When this happens: swap `pollSCM('H/5 * * * *')` for `githubPush()` in `build.Jenkinsfile`, and add the real webhook in GitHub pointed at the VM's address.

## Credentials and environment variables these pipelines expect

| Name | Type | Used by | For |
|---|---|---|---|
| `ghcr-credentials` | Jenkins credential — username + password (GitHub username + a PAT with `write:packages`) | `goalyst-build` | Pushing images to `ghcr.io` |
| `deploy-vm-ssh` | Jenkins credential — SSH private key | `goalyst-deploy-prod` | Deploying to the Prod VM (see option 3 above — goes away once Jenkins lives on that VM) |
| `GITHUB_ORG` | Env var (global) | All three jobs | Building the `ghcr.io/<org>/goalyst-web` image name |
| `PROD_HOST` | Env var (global) | `goalyst-deploy-prod` | The Prod VM's address — used for both the SSH deploy and the post-deploy health check |
