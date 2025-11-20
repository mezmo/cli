'use strict'

const COMMIT_TYPES = new Map([
  ['build', 'Build System']
, ['chore', 'Chores']
, ['ci', 'Continuous Integration']
, ['doc', 'Documentation']
, ['default', 'Miscellaneous']
, ['feat', 'Features']
, ['fix', 'Bug Fixes']
, ['lint', 'Lint']
, ['perf', 'Performance Improvements']
, ['refactor', 'Code Refactoring']
, ['revert', 'Reverts']
, ['style', 'Style']
, ['test', 'Tests']
])

module.exports = {
  typeOf
, transform
}

function typeOf(type) {
  return COMMIT_TYPES.get(type) || COMMIT_TYPES.get('default')
}

function transform(commit) {
  const output = {...commit}
  output.notes = [...(commit.notes ?? [])]
  output.type = typeOf(commit.type)
  output.shortHash = commit.hash.substring(0, 7)

  for (const note of output.notes) {
    note.title = '**BREAKING CHANGES**'
  }
  return output
}
