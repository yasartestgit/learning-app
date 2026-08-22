// Job: goalyst-build
// Jenkins job config: Pipeline, Script Path = infra/jenkins/build.Jenkinsfile
//
// Builds, tests, and pushes exactly one immutable Docker image per commit —
// this is the ONLY job in the three that ever runs `docker build`. Every
// downstream deploy job (deploy-dev, deploy-prod, ...) takes that same image
// tag as a parameter and only pulls + runs it. Never let a deploy job build
// from source — that's what breaks "what Dev tested is what Prod runs."
//
// On success, auto-triggers goalyst-deploy-dev with this build's image tag.
// goalyst-deploy-prod is never triggered from here — see deploy-prod.Jenkinsfile.
//
// Requires Jenkins credential 'ghcr-credentials' (GitHub username + a PAT with
// write:packages) and a global env var GITHUB_ORG.

pipeline {
  agent any

  environment {
    IMAGE_NAME = "ghcr.io/${env.GITHUB_ORG}/goalyst-web"
    IMAGE_TAG  = "${env.GIT_COMMIT.take(8)}"
  }

  options {
    timeout(time: 20, unit: 'MINUTES')
  }

  triggers {
    // Jenkins is running on localhost today, so GitHub can't reach it to push a
    // webhook — poll instead. Once Jenkins has a public address (tunnel, or moved
    // onto the Prod VM — see docs/architecture/jenkins-setup.md), delete this
    // and add `githubPush()` here instead for instant, push-based triggers.
    // Only this job polls — the deploy jobs are triggered by this one, not by SCM.
    pollSCM('H/5 * * * *')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Lint') {
      steps {
        dir('apps/web') {
          sh 'npm ci'
          sh 'npm run lint'
        }
      }
    }

    stage('Test') {
      steps {
        dir('apps/web') {
          sh 'npm test'
        }
      }
    }

    stage('Build') {
      steps {
        dir('apps/web') {
          sh 'npm run build'
        }
      }
    }

    // A docs-only or PRD-only commit stops here — nothing below affects what's
    // deployed, so there's nothing worth building an image or triggering a deploy for.
    stage('Docker Build & Push') {
      when {
        // No `branch 'main'` check here — this is a plain Pipeline job (not
        // Multibranch), pinned to main via the job's own SCM config, so
        // env.BRANCH_NAME is never set and that condition would silently
        // always evaluate false. The changeset check is what actually matters.
        anyOf {
          changeset "apps/web/**"
          changeset "infra/docker/**"
        }
      }
      steps {
        sh "docker build -f infra/docker/Dockerfile.web -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
        withCredentials([usernamePassword(credentialsId: 'ghcr-credentials', usernameVariable: 'GHCR_USER', passwordVariable: 'GHCR_TOKEN')]) {
          sh 'echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin'
          sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
          sh "docker push ${IMAGE_NAME}:latest"
        }
        script {
          // Shown in the Jenkins build list — copy this tag when manually
          // triggering goalyst-deploy-prod later.
          currentBuild.description = "Image: ${IMAGE_TAG}"
        }
      }
    }

    stage('Trigger Dev Deploy') {
      when {
        // No `branch 'main'` check here — this is a plain Pipeline job (not
        // Multibranch), pinned to main via the job's own SCM config, so
        // env.BRANCH_NAME is never set and that condition would silently
        // always evaluate false. The changeset check is what actually matters.
        anyOf {
          changeset "apps/web/**"
          changeset "infra/docker/**"
        }
      }
      steps {
        build job: 'goalyst-deploy-dev', wait: false, parameters: [
          string(name: 'IMAGE_TAG', value: env.IMAGE_TAG)
        ]
      }
    }
  }

  post {
    failure {
      echo 'Build failed — check the stage above for the first failure. No image was pushed and no deploy was triggered.'
    }
  }
}
