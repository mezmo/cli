#!/usr/bin/env bash
# Signs macos executables with the Developer ID certificate, and optionally has apple notarize them.
# Has to be run on macos.
#
# usage: release/sign-darwin.sh <executable> [executable...]
#
# environment:
#   ADHOC=1               sign without a certificate, with the same hardened runtime and
#                         entitlements. For builds of code that is not merged, which never get the
#                         certificate. An ad-hoc signed executable cannot be notarized
#   APPLE_CERT_P12        location of the Developer ID Application certificate (.p12)
#   APPLE_CERT_PASSWORD   password of the certificate
#   SIGNING_KEYCHAIN      location for a keychain that only exists while this runs
#   NOTARIZE=1            submit each executable to apple and wait for it to be accepted
#   NOTARY_APPLE_ID       apple id used to notarize    (with NOTARIZE=1)
#   NOTARY_PASSWORD       app specific password for it (with NOTARIZE=1)
#   NOTARY_TEAM_ID        developer team id            (with NOTARIZE=1)
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
ENTITLEMENTS="$HERE/entitlements.plist"

require() {
  local value
  eval "value=\${$1:-}"
  if [ -z "$value" ]; then
    echo "error: $1 is required" >&2
    exit 1
  fi
}

if [ "$(uname -s)" != Darwin ]; then
  echo 'error: executables can only be signed on macos' >&2
  exit 1
fi

if [ "$#" -eq 0 ]; then
  echo 'usage: release/sign-darwin.sh <executable> [executable...]' >&2
  exit 2
fi

if [ "${ADHOC:-}" = 1 ]; then
  if [ "${NOTARIZE:-}" = 1 ]; then
    echo 'error: an ad-hoc signed executable cannot be notarized' >&2
    exit 1
  fi
else
  require APPLE_CERT_P12
  require APPLE_CERT_PASSWORD
  require SIGNING_KEYCHAIN
fi

if [ "${NOTARIZE:-}" = 1 ]; then
  require NOTARY_APPLE_ID
  require NOTARY_PASSWORD
  require NOTARY_TEAM_ID
fi

WORK=$(mktemp -d "${TMPDIR:-/tmp}/mzm-sign-XXXXXX")

cleanup() {
  # the certificate does not outlive the signing
  if [ "${ADHOC:-}" != 1 ]; then
    security delete-keychain "$SIGNING_KEYCHAIN" 2>/dev/null || true
  fi
  rm -rf "$WORK"
}
trap cleanup EXIT

if [ "${ADHOC:-}" = 1 ]; then
  # no certificate and no keychain. There is no secure timestamp without an identity
  IDENTITY=-
  TIMESTAMP=--timestamp=none
else
  # the keychain is thrown away, and so is its password
  KEYCHAIN_PASSWORD=$(openssl rand -hex 24)
  security create-keychain -p "$KEYCHAIN_PASSWORD" "$SIGNING_KEYCHAIN"
  security set-keychain-settings "$SIGNING_KEYCHAIN"
  security unlock-keychain -p "$KEYCHAIN_PASSWORD" "$SIGNING_KEYCHAIN"
  # shellcheck disable=SC2046
  security list-keychains -d user -s "$SIGNING_KEYCHAIN" $(security list-keychains -d user | sed 's/"//g')
  security import "$APPLE_CERT_P12" -f pkcs12 -k "$SIGNING_KEYCHAIN" -P "$APPLE_CERT_PASSWORD" -T /usr/bin/codesign
  security set-key-partition-list -S apple-tool:,apple: -k "$KEYCHAIN_PASSWORD" "$SIGNING_KEYCHAIN" >/dev/null

  IDENTITY=$(security find-identity -v -p codesigning "$SIGNING_KEYCHAIN" | awk '/Developer ID Application/ {print $2; exit}')
  if [ -z "$IDENTITY" ]; then
    echo 'error: no valid Developer ID Application identity in the keychain' >&2
    security find-identity -p codesigning "$SIGNING_KEYCHAIN" >&2
    exit 1
  fi
  TIMESTAMP=--timestamp
fi

for BIN in "$@"; do
  echo "signing $BIN"
  # replaces the signature the executable was compiled with
  codesign --force "$TIMESTAMP" --options runtime \
    --entitlements "$ENTITLEMENTS" \
    --sign "$IDENTITY" \
    "$BIN"
  codesign --verify --strict -vvv "$BIN"

  if [ "${NOTARIZE:-}" != 1 ]; then continue; fi

  echo "notarizing $BIN"
  ARCHIVE="$WORK/$(basename "$BIN").zip"
  LOG="$WORK/$(basename "$BIN").notary.log"
  ditto -c -k "$BIN" "$ARCHIVE"
  xcrun notarytool submit "$ARCHIVE" \
    --apple-id "$NOTARY_APPLE_ID" \
    --password "$NOTARY_PASSWORD" \
    --team-id "$NOTARY_TEAM_ID" \
    --wait 2>&1 | tee "$LOG"

  if ! grep -q 'status: Accepted' "$LOG"; then
    echo "error: notarization was not accepted for $BIN" >&2
    exit 1
  fi
done
