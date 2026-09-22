#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
F="$ROOT/app/credo-data-exporter_universal.py"

EXPECTED="b4b09dcdba11e1db9d2215b6e8b4cb60589be671"

if [ ! -f "$F" ]; then
    echo "FAIL: missing $F"
    exit 1
fi

ACTUAL="$(git hash-object "$F")"

echo "EXPECTED=$EXPECTED"
echo "ACTUAL=$ACTUAL"

if [ "$ACTUAL" != "$EXPECTED" ]; then
    echo "FAIL: upstream file differs from documented blob"
    exit 1
fi

echo "PASS: byte-identical upstream CREDO exporter"
