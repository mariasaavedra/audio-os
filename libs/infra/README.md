# Audio OS (Raspberry Pi Audio Node)

## What this is

A reproducible setup for a Raspberry Pi that runs:

- Mopidy (audio playback)
- Mopidy-Tidal (streaming)
- ALSA (audio output)
- Next.js web application (`apps/web`)

This repo defines the **base machine layer**, not the app.

## Quick Start

### 1. Build artifact locally
```bash
bash infra/package-base-artifact.sh
```

### 2. Copy to Pi
```bash
scp dist/audio-os-base-<version>.tar.gz audio@audio-os:~
```

### 3. Install on Pi
```bash
ssh audio@audio-os
tar -xzf audio-os-base-<version>.tar.gz
cd audio-os-base-<version>
sudo ./install.sh
```

## Docs

- setup-guide.md → step-by-step Pi setup
- architecture.md → system design
- deployment.md → how to deploy updates

## Core Principle

One runtime. One Python environment. No mixing.