#!/usr/bin/env bash
set -Eeuo pipefail

echo "[INSTALL] Running bootstrap"
bash ./bootstrap-audio-os.sh

echo "[INSTALL] Copying templates"
sudo mkdir -p /etc/mopidy
sudo cp templates/mopidy.conf /etc/mopidy/mopidy.conf
sudo cp templates/mopidy.service /etc/systemd/system/mopidy.service
sudo cp templates/app.service.example /etc/systemd/system/app.service.example

echo "[INSTALL] Reloading systemd"
sudo systemctl daemon-reload
sudo systemctl enable mopidy
sudo systemctl restart mopidy

echo "[INSTALL] Done"
