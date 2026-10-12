#!/bin/bash
# Renders tools/og.html to og.png (1200x630) with headless Chrome.
# Usage: tools/make-og.sh   (from the repo root; needs python3 and Google Chrome)
set -e
cd "$(dirname "$0")/.."
PORT=${PORT:-8790}
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER' EXIT
sleep 1
CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
# alarm: headless Chrome sometimes never exits after writing the screenshot
perl -e 'alarm 30; exec @ARGV' "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 --user-data-dir="/tmp/charsheet-og-$RANDOM" \
  --screenshot="$PWD/og.png" "http://127.0.0.1:$PORT/tools/og.html" 2>/dev/null || true
ls -l og.png
