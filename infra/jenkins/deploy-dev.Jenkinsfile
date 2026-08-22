// Job: goalyst-deploy-dev
// Jenkins job config: Pipeline, Script Path = infra/jenkins/deploy-dev.Jenkinsfile
//
// Deploys an already-built image to Dev — runs on this same Jenkins agent's own
// machine, so no SSH. Never builds from source; only pulls IMAGE_TAG and runs it.
// Normally triggered automatically by goalyst-build's last stage, but can also be
// run manually (Build with Parameters) to redeploy a specific tag to Dev.

pipeline {
  agent any

  parameters {
    string(name: 'IMAGE_TAG', defaultValue: '', description: 'Image tag to deploy, e.g. abc12345 — see the goalyst-build job that produced it')
  }

  environment {
    IMAGE_NAME = "ghcr.io/${env.GITHUB_ORG}/goalyst-web"
  }

  options {
    timeout(time: 10, unit: 'MINUTES')
  }

  stages {
    stage('Validate') {
      steps {
        script {
          if (!params.IMAGE_TAG?.trim()) {
            error 'IMAGE_TAG parameter is required — pass the tag from the goalyst-build job you want on Dev.'
          }
        }
      }
    }

    stage('Checkout') {
      steps {
        // Only need infra/docker/docker-compose.yml from the repo — no npm install here.
        checkout scm
      }
    }

    stage('Deploy to Dev') {
      steps {
        // Port 3001 so it doesn't collide with `npm run dev` on 3000.
        sh """
          IMAGE=${IMAGE_NAME}:${params.IMAGE_TAG} HOST_PORT=3001 ENV_FILE=../../apps/web/.env.dev \
            docker compose -p goalyst-dev -f infra/docker/docker-compose.yml pull
          IMAGE=${IMAGE_NAME}:${params.IMAGE_TAG} HOST_PORT=3001 ENV_FILE=../../apps/web/.env.dev \
            docker compose -p goalyst-dev -f infra/docker/docker-compose.yml up -d
        """
      }
    }

    stage('Health Check') {
      steps {
        sh 'curl -sf http://localhost:3001/api/health || (echo "Dev health check failed" && exit 1)'
      }
    }
  }

  post {
    failure {
      echo 'Dev deploy or health check failed — check the stage above.'
    }
  }
}
