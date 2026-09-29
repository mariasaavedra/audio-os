#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=false
for arg in "$@"; do
  [[ "$arg" == "--dry-run" ]] && DRY_RUN=true
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

OUT_DIR="$ROOT_DIR/apps/web/dist/artifact-out"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TARBALL="$ROOT_DIR/apps/web/dist/web-${TIMESTAMP}-linux-arm64.tar.gz"

DEPLOY_SCRIPT="$SCRIPT_DIR/deploy-artifact.sh"

echo "Artifact timestamp: $TIMESTAMP"
echo "Building Linux ARM64 artifact..."

run rm -rf "$OUT_DIR"
run mkdir -p "$OUT_DIR"

run docker buildx build \
  --platform linux/arm64 \
  -f "$SCRIPT_DIR/../Dockerfile.artifact" \
  --output "type=local,dest=$OUT_DIR" \
  "$ROOT_DIR"

echo "Validating artifact contents..."
if ! $DRY_RUN; then
  test -f "$OUT_DIR/standalone/apps/web/server.js"
  test -d "$OUT_DIR/standalone/apps/web/public"
  test -d "$OUT_DIR/standalone/apps/web/.next/static"
else
  echo "[dry-run] would check: $OUT_DIR/standalone/apps/web/{server.js,public,.next/static}"
fi

echo "Packaging artifact..."
run mkdir -p "$(dirname "$TARBALL")"
run tar -czf "$TARBALL" -C "$OUT_DIR" standalone
run rm -rf "$OUT_DIR"

echo "Artifact ready: $TARBALL"
echo
echo "Deploy with:"
echo "bash \"$DEPLOY_SCRIPT\" \"$TARBALL\""
