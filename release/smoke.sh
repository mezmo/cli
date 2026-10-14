#!/usr/bin/env bash
# Checks that a compiled mzm executable runs on this machine: it starts, reports the
# expected version, and opens its settings with this system's sqlite (on macOS the copy
# apple ships, which nothing else in the build runs against)
#
# usage: release/smoke.sh <executable> [expected-version]
set -euo pipefail

BIN="$1"
EXPECTED_VERSION="${2:-}"

# a home directory of its own keeps real settings out of the way.
# A windows executable run from WSL needs it on a windows drive
if [[ "$BIN" == *.exe ]] && command -v wslpath >/dev/null 2>&1; then
  WINDOWS_TEMP=$(cmd.exe /c 'echo %TEMP%' 2>/dev/null | tr -d '\r')
  WORK=$(mktemp -d "$(wslpath -u "$WINDOWS_TEMP")/mzm-smoke-XXXXXX")
  export WSLENV="USERPROFILE/p:NODE_DEBUG${WSLENV:+:$WSLENV}"
else
  WORK=$(mktemp -d)
fi
trap 'rm -rf "$WORK"' EXIT
export HOME="$WORK" USERPROFILE="$WORK"

# an executable that starts but does nothing prints no version
VERSION=$("$BIN" version --quiet | tr -d '\r')
echo "version: $VERSION"
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]] || { echo "not a version: $VERSION" >&2; exit 1; }
if [ -n "$EXPECTED_VERSION" ] && [ "$VERSION" != "$EXPECTED_VERSION" ]; then
  echo "expected version $EXPECTED_VERSION" >&2
  exit 1
fi

# the first run creates the settings database and applies every migration
OUTPUT=$(NODE_DEBUG=config:storage "$BIN" config get core.host.api 2>&1)
echo "$OUTPUT" | grep -i 'sqlite version'
echo "$OUTPUT" | grep -q 'https://' || { echo 'default settings are missing' >&2; exit 1; }
