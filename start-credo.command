#!/bin/bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ENV_FILE="${CREDO_ENV_FILE:-$ROOT/.env}"

if [ -f "$ENV_FILE" ]; then
    set -a
    . "$ENV_FILE"
    set +a
fi

APP="${CREDO_APP_DIR:-$ROOT/app}"
DATA="${CREDO_DATA_DIR:-$ROOT/data}"
VENV="${CREDO_VENV_DIR:-$ROOT/venv}"
RUN="${CREDO_RUN_DIR:-$ROOT/run}"
LOGS="${CREDO_LOG_DIR:-$ROOT/logs}"

HOST="${CREDO_HOST:-127.0.0.1}"
PORT="${CREDO_PORT:-8091}"

PIDFILE="$RUN/credo.pid"
LOG="$LOGS/credo.log"

mkdir -p "$RUN" "$LOGS" "$DATA/images"

URL="http://${HOST}:${PORT}/"

open_browser() {
    if [ "${CREDO_OPEN_BROWSER:-1}" = "0" ]; then
        return
    fi

    if command -v open >/dev/null 2>&1; then
        open "$URL"
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$URL" >/dev/null 2>&1 || true
    fi
}

if [ -f "$PIDFILE" ]; then
    PID="$(cat "$PIDFILE" 2>/dev/null || true)"

    if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
        echo "CREDO już działa PID=$PID"
        echo "URL=$URL"
        open_browser
        exit 0
    fi

    rm -f "$PIDFILE"
fi

if command -v lsof >/dev/null 2>&1; then
    if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
        echo "STOP: port $PORT zajęty:"
        lsof -nP -iTCP:"$PORT" -sTCP:LISTEN
        exit 1
    fi
fi

PYTHON="${CREDO_PYTHON:-$VENV/bin/python}"

if [ ! -x "$PYTHON" ]; then
    echo "STOP: brak interpretera:"
    echo "$PYTHON"
    echo
    echo "Utwórz środowisko:"
    echo "  python3 -m venv \"$VENV\""
    echo "  \"$VENV/bin/pip\" install -r \"$ROOT/requirements.txt\""
    exit 1
fi

cd "$APP"

nohup env \
  CREDO_DATA_DIR="$DATA" \
  CREDO_HOST="$HOST" \
  CREDO_PORT="$PORT" \
  "$PYTHON" \
  "$APP/server.py" \
  >>"$LOG" 2>&1 &

PID=$!
echo "$PID" > "$PIDFILE"

for _ in {1..60}; do

    if ! kill -0 "$PID" 2>/dev/null; then
        echo "CREDO zakończyło proces."
        tail -120 "$LOG" || true
        rm -f "$PIDFILE"
        exit 1
    fi

    HEALTH="$(
        curl -fsS \
          --max-time 2 \
          "$URL"'healthz' \
          2>/dev/null \
          || true
    )"

    if [ "$HEALTH" = "ok" ]; then
        echo "CREDO=RUNNING"
        echo "PID=$PID"
        echo "URL=$URL"
        open_browser
        exit 0
    fi

    sleep 0.5
done

echo "START TIMEOUT"
tail -120 "$LOG" || true

kill "$PID" 2>/dev/null || true
rm -f "$PIDFILE"

exit 1
