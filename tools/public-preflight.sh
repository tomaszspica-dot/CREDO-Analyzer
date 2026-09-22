#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

git ls-files \
    --cached \
    --others \
    --exclude-standard \
    > "$TMP"

BAD=0

echo "=== public candidate files ==="

COUNT="$(wc -l < "$TMP" | tr -d ' ')"
echo "FILES=$COUNT"

echo
echo "=== forbidden runtime paths ====="

if grep -E \
    '^(data|logs|run|backups|venv|\.venv|env)/' \
    "$TMP"
then
    echo "FAIL: runtime path is trackable"
    BAD=1
else
    echo "PASS"
fi

echo
echo "=== forbidden runtime files ====="

if grep -E \
    '(\.sqlite|\.sqlite3|\.db|\.db-wal|\.db-shm|\.log|\.pyc)$|(^|/)\.DS_Store$' \
    "$TMP"
then
    echo "FAIL: runtime file is trackable"
    BAD=1
else
    echo "PASS"
fi

echo
echo "=== provenance ====="

"$ROOT/tools/verify-provenance.sh"

echo
echo "=== required public files ====="

for REQUIRED in \
    LICENSE \
    CITATION.cff \
    README.md \
    AGENTS.md \
    llms.txt \
    .env.example \
    install.sh \
    CODE_PROVENANCE.yaml \
    THIRD_PARTY_NOTICES.md
do
    if [ ! -s "$REQUIRED" ]; then
        echo "FAIL: missing $REQUIRED"
        BAD=1
    else
        echo "PASS: $REQUIRED"
    fi
done

echo
echo "=== project metadata ====="

grep -q \
    'Copyright (c) 2026 Tomasz' \
    LICENSE \
    || {
        echo "FAIL: MIT copyright"
        BAD=1
    }

grep -q \
    '^cff-version: 1.2.0$' \
    CITATION.cff \
    || {
        echo "FAIL: CITATION version"
        BAD=1
    }

grep -q \
    'name: "Tomasz"' \
    CITATION.cff \
    || {
        echo "FAIL: CITATION author"
        BAD=1
    }

grep -q \
    '^license: MIT$' \
    CITATION.cff \
    || {
        echo "FAIL: CITATION license"
        BAD=1
    }

if [ "$BAD" -eq 0 ]; then
    echo "PASS"
fi

echo
echo "=== machine-specific paths ====="

MACHINE_BAD=0

while IFS= read -r FILE; do
    [ -f "$FILE" ] || continue

    case "$FILE" in
        tools/public-preflight.sh)
            continue
            ;;
        *.png|*.jpg|*.jpeg|*.gif|*.webp)
            continue
            ;;
    esac

    if grep -nE \
        '/Users/[^/]+/|/home/[^/]+/|/var/lib/credo-analyzer|satnogspi\.local' \
        "$FILE" \
        >/dev/null 2>&1
    then
        echo "FAIL: $FILE"
        grep -nE \
            '/Users/[^/]+/|/home/[^/]+/|/var/lib/credo-analyzer|satnogspi\.local' \
            "$FILE" \
            || true
        MACHINE_BAD=1
    fi
done < "$TMP"

if [ "$MACHINE_BAD" -eq 0 ]; then
    echo "PASS"
else
    BAD=1
fi

echo
echo "=== basic secret scan ====="

python3 - <<'PY'
from pathlib import Path
import re
import subprocess

raw = subprocess.check_output(
    [
        "git",
        "ls-files",
        "-co",
        "--exclude-standard",
        "-z",
    ]
)

files = [
    Path(x.decode())
    for x in raw.split(b"\0")
    if x
]

patterns = {
    "PRIVATE_KEY":
        re.compile(
            r"BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY"
        ),

    "AWS":
        re.compile(
            r"\bAKIA[0-9A-Z]{16}\b"
        ),

    "GITHUB":
        re.compile(
            r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b"
        ),

    "OPENAI":
        re.compile(
            r"\bsk-[A-Za-z0-9_-]{20,}\b"
        ),
}

hits = []

for path in files:
    if not path.is_file():
        continue

    try:
        text = path.read_text(
            encoding="utf-8"
        )
    except Exception:
        continue

    for kind, rx in patterns.items():
        if rx.search(text):
            hits.append(
                (kind, str(path))
            )

for kind, path in hits:
    print(
        "FAIL:",
        kind,
        path
    )

if hits:
    raise SystemExit(1)

print("PASS")
PY

echo
echo "=== result ====="

if [ "$BAD" -ne 0 ]; then
    echo "PUBLIC_PREFLIGHT=FAIL"
    exit 1
fi

echo "PUBLIC_PREFLIGHT=PASS"
