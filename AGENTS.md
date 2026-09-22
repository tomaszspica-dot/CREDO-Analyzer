# AGENTS.md

## Purpose

This file is the primary machine-readable/human-readable entry point for
AI coding agents working with CREDO Analyzer.

Before modifying the project, read:

1. `README.md`
2. `CODE_PROVENANCE.yaml`
3. `THIRD_PARTY_NOTICES.md`
4. `.gitignore`

## Project layout

Primary backend:

`app/server.py`

Primary frontend:

`app/app.js`
`app/features.js`
`app/timelapse.js`
`app/index.html`
`app/style.css`

Legacy/support code:

`app/legacy.py`
`app/network_import.py`

Third-party upstream code:

`app/credo-data-exporter_universal.py`

## CRITICAL PROVENANCE RULE

`app/credo-data-exporter_universal.py` is not project-authored code.

It is a byte-identical copy of:

`credo-science/credo-api-tools`
`data-exporter/credo-data-exporter_universal.py`

Verified Git blob:

`b4b09dcdba11e1db9d2215b6e8b4cb60589be671`

License:

MIT

See:

`CODE_PROVENANCE.yaml`
`THIRD_PARTY_NOTICES.md`
`LICENSES/MIT-credo-science.txt`

Do not silently reformat, rewrite, or claim authorship of this file.

If the file changes, update the provenance record.

## AI-assisted project code

Large portions of the project-local implementation were developed
iteratively with generative-AI assistance under project-owner direction.

AI assistance is not the same as third-party source-code provenance.

Unless `CODE_PROVENANCE.yaml` identifies an external upstream source,
do not automatically describe project-local code as copied from another
software project.

## Data policy

Do not commit runtime/private data.

Never add:

`data/`
`logs/`
`run/`
`backups/`
`venv/`
SQLite databases
downloaded detection images
local caches
credentials
tokens
private environment files

## Compatibility

The audited production environment on 2026-09-22 was:

macOS 12.7.6
Intel x86_64

Do not claim compatibility with another operating system or Python
version without testing it.

Some Linux/Raspberry-Pi compatibility code still exists and should be
treated as portability code or technical debt until explicitly reviewed.

## Refactoring policy

Avoid large behavioural refactors in the same commit as provenance,
packaging, security, or portability changes.

In particular, `app/server.py` contains several very large functions.

Refactor incrementally with tests.

## Performance

Watch for duplicate browser polling.

The main frontend has a periodic refresh and `features.js` contains
additional timers. Verify network traffic before adding another timer.

Prefer one shared polling source where possible.

## Scientific integrity

Distinguish:

- measured/detected values
- derived metrics
- heuristic classifications
- correlations
- external scientific data
- user annotations

Do not make scientific claims stronger than the underlying data supports.
