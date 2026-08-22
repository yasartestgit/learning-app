// Job: goalyst-deploy-prod
// Jenkins job config: Pipeline, Script Path = infra/jenkins/deploy-prod.Jenkinsfile
//
// Deploys an already-built image to Prod, over SSH. Deliberately NOT
// auto-triggered by anything — this job has no `triggers` block. Someone
// manually running "Build with Parameters" on this specific job *is* the
// production approval gate. Restrict who can trigger it via Jenkins' own
// project-based authorization (Manage Jenkins > Security), not in this file.
//
// Requires Jenkins credential 'deploy-vm-ssh' (SSH private key) and env vars
// GITHUB_ORG, PROD_HOST (the Prod VM's address).

pipeline {
  agent any

  parameters {
    string(name: 'IMAGE_TAG', defaultValue: '', description: 'Image tag to deploy, e.g. abc12345 — check it worked on Dev first')
  }

  environment {
    IMAGE_NAME = "ghcr.io/${env.GITHUB_ORG}/goalyst-web"
  }

  options {
    timeout(time: 15, unit: 'MINUTES')
  }

  stages {
    stage('Validate') {
      steps {
        script {
          if (!params.IMAGE_TAG?.trim()) {
            error 'IMAGE_TAG parameter is required — deploy the tag you already verified on Dev, not a guess.'
          }
        }
      }
    }

    stage('Deploy to Prod') {
      steps {
        // Assumes /opt/goalyst on the Prod VM is a checkout of this repo, kept
        // in sync with a git pull, so infra/docker/docker-compose.yml and the
        // real apps/web/.env.prod (never committed) are both present there.
        sshagent(credentials: ['deploy-vm-ssh']) {
          sh """
            ssh -o StrictHostKeyChecking=no deploy@\$PROD_HOST '
              cd /opt/goalyst &&
              git pull &&
              IMAGE=${IMAGE_NAME}:${params.IMAGE_TAG} HOST_PORT=80 ENV_FILE=/opt/goalyst/apps/web/.env.prod \
                docker compose -p goalyst-prod -f infra/docker/docker-compose.yml pull &&
              IMAGE=${IMAGE_NAME}:${params.IMAGE_TAG} HOST_PORT=80 ENV_FILE=/opt/goalyst/apps/web/.env.prod \
                docker compose -p goalyst-prod -f infra/docker/docker-compose.yml up -d
            '
          """
        }
      }
    }

    stage('Health Check') {
      steps {
        sh 'curl -sf http://$PROD_HOST/api/health || (echo "Prod health check failed" && exit 1)'
      }
    }
  }

  post {
    failure {
      echo 'Prod deploy or health check failed — check the stage above.'
    }
  }
}
