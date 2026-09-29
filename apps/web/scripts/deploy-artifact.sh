#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=false
TARBALL=""
for arg in "$@"; do
  [[ "$arg" == "--dry-run" ]] && DRY_RUN=true || TARBALL="$arg"
done

run() {
  if $DRY_RUN; then
    echo "[dry-run] $*"
  else
    "$@"
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
DIST_DIR="$ROOT_DIR/apps/web/dist"

REMOTE_HOST="audio@audio-os.local"
REMOTE_BASE="/home/audio/web"
APP_SUBDIR="standalone/apps/web"
SERVICE_NAME="web"

latest_tarball() {
  ls -t "$DIST_DIR"/web-*-linux-arm64.tar.gz 2>/dev/null | head -n 1 || true
}

if [[ -z "$TARBALL" ]]; then
  TARBALL="$(latest_tarball)"
fi

if [[ -z "$TARBALL" || ! -f "$TARBALL" ]]; then
  if $DRY_RUN; then
    echo "[dry-run] No tarball found in $DIST_DIR — would fail here in a real run."
    TARBALL="<tarball-not-yet-built>"
  else
    echo "No tarball found. Build one first or pass the tarball path."
    exit 1
  fi
fi

BASENAME="$(basename "$TARBALL")"
RELEASE_ID="$(date -u +%Y%m%dT%H%M%SZ)"

echo "Deploying artifact: $BASENAME"
echo "Remote target:      $REMOTE_HOST:$REMOTE_BASE"
echo "Release ID:         $RELEASE_ID"
echo "Service:            $SERVICE_NAME"
echo

run ssh "$REMOTE_HOST" "mkdir -p '$REMOTE_BASE/releases'"
run scp "$TARBALL" "$REMOTE_HOST:$REMOTE_BASE/$BASENAME"

if $DRY_RUN; then
  echo "[dry-run] would ssh $REMOTE_HOST and run:"
  echo "  mkdir -p $REMOTE_BASE/releases/$RELEASE_ID"
  echo "  tar -xzf $BASENAME -C $REMOTE_BASE/releases/$RELEASE_ID"
  echo "  verify $REMOTE_BASE/releases/$RELEASE_ID/$APP_SUBDIR/server.js exists"
  echo "  ln -sfn $REMOTE_BASE/.env.local $REMOTE_BASE/releases/$RELEASE_ID/$APP_SUBDIR/.env.local"
  echo "  (warn if $REMOTE_BASE/.env.local is missing)"
  echo "  ln -sfn $REMOTE_BASE/releases/$RELEASE_ID $REMOTE_BASE/current"
  echo "  rm $REMOTE_BASE/$BASENAME"
else
  ssh "$REMOTE_HOST" bash <<EOF
set -euo pipefail

cd "$REMOTE_BASE"

mkdir -p "releases/$RELEASE_ID"
tar -xzf "$BASENAME" -C "releases/$RELEASE_ID"

if [[ ! -f "releases/$RELEASE_ID/$APP_SUBDIR/server.js" ]]; then
  echo "Expected server.js not found at releases/$RELEASE_ID/$APP_SUBDIR/server.js"
  exit 1
fi

if [[ -f "$REMOTE_BASE/.env.local" ]]; then
  ln -sfn "$REMOTE_BASE/.env.local" "releases/$RELEASE_ID/$APP_SUBDIR/.env.local"
  echo "Linked .env.local into release"
else
  echo "WARNING: $REMOTE_BASE/.env.local not found — MOPIDY_RPC_URL will be unset"
fi

ln -sfn "releases/$RELEASE_ID" current
rm -f "$BASENAME"

echo "Current release -> $REMOTE_BASE/current"
echo "Server entry    -> $REMOTE_BASE/current/$APP_SUBDIR/server.js"
EOF
fi

if $DRY_RUN; then
  echo "[dry-run] would check if systemd service '$SERVICE_NAME' exists and restart it"
elif ssh "$REMOTE_HOST" "systemctl list-unit-files | grep -q '^${SERVICE_NAME}\.service'"; then
  echo "Restarting systemd service: $SERVICE_NAME"
  ssh "$REMOTE_HOST" "sudo systemctl restart $SERVICE_NAME"
  ssh "$REMOTE_HOST" "sudo systemctl --no-pager --full status $SERVICE_NAME || true"
else
  echo "No systemd service named '$SERVICE_NAME' found. Skipping restart."
fi

echo
echo "Deploy complete."
echo "Run manually with:"
echo "ssh $REMOTE_HOST 'cd $REMOTE_BASE/current/$APP_SUBDIR && PORT=3000 node server.js'"
