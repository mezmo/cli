#!/usr/bin/env bash
# Runs the smoke test against the macos executables in dist that this machine is able to run.
# Has to be run on macos.
#
# usage: release/smoke-darwin.sh [expected-version]
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
DIST="$HERE/../dist"
EXPECTED_VERSION="${1:-}"

if [ "$(uname -s)" != Darwin ]; then
  echo 'error: the macos executables can only be run on macos' >&2
  exit 1
fi

case "$(uname -m)" in
  arm64)
    "$HERE/smoke.sh" "$DIST/mzm-darwin-aarch64" "$EXPECTED_VERSION"

    # apple silicon runs intel executables when rosetta is installed
    if arch -x86_64 /usr/bin/true 2>/dev/null; then
      "$HERE/smoke.sh" "$DIST/mzm-darwin-x86_64" "$EXPECTED_VERSION"
    else
      echo 'WARNING: rosetta is not installed. mzm-darwin-x86_64 was NOT run' >&2
    fi
    ;;
  x86_64)
    "$HERE/smoke.sh" "$DIST/mzm-darwin-x86_64" "$EXPECTED_VERSION"
    echo 'WARNING: this is an intel mac. mzm-darwin-aarch64 was NOT run' >&2
    ;;
  *)
    echo "error: unexpected architecture $(uname -m)" >&2
    exit 1
    ;;
esac
