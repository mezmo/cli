#!/usr/bin/env bash
# Runs a compiled mzm executable through the things that differ between operating systems.
# Nothing here needs an access key, and the settings of the person running it are left alone.
#
# usage: release/smoke.sh <executable> [expected-version]
#
# environment:
#   SMOKE_OFFLINE=1            skip the steps that reach github
#   SMOKE_UPGRADE_VERSION=x    release to replace a copy of the executable with.
#                              The newest release that is not its own version by default
set -euo pipefail

BIN="${1:-}"
EXPECTED_VERSION="${2:-}"

if [ -z "$BIN" ] || [ ! -f "$BIN" ]; then
  echo "usage: release/smoke.sh <executable> [expected-version]" >&2
  exit 2
fi

NAME=mzm
WSL_EXE=false
case "$BIN" in
  *.exe)
    NAME=mzm.exe
    # a windows executable started from wsl has to live on a windows drive
    if command -v wslpath >/dev/null 2>&1; then
      WSL_EXE=true
    else
      case "$(uname -s)" in
        MINGW*|MSYS*|CYGWIN*) ;;
        *)
          echo "error: $BIN is a windows executable, and this is $(uname -s)." >&2
          echo 'Run this from windows (Git Bash) or from WSL' >&2
          exit 2
          ;;
      esac
    fi
    ;;
esac

if [ "$WSL_EXE" = true ]; then
  WINDOWS_TEMP=$(cmd.exe /c 'echo %TEMP%' 2>/dev/null | tr -d '\r')
  WORK=$(mktemp -d "$(wslpath -u "$WINDOWS_TEMP")/mzm-smoke-XXXXXX")
else
  WORK=$(mktemp -d "${TMPDIR:-/tmp}/mzm-smoke-XXXXXX")
fi

cleanup() {
  rm -rf "$WORK" 2>/dev/null || true
}
trap cleanup EXIT

# a home directory of its own keeps real settings out of the way
mkdir -p "$WORK/home" "$WORK/bin" "$WORK/cwd"
export HOME="$WORK/home"
export USERPROFILE="$WORK/home"
if [ "$WSL_EXE" = true ]; then
  export WSLENV="USERPROFILE/p:NODE_DEBUG:NO_COLOR${WSLENV:+:$WSLENV}"
fi
export NO_COLOR=1
unset MZM_ACCESS_KEY

# the executable is always run from a copy, the way an installed one would be
MZM="$WORK/bin/$NAME"
cp "$BIN" "$MZM"
chmod +x "$MZM"

# anything it finds in the working directory must be ignored
cd "$WORK/cwd"
printf 'SMOKE_DOTENV=loaded\n' > .env
printf 'preload = ["./preload.ts"]\n' > bunfig.toml
printf 'console.log("SMOKE_PRELOAD")\n' > preload.ts

STEP=0
step() {
  STEP=$((STEP + 1))
  printf '\n[%d] %s\n' "$STEP" "$1"
}

fail() {
  printf 'FAILED: %s\n' "$1" >&2
  exit 1
}

echo "executable: $BIN"
echo "system:     $(uname -sm)"
if command -v sw_vers >/dev/null 2>&1; then
  echo "macos:      $(sw_vers -productVersion)"
fi

step 'starts and prints help'
OUTPUT=$("$MZM" --help)
echo "$OUTPUT" | grep -q 'Usage:' || fail 'help output is missing the usage line'
if echo "$OUTPUT" | grep -q 'SMOKE_PRELOAD'; then
  fail 'bunfig.toml in the working directory was loaded'
fi

step 'reports its version'
VERSION=$("$MZM" version --quiet | tr -d '\r')
echo "$VERSION"
echo "$VERSION" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+' || fail "not a version: $VERSION"
if [ -n "$EXPECTED_VERSION" ] && [ "$VERSION" != "$EXPECTED_VERSION" ]; then
  fail "expected version $EXPECTED_VERSION"
fi

step 'generates shell completions'
"$MZM" completions bash | grep -q 'mzm' || fail 'no completions were generated'

step 'creates its settings and reads them back'
# the first run creates the database and applies every migration with this system's sqlite
NODE_DEBUG=config:storage "$MZM" config get core.host.api 2>&1 | grep -i 'sqlite version' || fail 'sqlite version was not reported'
"$MZM" config set core.smoke.number 42
"$MZM" config set core.smoke.text 'hello world'
"$MZM" config get core.smoke.number | grep -q '42' || fail 'number setting was not read back'
"$MZM" config get core.smoke.text | grep -q 'hello world' || fail 'text setting was not read back'
"$MZM" config get core.host.api | grep -q 'https://' || fail 'default settings are missing'

step 'explains a missing access key'
set +e
OUTPUT=$("$MZM" get account 2>&1)
STATUS=$?
set -e
[ "$STATUS" -ne 0 ] || fail 'expected a failure without an access key'
echo "$OUTPUT" | grep -q 'MZM_ACCESS_KEY' || fail '.env in the working directory may have been loaded'

if [ "${SMOKE_OFFLINE:-}" = 1 ]; then
  printf '\nSMOKE_OFFLINE is set. Skipping the upgrade steps\n'
  printf '\nsmoke test passed: %s\n' "$BIN"
  exit 0
fi

step 'lists the releases it can upgrade to'
RELEASES=$("$MZM" upgrade --list-versions | tr -d '\r' | awk '/^v[0-9]+\.[0-9]+\.[0-9]+/ {print substr($1, 2)}')
[ -n "$RELEASES" ] || fail 'no releases were listed'
echo "$RELEASES" | head -3

# The executable under test is newer than anything published, so there is never a
# release for it to move up to. What is being checked is that it can swap itself for
# another executable on this system, which a move to any other release does.
# Asking for the version it already is does nothing, and reports success
UPGRADE_VERSION="${SMOKE_UPGRADE_VERSION:-}"
if [ -z "$UPGRADE_VERSION" ]; then
  UPGRADE_VERSION=$(echo "$RELEASES" | awk -v current="$VERSION" '$0 != current {print; exit}')
fi
[ -n "$UPGRADE_VERSION" ] || fail "no release other than $VERSION to swap with"
[ "$UPGRADE_VERSION" != "$VERSION" ] || fail "the executable is already version $VERSION. Nothing would be swapped"

step "replaces itself with release $UPGRADE_VERSION"
BEFORE=$(cksum < "$MZM")
# the progress spinner is kept out of the build log unless something goes wrong
if ! "$MZM" upgrade --version "$UPGRADE_VERSION" > "$WORK/upgrade.log" 2>&1; then
  cat "$WORK/upgrade.log" >&2
  fail 'the upgrade command reported a failure'
fi

[ -f "$MZM" ] || fail 'the executable is gone after the upgrade'
AFTER=$(cksum < "$MZM")
[ "$BEFORE" != "$AFTER" ] || fail 'the upgrade command reported success, but the executable was not replaced'

# the executable that was put in place has to run, and be the release that was asked for
UPGRADED=$("$MZM" version --quiet 2>/dev/null | tr -d '\r')
echo "$VERSION -> $UPGRADED"
[ "$UPGRADED" = "$UPGRADE_VERSION" ] || fail "expected version $UPGRADE_VERSION after the upgrade"

printf '\nsmoke test passed: %s\n' "$BIN"
