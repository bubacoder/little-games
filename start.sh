#!/usr/bin/env bash
# start.sh — start a local HTTP server and open the game picker
# Usage: ./start.sh [port]

set -euo pipefail

PORT="${1:-8765}"
ROOT="$(cd "$(dirname "$0")" && pwd)"

# ── Pick an available port if the default is busy ────────────────────────────
while lsof -iTCP:"$PORT" -sTCP:LISTEN -t &>/dev/null; do
  echo "Port $PORT is in use, trying $((PORT + 1))…"
  PORT=$((PORT + 1))
done

URL="http://localhost:$PORT"

echo "Starting server at $URL  (root: $ROOT)"
echo "Press Ctrl+C to stop."
echo ""

# ── Open browser (macOS: open, Linux: xdg-open) ──────────────────────────────
open_browser() {
  if command -v open &>/dev/null; then      # macOS
    open "$URL"
  elif command -v xdg-open &>/dev/null; then # Linux
    xdg-open "$URL"
  elif command -v start &>/dev/null; then    # Windows / Git Bash
    start "$URL"
  else
    echo "Could not auto-open browser — visit $URL manually."
  fi
}

# Give the server a moment to start before opening the browser
(sleep 0.6 && open_browser) &

# ── Start server ─────────────────────────────────────────────────────────────
cd "$ROOT"
python3 -m http.server "$PORT"
