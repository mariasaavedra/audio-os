# Setup Guide (Raspberry Pi)

## Goal

Take a fresh Raspberry Pi and make it a working audio node.

## 1. Flash OS

- Raspberry Pi OS Lite (64-bit)
- Enable SSH
- Create user (e.g. `audio`)

## 2. SSH into Pi

```bash
ssh audio@audio-os
```

## 3. Basic config

```bash
sudo raspi-config
```

## 4. Verify audio works

```bash
aplay /usr/share/sounds/alsa/Front_Center.wav
```

## 5. Install base system

```bash
scp audio-os-base-<version>.tar.gz audio@audio-os:~
ssh audio@audio-os
tar -xzf audio-os-base-<version>.tar.gz
cd audio-os-base-<version>
chmod +x *.sh
sudo ./install.sh
```

## 6. Verify Mopidy

```bash
systemctl status mopidy
/home/audio/mopidy/venv/bin/mopidy deps
mopidyctl config
```

## 7. Tidal auth

```bash
journalctl -u mopidy -f
```

## Done

Working audio node.
