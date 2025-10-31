#!/usr/bin/env bash
set -euo pipefail

BIN_DIR="$(cd "$(dirname "$0")" && cd .. && pwd)/bin"
mkdir -p "$BIN_DIR"

CF="$BIN_DIR/cloudflared"
if [ ! -f "$CF" ]; then
  echo "Downloading cloudflared..."
  curl -L -o "$CF" https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  chmod +x "$CF"
fi

echo "Starting tunnel to http://localhost:8088 ..."
"$CF" tunnel --url http://localhost:8088
