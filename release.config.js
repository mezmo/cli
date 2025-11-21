'use strict'

const templates = require('./release/templates/index.js')
const commit = require('./release/commit.js')
const constants = require('./release/constants.js')
const now = new Date()
const year = now.getFullYear()
const day = String(now.getDate()).padStart(2, '0')
const month = String(now.getMonth() + 1).padStart(2, '0')

module.exports = {
  branches: ['main']
, npmPublish: false
, tarballDir: 'dist'
, parserOpts: {
    noteKeywords: ['BREAKING CHANGES', 'BREAKING CHANGE', 'BREAKING']
  , headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/
  , breakingHeaderPattern: constants.BREAKING_HEADER_REGEX
  , headerCorrespondence: ['type', 'scope', 'subject']
  , issuePrefixes: ['#', 'gh-']
  , referenceActions: [
      'close', 'closes', 'closed', 'fix'
    , 'fixes', 'fixed', 'resolve', 'resolves'
    , 'resolved', 'ref'
    ]
  }
, writerOpts: {
    transform: commit.transform
  , commitPartial: templates.commit
  }
, releaseRules: [
    {breaking: true, release: 'major'}
  , {type: 'build', release: 'patch'}
  , {type: 'ci', release: 'patch'}
  , {type: 'chore', release: 'patch'}
  , {type: 'doc', release: 'patch'}
  , {type: 'feat', release: 'minor'}
  , {type: 'fix', release: 'patch'}
  , {type: 'lib', release: 'patch'}
  , {type: 'perf', release: 'minor'}
  , {type: 'refactor', release: 'patch'}
  , {type: 'style', release: 'patch'}
  , {type: 'test', release: 'patch'}
  ]
, plugins: [
    ['@semantic-release/commit-analyzer', null]
  , ['@semantic-release/release-notes-generator', null]
  , ['@semantic-release/changelog', {
      changelogTitle: '## Changelog'
    }]
  , ['@semantic-release/exec', {
      "verifyConditionsCmd": "deno task compile:local"
    , "prepareCmd": "deno task compile"
    }]
  , ['@semantic-release/exec', {
      "prepareCmd": "release/shasum.sh"
    }]
  , ['@semantic-release/npm', null]
  , ['@semantic-release/git', {
      assets: ['package.json', 'CHANGELOG.md', '!**/node_modules/**']
    , message: `release: ${year}-${month}-${day}, `
        + 'Version <%= nextRelease.version %> [skip ci]'
    }]
  , ['@semantic-release/github', {
      assets: [
        'dist/*'
      ]
    }]
  ]
}
