#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
DIST_DIR="$ROOT_DIR/apps/web/dist"

REMOTE_HOST="audio@audio-os.local"
REMOTE_BASE="/home/audio/web"
APP_SUBDIR="standalone/apps/web"

latest_tarball() {
  ls -t "$DIST_DIR"/deck-*-linux-arm64.tar.gz 2>/dev/null | head -n 1
}

TARBALL="${1:-}"

if [[ -z "$TARBALL" ]]; then
  TARBALL="$(latest_tarball)"
fi

if [[ -z "$TARBALL" || ! -f "$TARBALL" ]]; then
  echo "No tarball found. Build one first or pass the tarball path."
  exit 1
fi

BASENAME="$(basename "$TARBALL")"
RELEASE_ID="$(date -u +%Y%m%dT%H%M%SZ)"

echo "Deploying artifact: $BASENAME"
echo "Remote target: $REMOTE_HOST:$REMOTE_BASE"

ssh "$REMOTE_HOST" "mkdir -p '$REMOTE_BASE/releases'"

scp "$TARBALL" "$REMOTE_HOST:$REMOTE_BASE/$BASENAME"

ssh "$REMOTE_HOST" bash <<EOF
set -euo pipefail

REMOTE_BASE="$REMOTE_BASE"
BASENAME="$BASENAME"
RELEASE_ID="$RELEASE_ID"
APP_SUBDIR="$APP_SUBDIR"

cd "\$REMOTE_BASE"

mkdir -p "releases/\$RELEASE_ID"
tar -xzf "\$BASENAME" -C "releases/\$RELEASE_ID"

if [[ ! -f "releases/\$RELEASE_ID/\$APP_SUBDIR/server.js" ]]; then
  echo "Expected server.js not found at releases/\$RELEASE_ID/\$APP_SUBDIR/server.js"
  exit 1
fi

ln -sfn "releases/\$RELEASE_ID" current
rm -f "\$BASENAME"

echo "Current release -> \$REMOTE_BASE/current"
echo "Server entry -> \$REMOTE_BASE/current/\$APP_SUBDIR/server.js"
EOF

echo "Deploy complete."
echo "Run with:"
echo "ssh $REMOTE_HOST 'cd $REMOTE_BASE/current/$APP_SUBDIR && PORT=3000 node server.js'"