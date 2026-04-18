# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**This is a monorepo** for applications and libraries that interact with the **audio-os** service (a separate server that runs the Mopidy music server).

Currently contains:
- `apps/web` - Next.js web player interface
- `libs/mopidy` - Type-safe Mopidy RPC client library

This monorepo is designed to host multiple apps and shared libraries that communicate with the audio-os service.

**Key technologies:**
- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- TanStack Query (React Query) for data fetching
- Tailwind CSS 4
- Custom `@m7/mopidy` library for Mopidy JSON-RPC communication

## Monorepo Structure

```
apps/
  web/           # Next.js frontend application
libs/
  mopidy/        # Type-safe Mopidy RPC client library
```

Path aliases are configured in `tsconfig.base.json`:
- `@m7/mopidy` → `libs/mopidy/src/index.ts`

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
npm run typecheck
```
Runs TypeScript compiler in no-emit mode across the entire monorepo.

**Linting:**
```bash
npm run lint -w apps/web
```

**Working with individual packages:**
```bash
# Run commands in specific workspace
npm run <script> -w apps/web
npm run <script> -w libs/mopidy

# Install dependencies in specific workspace
npm install <package> -w apps/web
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

2. **Audio Business Logic** (`apps/web/lib/audio/`)
   - `contract.ts`: Normalized domain types (camelCase, app-oriented)
   - `snapshot.ts`: Transforms raw Mopidy data into `PlaybackSnapshot`
   - `handlers.ts`: Action handlers that orchestrate Mopidy calls
   - `api.ts`: Client-side fetch functions
   - `hooks.ts`: React Query hooks (`usePlayback`, `usePlaybackAction`, etc.)

3. **API Routes** (`apps/web/app/api/`)
   - `/api/audio` (GET): Returns current playback snapshot
   - `/api/audio` (POST): Executes playback actions
   - `/api/playlists`: List playlists
   - `/api/playlists/[id]`: Get playlist tracks (paginated)
   - `/api/search`: Search tracks (paginated)

4. **UI Components** (`apps/web/components/`)
   - `playback/`: Playback controls and progress bar
   - `playlists/`: Playlist browsing UI
   - `search/`: Search interface with infinite scroll
   - `ui/`: Reusable UI primitives

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

The Next.js config:
- Transpiles `@m7/mopidy` package
- Outputs a standalone build for deployment
- Sets `outputFileTracingRoot` for monorepo support

**Important**: This monorepo contains client applications only. The audio-os service (which runs Mopidy) is a separate server that must be running and accessible for the applications to function.

### Working with the Mopidy Library

When making changes to `libs/mopidy`, understand that:
- It's a **1:1 mapping** to Mopidy Core API (no normalization)
- All types use snake_case to match Mopidy wire format
- Method names follow the pattern: `mopidy.{service}.{method}()`
- The library exports both high-level facades and low-level `MopidyClient`

Transformation to app-friendly types happens in `apps/web/lib/audio/snapshot.ts` and related files.

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
1. Add action type to `PlaybackActionRequest` union in `apps/web/lib/audio/contract.ts`
2. Implement handler in `apps/web/lib/audio/handlers.ts`
3. Add mutation hook in `apps/web/lib/audio/hooks.ts` if needed

**To add a new API endpoint:**
1. Create `route.ts` file in `apps/web/app/api/{endpoint}/`
2. Implement GET/POST handlers using Next.js route handlers
3. Use `toAudioError` from `apps/web/lib/audio/errors.ts` for error handling
4. Add client-side fetch function in appropriate lib file
5. Add React Query hook in `apps/web/lib/audio/hooks.ts`
