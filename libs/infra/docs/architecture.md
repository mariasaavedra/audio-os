# Architecture

## Overview

Next.js App (apps/web, port 3000)
    ↓
Mopidy (HTTP RPC)
    ↓
GStreamer
    ↓
ALSA
    ↓
Audio Device

## Components

- Mopidy (venv)
- Mopidy-Tidal (same venv)
- systemd service
- ALSA audio

## Key Rule

Same Python environment for Mopidy + extensions.

## Endpoint

http://<pi>:6680/mopidy/rpc
