# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**This is a monorepo** for applications and libraries that interact with the **audio-os** service (a separate server that runs the Mopidy music server).

**Apps:**
- `apps/web` - Next.js web player interface

**Libraries:**
- `libs/mopidy` - Type-safe Mopidy RPC client library (1:1 mapping to Mopidy Core API)
- `libs/feature` - Feature modules (shell, library, playback, search) with React components
- `libs/shared` - Shared domain types, utilities, and constants
- `libs/ui` - Reusable UI component library

This monorepo is designed to host multiple apps and shared libraries that communicate with the audio-os service.

**Key technologies:**
- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- TanStack Query (React Query) for data fetching
- Tailwind CSS 4
- npm workspaces for monorepo management

## Monorepo Structure

```
apps/
  web/                    # Next.js frontend application
libs/
  mopidy/                 # Type-safe Mopidy RPC client library
  feature/
    shell/                # App shell (sidebar, top bar)
    library/              # Playlist and album browsing components
    playback/             # Playback control components
    search/               # Search interface components
  shared/
    types/                # Domain types (NormalizedTrack, PlaybackSnapshot, etc.)
    utils/                # Shared utility functions
    constants/            # Shared constants
    infra/                # Infrastructure scripts for Raspberry Pi deployment
  ui/                     # Reusable UI primitives (pending implementation)
```

Path aliases are configured in `tsconfig.base.json`:
- `@m7/audio-os/mopidy` → `libs/mopidy/src/index.ts`
- `@m7/audio-os/feature/{module}` → `libs/feature/{module}/src/index.ts`
- `@m7/audio-os/shared/{module}` → `libs/shared/{module}/src/index.ts`
- `@m7/audio-os/ui/{module}` → `libs/ui/src/{module}/index.ts`

## Development Commands

All commands are workspace-aware. The root package.json provides convenience scripts, but you can also use explicit workspace flags.

**Run development server:**
```bash
npm run dev                      # convenience script (runs in apps/web)
npm run dev -w apps/web          # explicit workspace
npm run dev --workspace=apps/web # verbose form
```
This starts the Next.js dev server at http://localhost:3000

**Build for production:**
```bash
npm run build                      # convenience script (builds apps/web)
npm run build -w apps/web          # explicit workspace
npm run build --workspace=apps/web # verbose form
```
Creates a standalone Next.js build with postbuild scripts that copy static assets.

**Start production server:**
```bash
npm run start              # convenience script (uses next start)
npm run start:standalone   # uses standalone build (from apps/web)
```

**Type checking:**
```bash
npm run typecheck              # entire monorepo
npm run typecheck:web          # apps/web only
npm run typecheck:mopidy       # libs/mopidy only
npm run typecheck:feature      # libs/feature only
npm run typecheck:ui           # libs/ui only
npm run typecheck:shared       # libs/shared only
```
Runs TypeScript compiler in no-emit mode across specified packages.

**Linting:**
```bash
npm run lint -w apps/web
```

**Working with individual packages:**
```bash
# Run commands in specific workspace
npm run <script> -w apps/web
npm run <script> -w libs/mopidy
npm run <script> -w libs/feature
npm run <script> -w libs/shared
npm run <script> -w libs/ui

# Install dependencies in specific workspace
npm install <package> -w apps/web
npm install <package> -w libs/mopidy
```

**Clean all dependencies:**
```bash
npm run clean
```
Removes all node_modules and package-lock.json files across the monorepo.

## Architecture

### Data Flow Pattern

The application follows a layered architecture to separate concerns:

1. **Mopidy Client Layer** (`libs/mopidy/`)
   - Low-level JSON-RPC client that mirrors Mopidy Core API 1:1
   - Returns raw wire types (snake_case, nullable fields)
   - Services: `playback`, `queue`, `playlists`, `history`, `library`
   - See `libs/mopidy/README.md` for full API documentation

2. **Shared Domain Layer** (`libs/shared/`)
   - `types/`: Normalized domain types (camelCase, app-oriented)
     - `NormalizedTrack`: Simplified track representation
     - `PlaybackSnapshot`: Current playback state with track, position, and artwork
     - `PlaybackActionRequest`: Union type for all playback actions
     - `PlaylistSummary` / `PlaylistDetail`: Playlist representations
   - `utils/`: Shared utility functions
   - `constants/`: Shared constants
   - `infra/`: Infrastructure scripts for Raspberry Pi audio-os deployment

3. **Audio Business Logic** (`apps/web/lib/audio/`)
   - `contract.ts`: Re-exports domain types from `libs/shared/types` (migration in progress)
   - `snapshot.ts`: Transforms raw Mopidy data into `PlaybackSnapshot`
   - `handlers.ts`: Action handlers that orchestrate Mopidy calls
   - `api.ts`: Client-side fetch functions
   - `hooks.ts`: React Query hooks (`usePlayback`, `usePlaybackAction`, `usePlaylists`, etc.)
   - `playlists.ts`: Playlist fetching logic
   - `search.ts`: Search functionality
   - `encoding.ts`: URI encoding utilities
   - `errors.ts`: Error handling utilities

4. **API Routes** (`apps/web/app/api/`)
   - `/api/audio` (GET): Returns current playback snapshot
   - `/api/audio` (POST): Executes playback actions
   - `/api/playlists` (GET): List playlists
   - `/api/playlists/[id]` (GET): Get playlist tracks (paginated)
   - `/api/search` (GET): Search tracks (paginated)

5. **Feature Components** (`libs/feature/`)
   - `shell/`: App shell components (sidebar, top bar)
   - `library/`: Playlist and album browsing components (playlist-list, playlist-detail, album-card, track-row)
   - `playback/`: Playback control components
   - `search/`: Search interface components with infinite scroll

6. **UI Primitives** (`libs/ui/`)
   - Reusable UI component library (in early stages)

### Server-Side vs Client-Side

- **Server-only code**: Mopidy client instantiation happens in `apps/web/lib/mopidy.ts` (uses `'server-only'`)
- **Client-side code**: All components and hooks are client components (`'use client'`)
- **State management**: TanStack Query manages server state with polling (`refetchInterval: 2000`)

### Configuration

**Connecting to audio-os**: Set `MOPIDY_RPC_URL` as a server-side environment variable. It is read at request time in `apps/web/lib/mopidy.ts` and never baked into the client bundle.

For local development, create `apps/web/.env.local`:
```
MOPIDY_RPC_URL=http://audio-os.local:6680/mopidy/rpc
```

For production, inject the variable via systemd, Docker, or your process manager. The app will return a 500 at request time if the variable is missing — it does not fail at startup.

The Next.js config (`apps/web/next.config.ts`):
- Transpiles all monorepo packages: `@m7/audio-os-mopidy`, `@m7/audio-os-feature`, `@m7/audio-os-shared`, `@m7/audio-os-ui`
- Outputs a standalone build for deployment
- Sets `outputFileTracingRoot` for monorepo support
- Includes postbuild script to copy static assets to standalone build

**Important**: This monorepo contains client applications only. The audio-os service (which runs Mopidy) is a separate server that must be running and accessible for the applications to function.

### Working with Libraries

**Mopidy Client (`libs/mopidy/`):**
- It's a **1:1 mapping** to Mopidy Core API (no normalization)
- All types use snake_case to match Mopidy wire format
- Method names follow the pattern: `mopidy.{service}.{method}()`
- The library exports both high-level facades and low-level `MopidyClient`
- Transformation to app-friendly types happens in `apps/web/lib/audio/snapshot.ts` and related files

**Feature Modules (`libs/feature/`):**
- Each feature module (shell, library, playback, search) contains React components for that feature area
- Components are organized in subdirectories with barrel exports via `index.ts`
- Feature modules can import from `libs/shared/types` for domain types
- Use path aliases like `@m7/audio-os/feature/shell` to import from feature modules

**UI Library (`libs/ui/`):**
- Built on shadcn (preset `b11PQ3RjIW`, `radix-sera`, hugeicons). Dark mode is fixed via the `dark` class on `<html>`; theme tokens live in `apps/web/app/globals.css`.
- Add components with `libs/ui/scripts/add.sh <name>...` (runs the shadcn CLI from `apps/web`, then moves output to `primitives/src/components/<name>/index.tsx` and exports it).
- `cn()` lives in `libs/shared/utils`. Use semantic tokens (`bg-background`, `text-muted-foreground`) rather than raw colors.

**Shared Libraries (`libs/shared/`):**
- Domain types live in `libs/shared/types` and are the source of truth
- `apps/web/lib/audio/contract.ts` currently re-exports these types (migration in progress)
- When adding new domain types, add them to `libs/shared/types/src/index.ts`
- The `infra/` subdirectory contains scripts for deploying to Raspberry Pi (see `libs/shared/infra/README.md`)

## Testing the Application

To test playback functionality:
1. **Ensure the audio-os service is running** and accessible at the configured URL (default: `http://audio-os.local:6680/mopidy/rpc`)
2. Start the dev server with `npm run dev`
3. Navigate to http://localhost:3000
4. Use browser DevTools Network tab to inspect `/api/audio` requests

To test specific actions programmatically:
```bash
# Get current playback state
curl -s http://localhost:3000/api/audio

# Execute playback action
curl -s -X POST http://localhost:3000/api/audio \
  -H 'Content-Type: application/json' \
  -d '{"action":"play"}'
```

## Adding New Features

**To add a new Mopidy API method:**
1. Add the method signature to `libs/mopidy/src/rpc/methods.ts`
2. Add the service method in `libs/mopidy/src/services/`
3. Export from `libs/mopidy/src/index.ts` if needed

**To add a new playback action:**
1. Add action type to `PlaybackActionRequest` union in `libs/shared/types/src/index.ts`
2. Implement handler in `apps/web/lib/audio/handlers.ts`
3. The mutation hook `usePlaybackAction()` in `apps/web/lib/audio/hooks.ts` handles all actions automatically

**To add a new API endpoint:**
1. Create `route.ts` file in `apps/web/app/api/{endpoint}/`
2. Implement GET/POST handlers using Next.js route handlers
3. Use `toAudioError` from `apps/web/lib/audio/errors.ts` for error handling
4. Add client-side fetch function in appropriate lib file
5. Add React Query hook in `apps/web/lib/audio/hooks.ts`
