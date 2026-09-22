#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-install}"

usage() {
    echo "Usage:"
    echo
    echo "  ./install.sh --check"
    echo "      Read-only readiness check."
    echo
    echo "  ./install.sh"
    echo "      Prepare the local Python environment and runtime directories."
}

case "$MODE" in
    install)
        ;;
    --check)
        ;;
    -h|--help)
        usage
        exit 0
        ;;
    *)
        usage
        exit 2
        ;;
esac

echo
echo "======================================================================"
echo " CREDO ANALYZER — INSTALL"
echo " MODE=$MODE"
echo "======================================================================"

echo
echo "===== REQUIRED FILES ====="

for FILE in \
    app/server.py \
    app/index.html \
    app/app.js \
    app/features.js \
    requirements.txt \
    start-credo.command \
    stop-credo.command \
    status-credo.command \
    .env.example \
    LICENSE \
    CODE_PROVENANCE.yaml \
    THIRD_PARTY_NOTICES.md
do
    if [ ! -s "$ROOT/$FILE" ]; then
        echo "FAIL: missing $FILE"
        exit 1
    fi

    echo "PASS: $FILE"
done

echo
echo "===== REQUIRED COMMANDS ====="

for CMD in python3 curl; do
    if ! command -v "$CMD" >/dev/null 2>&1; then
        echo "FAIL: missing command: $CMD"
        exit 1
    fi

    echo "PASS: $CMD -> $(command -v "$CMD")"
done

echo
echo "===== PYTHON ====="

python3 - <<'PY'
import sys

print("Python:", sys.version.split()[0])

if sys.version_info < (3, 10):
    raise SystemExit("FAIL: Python 3.10 or newer is required")

print("PYTHON_VERSION=PASS")
PY

python3 -m venv --help >/dev/null

echo "PYTHON_VENV=PASS"

echo
echo "===== PYTHON SOURCE SYNTAX ====="

python3 - "$ROOT/app" <<'PY'
from pathlib import Path
import sys

root = Path(sys.argv[1])

for path in sorted(root.glob("*.py")):
    compile(
        path.read_text(encoding="utf-8"),
        str(path),
        "exec",
    )
    print("PASS:", path.name)
PY

echo
echo "===== SHELL SYNTAX ====="

for FILE in \
    install.sh \
    start-credo.command \
    stop-credo.command \
    status-credo.command \
    tools/public-preflight.sh \
    tools/verify-provenance.sh
do
    bash -n "$ROOT/$FILE"
    echo "PASS: $FILE"
done

echo
echo "===== PROVENANCE ====="

"$ROOT/tools/verify-provenance.sh"

if [ "$MODE" = "--check" ]; then
    echo
    echo "======================================================================"
    echo " INSTALL_CHECK=PASS"
    echo " NICZEGO NIE ZAINSTALOWANO"
    echo " NICZEGO NIE URUCHOMIONO"
    echo "======================================================================"
    exit 0
fi

echo
echo "===== LOCAL ENVIRONMENT ====="

VENV="${CREDO_VENV_DIR:-$ROOT/venv}"
DATA="${CREDO_DATA_DIR:-$ROOT/data}"
RUN="${CREDO_RUN_DIR:-$ROOT/run}"
LOGS="${CREDO_LOG_DIR:-$ROOT/logs}"

if [ ! -d "$VENV" ]; then
    echo "Creating venv: $VENV"
    python3 -m venv "$VENV"
else
    echo "Existing venv: $VENV"
fi

echo
echo "===== PYTHON DEPENDENCIES ====="

"$VENV/bin/python" -m pip install \
    -r "$ROOT/requirements.txt"

echo
echo "===== RUNTIME DIRECTORIES ====="

mkdir -p \
    "$DATA/images" \
    "$RUN" \
    "$LOGS"

echo "DATA=$DATA"
echo "RUN=$RUN"
echo "LOGS=$LOGS"

echo
echo "===== LOCAL CONFIGURATION ====="

if [ ! -f "$ROOT/.env" ]; then
    cp "$ROOT/.env.example" "$ROOT/.env"
    echo "CREATED: $ROOT/.env"
else
    echo "EXISTS: $ROOT/.env"
fi

chmod +x \
    "$ROOT/install.sh" \
    "$ROOT/start-credo.command" \
    "$ROOT/stop-credo.command" \
    "$ROOT/status-credo.command"

echo
echo "======================================================================"
echo " INSTALL=PASS"
echo
echo " Application was NOT started automatically."
echo
echo " Start:"
echo "   ./start-credo.command"
echo
echo " Status:"
echo "   ./status-credo.command"
echo
echo " Stop:"
echo "   ./stop-credo.command"
echo "======================================================================"
