library 'magic-butler-catalogue'

def PROJECT_NAME = 'mezmo-cli'
def DEFAULT_BRANCH = 'main'
def TRIGGER_PATTERN = ".*@logdnabot.*"
def CURRENT_BRANCH = [env.CHANGE_BRANCH, env.BRANCH_NAME]?.find{branch -> branch != null}
def BRANCH_ACTUAL = env.CHANGE_BRANCH ? env.CHANGE_BRANCH : env.BRANCH_NAME
def CHANGE_ID = env.CHANGE_ID == null ? '' : env.CHANGE_ID
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
    // bun keeps the runtimes it downloads for cross compiling in ~/.bun by default,
    // which is shared by every job on the agent
    BUN_INSTALL_CACHE_DIR = "${WORKSPACE}/.bun/cache"
  }

  tools {
    nodejs 'NodeJS 22'
    bun 'Bun 1.4'
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
        sh 'bun --version'
        sh 'bun install --frozen-lockfile'
      }
    }

    stage('Test') {
      steps {
        sh 'bun run reports'
      }
      post {
        always {
          withChecks('Tests') {
            junit checksName: 'Tests', testResults: 'coverage/test.xml', allowEmptyResults: true
          }
          // the html report is only written when genhtml (lcov) is installed on the agent
          publishHTML target: [
            allowMissing: true,
            alwaysLinkToLastBuild: false,
            keepAll: true,
            reportDir: 'coverage/html',
            reportFiles: 'index.html',
            reportName: "coverage-${BUILD_SLUG}"
          ]
        }
      }
    }

    stage('Release Version') {
      when {
        expression { !DRY_RUN }
      }
      steps {
        script {
          // Empty when nothing on the branch calls for a release
          env.NEXT_RELEASE_VERSION = sh(
            script: 'npm run --silent release:version',
            returnStdout: true
          ).trim()

          echo env.NEXT_RELEASE_VERSION ? "Release version: ${env.NEXT_RELEASE_VERSION}" : 'No release version determined'
        }
      }
    }

    stage('Build') {
      steps {
        // The executables report the version found in release.json. It is
        // written before package.json is updated for the release, so the
        // version is handed over. Without one, the version in package.json is used
        sh 'release/write-info "${NEXT_RELEASE_VERSION:-}"'
        sh 'bun run compile'
        sh 'release/smoke.sh ./mzm "${NEXT_RELEASE_VERSION:-}"'

        stash(
          name: 'release-artifacts',
          includes: 'dist/**, release.json',
          allowEmpty: false
        )
      }
    }

    // The macos executables are cross compiled on linux, where they cannot be
    // run. This stage runs them, signs them, and runs them again
    stage('Darwin') {
      agent {
        node {
          label 'ec2-fleet-oss-macos'
          customWorkspace("/tmp/workspace/${BUILD_SLUG}-darwin")
        }
      }

      environment {
        SIGNING_KEYCHAIN = "/tmp/mzm-signing-${BUILD_SLUG}.keychain-db"
      }

      steps {
        unstash 'release-artifacts'

        // As they were compiled, before the signing certificate is anywhere near this machine
        sh 'release/smoke-darwin.sh "${NEXT_RELEASE_VERSION:-}"'

        script {
          // Signed on every build so a problem with signing fails a pull request
          // rather than a release. Only a release is sent to apple to be notarized
          def notarize = !DRY_RUN && env.NEXT_RELEASE_VERSION
          def credentials = [
            certificate(
              credentialsId: 'apple-signing-certificate',
              keystoreVariable: 'APPLE_CERT_P12',
              passwordVariable: 'APPLE_CERT_PASSWORD'
            )
          ]

          if (notarize) {
            credentials.add(string(credentialsId: 'apple-notarytool-password', variable: 'NOTARY_PASSWORD'))
          }

          withCredentials(credentials) {
            withEnv([
              'NOTARY_APPLE_ID=apps+dev@logdna.com',
              'NOTARY_TEAM_ID=TT7664HMU3',
              "NOTARIZE=${notarize ? '1' : '0'}"
            ]) {
              // the keychain holding the certificate is removed before this returns
              sh 'release/sign-darwin.sh dist/mzm-darwin-x86_64 dist/mzm-darwin-aarch64'
            }
          }
        }

        // What is released. The hardened runtime they are signed with is in effect here
        sh 'release/smoke-darwin.sh "${NEXT_RELEASE_VERSION:-}"'

        stash(
          name: 'darwin-artifacts',
          includes: 'dist/mzm-darwin-*',
          allowEmpty: false
        )
      }

      post {
        always {
          sh 'security delete-keychain "$SIGNING_KEYCHAIN" 2>/dev/null || true'
          sh 'rm -rf dist'
        }
      }
    }

    stage ('Release') {
      steps {
        // replaces the macos executables in dist with the signed ones
        unstash 'darwin-artifacts'

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
