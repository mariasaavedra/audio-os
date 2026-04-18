# Audio OS
A monorepo for applications and libraries that interact with the [audio-os](http://audio-os.local) service.

## Overview

This monorepo contains client applications and shared libraries for building interfaces to the audio-os Mopidy server. It uses npm workspaces to manage multiple packages in a single repository.

### Current Packages

**Apps:**
- `apps/web` - Next.js web player interface

**Libraries:**
- `libs/mopidy` - Type-safe TypeScript client for the Mopidy JSON-RPC API

## Prerequisites

- Node.js (see `.nvmrc` for required version)
- The **audio-os service** must be running and accessible (default: `http://audio-os.local:6680/mopidy/rpc`)

## Getting Started

```bash
# Install dependencies
npm install

# Start the web app in development mode
npm run dev

# Build for production
npm run build

# Type check the entire monorepo
npm run typecheck
```

The web app will be available at [http://localhost:3000](http://localhost:3000).

## Monorepo Commands

This project uses npm workspaces. Commands can be run from the root or scoped to specific packages:

```bash
# Run a script in a specific workspace
npm run dev -w apps/web
npm run build --workspace=apps/web

# Install a dependency in a specific workspace
npm install react-query -w apps/web

# Run commands across all workspaces
npm run typecheck  # runs across entire monorepo
```

## Project Structure

```
audio-os/
├── apps/
│   └── web/          # Next.js web player
├── libs/
│   └── mopidy/       # Mopidy RPC client library
├── package.json      # Root workspace configuration
└── tsconfig.base.json # Shared TypeScript config
```

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation and development guidelines.

## License

Private
