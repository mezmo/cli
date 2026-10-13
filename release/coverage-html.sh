#!/usr/bin/env bash
# Turns the lcov report from the test run into the html report published by the build.
# bun does not write an html report itself. genhtml comes with the lcov package
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
COVERAGE="$HERE/../coverage"

if ! command -v genhtml >/dev/null 2>&1; then
  echo 'genhtml is not installed. Skipping the html coverage report'
  exit 0
fi

genhtml --quiet "$COVERAGE/lcov.info" --output-directory "$COVERAGE/html"
