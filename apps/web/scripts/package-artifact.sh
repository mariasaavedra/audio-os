#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"

OUT_DIR="$ROOT_DIR/apps/web/dist/artifact-out"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TARBALL="$ROOT_DIR/apps/web/dist/deck-${TIMESTAMP}-linux-arm64.tar.gz"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

echo "Artifact timestamp: $TIMESTAMP"
echo "Building Linux ARM64 artifact..."

docker buildx build \
  --platform linux/arm64 \
  -f "$SCRIPT_DIR/../Dockerfile.artifact" \
  --output "type=local,dest=$OUT_DIR" \
  "$ROOT_DIR"

echo "Validating artifact contents..."

test -f "$OUT_DIR/standalone/apps/web/server.js"
test -d "$OUT_DIR/standalone/apps/web/public"
test -d "$OUT_DIR/standalone/apps/web/.next/static"

echo "Packaging artifact..."

mkdir -p "$(dirname "$TARBALL")"
tar -czf "$TARBALL" -C "$OUT_DIR" standalone

rm -rf "$OUT_DIR"

echo "Artifact ready: $TARBALL"
echo "Deploy with:"
echo "scp \"$TARBALL\" deck@deck.local:/home/deck/"
