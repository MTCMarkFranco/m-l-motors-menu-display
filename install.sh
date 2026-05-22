#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_USER="${APP_USER:-pi}"
APP_PORT="${APP_PORT:-3000}"
SERVICE_NAME="${SERVICE_NAME:-menu-app}"

log() {
  printf "\n[%s] %s\n" "$(date +'%H:%M:%S')" "$*"
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

as_root() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
  else
    sudo "$@"
  fi
}

detect_firefox_binary() {
  if command -v firefox >/dev/null 2>&1; then
    echo "firefox"
    return
  fi

  if command -v firefox-esr >/dev/null 2>&1; then
    echo "firefox-esr"
    return
  fi

  echo ""
}

log "Validating prerequisites"
require_command npm
require_command node
require_command curl

FIREFOX_BIN="$(detect_firefox_binary)"
if [ -z "$FIREFOX_BIN" ]; then
  log "Firefox not found, installing firefox-esr"
  as_root apt update
  as_root apt install -y firefox-esr
  FIREFOX_BIN="$(detect_firefox_binary)"
fi

if [ -z "$FIREFOX_BIN" ]; then
  echo "Unable to find Firefox binary after install."
  exit 1
fi

log "Installing app dependencies and building app"
cd "$APP_DIR"
npm install
npm run build

log "Creating systemd service ${SERVICE_NAME}.service"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
as_root tee "$SERVICE_FILE" >/dev/null <<EOF
[Unit]
Description=Menu Display App
After=network.target

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${APP_DIR}
Environment=NODE_ENV=production
ExecStart=/usr/bin/env npm run start -- -p ${APP_PORT}
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

as_root systemctl daemon-reload
as_root systemctl enable "${SERVICE_NAME}.service"
as_root systemctl restart "${SERVICE_NAME}.service"

log "Configuring Firefox kiosk autostart"
AUTOSTART_DIR="/home/${APP_USER}/.config/autostart"
AUTOSTART_FILE="${AUTOSTART_DIR}/menu-kiosk.desktop"
as_root -u "$APP_USER" mkdir -p "$AUTOSTART_DIR"
as_root -u "$APP_USER" tee "$AUTOSTART_FILE" >/dev/null <<EOF
[Desktop Entry]
Type=Application
Name=Menu Kiosk
Exec=sh -c "until curl -fsS http://127.0.0.1:${APP_PORT} >/dev/null; do sleep 2; done; ${FIREFOX_BIN} --kiosk http://127.0.0.1:${APP_PORT}"
X-GNOME-Autostart-enabled=true
EOF

log "Attempting to enable Desktop Autologin"
if command -v raspi-config >/dev/null 2>&1; then
  as_root raspi-config nonint do_boot_behaviour B4 || true
else
  log "raspi-config not found, skipping autologin change"
fi

log "Disabling screen blanking for LXDE"
LXDE_AUTOSTART="/etc/xdg/lxsession/LXDE-pi/autostart"
if [ -f "$LXDE_AUTOSTART" ]; then
  as_root sed -i '/^@xset s off$/d;/^@xset -dpms$/d;/^@xset s noblank$/d' "$LXDE_AUTOSTART"
  {
    echo "@xset s off"
    echo "@xset -dpms"
    echo "@xset s noblank"
  } | as_root tee -a "$LXDE_AUTOSTART" >/dev/null
else
  log "LXDE autostart file not found, skipping blanking config"
fi

log "Done"
echo "Node: $(node -v)"
echo "npm:  $(npm -v)"
echo "Service status:"
as_root systemctl --no-pager --full status "${SERVICE_NAME}.service" || true
echo
echo "Reboot to test kiosk startup: sudo reboot"