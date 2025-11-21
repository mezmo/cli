library 'magic-butler-catalogue'

def PROJECT_NAME = 'mezmo-cli'
def DEFAULT_BRANCH = 'main'
def CURRENT_BRANCH = [env.CHANGE_BRANCH, env.BRANCH_NAME]?.find{branch -> branch != null}
def BRANCH_ACTUAL = env.CHANGE_BRANCH ? env.CHANGE_BRANCH : env.BRANCH_NAME
def RELEASE_ID = (DEFAULT_BRANCH == BRANCH_ACTUAL) ? env.CHANGE_ID : ''
def TRIGGER_PATTERN = ".*@logdnabot.*"
def DRY_RUN = CURRENT_BRANCH != DEFAULT_BRANCH
def BUILD_SLUG = slugify(env.BUILD_TAG)

pipeline {
  agent {
    node {
      label 'ec2-fleet'
      customWorkspace("/tmp/workspace/${BUILD_SLUG}")
    }
  }

  options {
    timestamps()
    timeout time: 1, unit: 'HOURS'
    ansiColor 'xterm'
  }

  triggers {
    issueCommentTrigger(TRIGGER_PATTERN)
  }

  environment {
    GITHUB_TOKEN = credentials('github-api-token')
    LAST_COMMITTER = sh(script: 'git log -1 --format=%ae', returnStdout: true).trim()
    GIT_BRANCH = "${DRY_RUN ? BRANCH_ACTUAL : env.GIT_BRANCH}"
    BRANCH_NAME = "${DRY_RUN ? BRANCH_ACTUAL : env.BRANCH_NAME}"
    CHANGE_ID = "${DRY_RUN ? '' : CHANGE_ID}"
    BUILD_TAG = "${BUILD_SLUG}"
  }

  tools {
    nodejs 'NodeJS 22'
  }

  stages {
    stage('Validate PR Source') {
      when {
        expression { env.CHANGE_FORK }
        not {
          triggeredBy 'issueCommentCause'
        }
      }
      steps {
        error("A maintainer needs to approve this PR for CI by commenting")
      }
    }
   

    stage('Install') {
      steps {
        sh 'deno install'
      }
    }

    stage('Test') {
      steps {
        sh 'deno task reports'
      }
      post {
        always {
          withChecks('Tests') {
            junit checksName: 'Test Results', testResults: 'coverage/test.xml', allowEmptyResults: true
          }
          publishHTML target: [
            allowMissing: false,
            alwaysLinkToLastBuild: false,
            keepAll: true,
            reportDir: 'coverage/lcov-report',
            reportFiles: 'index.html',
            reportName: "coverage-node-v${NODE_VERSION}"
          ]
        }
      }
    }

    stage ('Release') {
      steps {
        script {
          if (DRY_RUN) {
            sh "echo release dry run ${BRANCH_NAME}"
            sh "npm run release:dry"
          } else {
            sh "npm run release"
          }
        }
      }
    }
  }
}
