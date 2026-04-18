#!/usr/bin/env bash
set -Eeuo pipefail

AUDIO_USER="audio"
AUDIO_HOME="/home/audio"
MOPIDY_ROOT="${AUDIO_HOME}/mopidy"
MOPIDY_VENV="${MOPIDY_ROOT}/venv"

echo "[BOOTSTRAP] Installing system dependencies"
sudo apt update
sudo apt install -y build-essential python3-dev python3-pip python3-venv python3-gst-1.0 gir1.2-gstreamer-1.0 gir1.2-gst-plugins-base-1.0 gstreamer1.0-plugins-good gstreamer1.0-plugins-ugly gstreamer1.0-plugins-bad gstreamer1.0-libav gstreamer1.0-tools alsa-utils curl git xz-utils

echo "[BOOTSTRAP] Creating Mopidy venv"
mkdir -p ${MOPIDY_ROOT}
python3 -m venv ${MOPIDY_VENV}

echo "[BOOTSTRAP] Installing Mopidy + Tidal"
${MOPIDY_VENV}/bin/pip install --upgrade pip
${MOPIDY_VENV}/bin/pip install Mopidy Mopidy-Tidal

echo "[BOOTSTRAP] Done"
