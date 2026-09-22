#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== forbidden directories ==="

BAD=0

for P in \
    "$ROOT/data" \
    "$ROOT/logs" \
    "$ROOT/run" \
    "$ROOT/backups" \
    "$ROOT/venv"
do
    if [ -e "$P" ]; then
        echo "FAIL: $P"
        BAD=1
    fi
done

echo
echo "=== caches ==="

CACHE="$(find "$ROOT" \
    \( -name '__pycache__' -o -name '*.pyc' -o -name '.DS_Store' \) \
    -print)"

if [ -n "$CACHE" ]; then
    echo "$CACHE"
    BAD=1
else
    echo "PASS"
fi

echo
echo "=== sqlite/log files ==="

RUNTIME="$(find "$ROOT" -type f \
    \( -name '*.sqlite' -o -name '*.sqlite3' -o -name '*.db' -o -name '*.log' \) \
    -print)"

if [ -n "$RUNTIME" ]; then
    echo "$RUNTIME"
    BAD=1
else
    echo "PASS"
fi

echo
echo "=== provenance ==="

"$ROOT/tools/verify-provenance.sh"

echo
echo "=== result ==="

if [ "$BAD" -ne 0 ]; then
    echo "PUBLIC_PREFLIGHT=FAIL"
    exit 1
fi

echo "PUBLIC_PREFLIGHT=PASS"

echo
echo "=== private / machine-specific paths ==="

if grep -RniE \
    --exclude-dir=.git \
    --exclude='public-preflight.sh' \
    '/Users/[^/]+/|/home/[^/]+/|/var/lib/credo-analyzer|satnogspi\.local' \
    .;
then
    echo "FAIL: machine-specific path detected"
    exit 1
else
    echo "PASS"
fi

echo
echo "=== basic secret scan ==="

python3 - <<'PY'
from pathlib import Path
import re

patterns = [
    re.compile(r"BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"),
]

hits=[]

for p in Path(".").rglob("*"):

    if not p.is_file():
        continue

    if ".git" in p.parts:
        continue

    try:
        text=p.read_text(
            encoding="utf-8"
        )
    except Exception:
        continue

    if any(rx.search(text) for rx in patterns):
        hits.append(str(p))

if hits:
    print("FAIL:", *hits, sep="\n")
    raise SystemExit(1)

print("PASS")
PY

# CREDO_PUBLIC_METADATA_V1

echo
echo "=== public metadata ==="

for required in \
    LICENSE \
    CITATION.cff \
    README.md \
    AGENTS.md \
    CODE_PROVENANCE.yaml \
    THIRD_PARTY_NOTICES.md
do
    if [ ! -s "$required" ]; then
        echo "FAIL: missing $required"
        exit 1
    fi
done

grep -q \
  'Copyright (c) 2026 Tomasz' \
  LICENSE \
  || {
      echo "FAIL: root MIT copyright"
      exit 1
  }

grep -q \
  '^cff-version: 1.2.0$' \
  CITATION.cff \
  || {
      echo "FAIL: CITATION cff-version"
      exit 1
  }

grep -q \
  'name: "Tomasz"' \
  CITATION.cff \
  || {
      echo "FAIL: CITATION author"
      exit 1
  }

grep -q \
  '^license: MIT$' \
  CITATION.cff \
  || {
      echo "FAIL: CITATION license"
      exit 1
  }

echo "PASS"
