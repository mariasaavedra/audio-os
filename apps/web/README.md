# apps/web

Next.js web player interface for controlling a [Mopidy](https://mopidy.com/) music server via the audio-os service.

## Overview

This app provides a browser-based UI for playback control, playlist browsing, and track search. It communicates with Mopidy through the `@m7/mopidy` library (in `libs/mopidy/`) and exposes its own REST-style API routes consumed by React Query hooks on the client.

## Features

- Playback controls: play, pause, resume, stop, next, previous, seek
- Shuffle queue
- Current track display with album artwork and metadata
- Real-time playback state (polling every 2 seconds)
- Playlist browsing with pagination
- Track search with infinite scroll
- Dark UI with dynamic blurred artwork background

## Development

> Commands can be run from the monorepo root or this directory.

```bash
# From monorepo root
npm run dev         # starts dev server at http://localhost:3000

# From this directory
npm run dev
npm run build
npm run start
npm run start:standalone   # serve the standalone production build
npm run lint
```

### Prerequisites

The app requires a running Mopidy instance accessible at the configured RPC URL. By default this points to `http://audio-os.local:6680/mopidy/rpc`. Update `MOPIDY_RPC_URL` in [next.config.ts](next.config.ts) to change the target.

## Architecture

```
app/
  page.tsx                   # Home — playback widget
  playlists/page.tsx          # Playlist browser
  playlists/[id]/page.tsx     # Playlist detail
  search/page.tsx             # Search results
  api/
    audio/route.ts            # GET: playback snapshot, POST: playback actions
    playlists/route.ts        # GET: list playlists
    playlists/[id]/route.ts   # GET: paginated playlist tracks
    search/route.ts           # GET: paginated search results

lib/audio/
  contract.ts    # Normalized domain types (camelCase)
  snapshot.ts    # Transforms raw Mopidy data → PlaybackSnapshot
  handlers.ts    # Orchestrates Mopidy calls for each action
  api.ts         # Client-side fetch wrappers
  hooks.ts       # TanStack Query hooks (usePlayback, usePlaybackAction, …)
  playlists.ts   # Playlist normalization (server-only)
  search.ts      # Search logic (server-only)
  errors.ts      # Maps errors to HTTP responses

components/
  playback/      # Playback controls and progress bar
  playlists/     # Playlist list and detail views
  search/        # Search input and results
```

**Data flow:** UI components call React Query hooks → hooks call fetch functions in `api.ts` → API routes call server-side Mopidy helpers → Mopidy client in `lib/mopidy.ts` sends JSON-RPC to audio-os.

Raw Mopidy wire types (snake_case) are normalized into app domain types (camelCase) in `lib/audio/snapshot.ts` and related files, so components never see raw Mopidy data.

## Key Technologies

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16 (App Router) | Framework, API routes, standalone build |
| React | 19 | UI |
| TypeScript | 5 | Type safety (strict mode) |
| TanStack Query | 5 | Server state, polling, mutations |
| Tailwind CSS | 4 | Styling |
| `@m7/mopidy` | 0.0.1 | Internal Mopidy JSON-RPC client |

## Configuration

**[next.config.ts](next.config.ts)** contains four key settings:

| Option | Value | Why |
|---|---|---|
| `transpilePackages` | `['@m7/mopidy']` | The internal library lives in `libs/mopidy/` as raw TypeScript; Next.js must transpile it since it isn't pre-compiled. |
| `output` | `'standalone'` | Produces a self-contained build in `.next/standalone/` that includes only the Node.js files needed to run the server — no `node_modules` install required on the target device. |
| `env.MOPIDY_RPC_URL` | `http://audio-os.local:6680/mopidy/rpc` | Bakes the Mopidy JSON-RPC endpoint into the build. Change this before building if your audio-os device is at a different address. |
| `outputFileTracingRoot` | monorepo root (`../../`) | Next.js's file tracing normally only crawls within the app directory. Setting this to the repo root ensures the standalone bundle correctly includes files imported from `libs/mopidy/` outside `apps/web/`. |

Other configuration:
- **Path alias**: `@/*` maps to the `apps/web` root (defined in `tsconfig.json`)

## API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/audio` | Current playback snapshot |
| POST | `/api/audio` | Execute a playback action (`play`, `pause`, `resume`, `stop`, `next`, `previous`, `seek`, `shuffle`) |
| GET | `/api/playlists` | List all playlists |
| GET | `/api/playlists/[id]` | Paginated playlist tracks |
| GET | `/api/search?q=…` | Paginated track search (50 items per page) |

All responses use the envelope `{ ok: boolean, data?: T, error?: string }`.

## Deployment

The app is deployed as a self-contained tarball to the `audio-os.local` device (a Linux ARM64 machine running the Mopidy server).

### How it works

**[Dockerfile.artifact](Dockerfile.artifact)** is a multi-stage Docker build that produces only the build output — no runtime image:

1. **`deps` stage** — installs npm dependencies via `npm ci` using only the `package.json`/`package-lock.json` files from the monorepo root and both workspace packages.
2. **`builder` stage** — copies the full source and runs `npm run build -w apps/web` to produce the Next.js standalone output.
3. **`artifact` stage** — uses `scratch` (empty base image) and copies only the standalone build directory. Docker's `--output type=local` extracts this to the host filesystem without creating a runnable image.

**[scripts/package-artifact.sh](scripts/package-artifact.sh)** drives the full build-and-package flow:

```bash
npm run build -w apps/web   # or use the script directly:
bash apps/web/scripts/package-artifact.sh
```

What the script does:
1. Runs `docker buildx build --platform linux/arm64` targeting `Dockerfile.artifact`, exporting the standalone directory to `apps/web/dist/artifact-out/`.
2. Validates the expected output files are present (`server.js`, `public/`, `.next/static/`).
3. Packages everything into a timestamped tarball: `apps/web/dist/deck-<TIMESTAMP>-linux-arm64.tar.gz`.
4. Cleans up the intermediate output directory.
5. Prints an `scp` command to copy the tarball to `audio@audio-os.local`.

### Deploying to audio-os

```bash
bash apps/web/scripts/package-artifact.sh
# then copy the printed scp command and run it, e.g.:
scp apps/web/dist/deck-20260417T120000Z-linux-arm64.tar.gz audio@audio-os.local:/home/audio/
```

On the device, extract and start the server:

```bash
tar -xzf deck-*.tar.gz
node standalone/apps/web/server.js
```
