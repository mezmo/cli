#!/usr/bin/env node
'use strict'

// Prints the version semantic-release would release next, or nothing when
// there is no change that calls for a release.
//
// Only the commit analyzer is loaded, so nothing is changed or published.
// The logging of semantic-release goes to stderr, leaving stdout as the version.
//
// usage: release/next-version.js [repository-url]

const {branches, parserOpts, releaseRules} = require('../release.config.cjs')

const [repository_url] = process.argv.slice(2)
const options = {
  dryRun: true
, ci: false
, branches: branches
, plugins: [
    ['@semantic-release/commit-analyzer', {parserOpts, releaseRules}]
  ]
}

if (repository_url) options.repositoryUrl = repository_url

// semantic-release is ESM only
import('semantic-release').then(async ({default: semanticRelease}) => {
  const result = await semanticRelease(options, {
    stdout: process.stderr
  , stderr: process.stderr
  })

  if (result) console.log(result.nextRelease.version)
}).catch((err) => {
  console.error(err)
  process.exitCode = 1
})
