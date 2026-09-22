#!/bin/bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ENV_FILE="${CREDO_ENV_FILE:-$ROOT/.env}"

if [ -f "$ENV_FILE" ]; then
    set -a
    . "$ENV_FILE"
    set +a
fi

RUN="${CREDO_RUN_DIR:-$ROOT/run}"
LOGS="${CREDO_LOG_DIR:-$ROOT/logs}"

HOST="${CREDO_HOST:-127.0.0.1}"
PORT="${CREDO_PORT:-8091}"

PIDFILE="$RUN/credo.pid"
LOG="$LOGS/credo.log"

echo "===== CREDO Analyzer ====="

if [ -f "$PIDFILE" ]; then
    PID="$(cat "$PIDFILE" 2>/dev/null || true)"

    if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
        echo "PROCESS=RUNNING"
        echo "PID=$PID"
    else
        echo "PROCESS=STALE_PID"
    fi
else
    echo "PROCESS=STOPPED"
fi

printf "HEALTH="

curl -fsS \
  --max-time 3 \
  "http://${HOST}:${PORT}/healthz" \
  2>/dev/null \
  || echo "OFFLINE"

echo

if command -v lsof >/dev/null 2>&1; then
    echo
    echo "PORT:"
    lsof -nP \
      -iTCP:"$PORT" \
      -sTCP:LISTEN \
      2>/dev/null \
      || true
fi

echo
echo "LOG:"
tail -30 "$LOG" 2>/dev/null || true
