#!/usr/bin/env bash
set -Eeuo pipefail

mkdir -p dist
VERSION=$(date +%Y%m%d-%H%M%S)
tar -czf dist/audio-os-base-$VERSION.tar.gz infra/
echo "Created dist/audio-os-base-$VERSION.tar.gz"
