#!/bin/bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ENV_FILE="${CREDO_ENV_FILE:-$ROOT/.env}"

if [ -f "$ENV_FILE" ]; then
    set -a
    . "$ENV_FILE"
    set +a
fi
RUN="${CREDO_RUN_DIR:-$ROOT/run}"

PIDFILE="$RUN/credo.pid"

if [ ! -f "$PIDFILE" ]; then
    echo "CREDO nie działa."
    exit 0
fi

PID="$(cat "$PIDFILE" 2>/dev/null || true)"

if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then

    kill "$PID"

    for _ in {1..30}; do
        kill -0 "$PID" 2>/dev/null || break
        sleep 0.2
    done
fi

rm -f "$PIDFILE"

echo "CREDO=STOPPED"
