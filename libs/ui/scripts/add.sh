#!/usr/bin/env bash
# Usage: libs/ui/scripts/add.sh <component>...
# Runs the shadcn CLI from apps/web (the only place it detects a framework), then moves the
# flat output into components/<name>/index.tsx and rewrites the bare "cn" import.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
DIR="$ROOT/libs/ui/primitives/src/components"
(cd "$ROOT/apps/web" && npx --yes shadcn@latest add "$@" --yes --overwrite)
for name in "$@"; do
  flat="$DIR/$name.tsx"
  [ -f "$flat" ] || continue
  mkdir -p "$DIR/$name"
  mv "$flat" "$DIR/$name/index.tsx"
  sed -i.bak 's#from "cn"#from "@m7/audio-os/shared/utils"#' "$DIR/$name/index.tsx" && rm "$DIR/$name/index.tsx.bak"
  line="export * from './components/$name';"
  grep -qxF "$line" "$ROOT/libs/ui/primitives/src/index.ts" || echo "$line" >> "$ROOT/libs/ui/primitives/src/index.ts"
done
