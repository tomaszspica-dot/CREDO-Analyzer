# AGENTS.md

## Purpose

This is the primary editing-policy document for AI coding agents and
automated development tools working with CREDO Analyzer.

Before modifying the project read:

1. `README.md`
2. `llms.txt`
3. `CODE_PROVENANCE.yaml`
4. `INSPIRATION.md`
5. `THIRD_PARTY_NOTICES.md`
6. `.gitignore`

## Primary application

Backend:

`app/server.py`

Frontend:

`app/index.html`
`app/app.js`
`app/features.js`
`app/timelapse.js`
`app/style.css`

Support:

`app/network_import.py`
`app/legacy.py`

## Critical provenance rule

`app/credo-data-exporter_universal.py` is not project-authored code.

It is a byte-identical upstream copy from:

`credo-science/credo-api-tools`

Upstream path:

`data-exporter/credo-data-exporter_universal.py`

Verified Git blob:

`b4b09dcdba11e1db9d2215b6e8b4cb60589be671`

License:

MIT

See:

`CODE_PROVENANCE.yaml`
`THIRD_PARTY_NOTICES.md`
`LICENSES/MIT-credo-science.txt`

Do not silently rewrite, reformat or claim authorship of this file.

If it changes, update its provenance deliberately.

## Project-local code

Project-local implementation was developed iteratively under project
owner direction, including generative-AI assistance.

AI assistance is not the same as third-party source-code provenance.

Do not describe project-local code as copied from another project unless
the provenance record actually identifies such an upstream source.

## External APIs and scientific data

External services, APIs and scientific datasets are integrations or
data sources.

Do not classify API usage as copied source code unless source code was
actually incorporated.

## Conceptual inspiration

`INSPIRATION.md` records projects that influenced design concepts,
workflow or presentation.

Conceptual inspiration is not source-code provenance.

Do not claim that code from SondeHub, SatNOGS, TinyGS or another
inspiration project is incorporated unless a specific source is
explicitly recorded in `CODE_PROVENANCE.yaml`.

## Private/runtime data

Never commit:

`data/`
`logs/`
`run/`
`backups/`
`venv/`
`.venv/`
`.env`
SQLite databases
downloaded detection images
credentials
tokens
private environment files
local caches

## Configuration

Public examples belong in:

`.env.example`

Real local configuration belongs in:

`.env`

The default bind address must remain:

`127.0.0.1`

unless wider network exposure is an explicit reviewed change.

## Compatibility

Known audited production environment:

macOS 12.7.6
Intel x86_64
Python 3.14

GitHub CI currently validates source syntax using:

Python 3.12
Node.js 22

Do not claim additional platform compatibility without testing it.

## Refactoring

Avoid large behavioural refactors in the same commit as publication,
provenance, packaging, security or portability changes.

Several backend and frontend sections are large.

Refactor incrementally.

## Performance

Avoid duplicate browser polling.

Prefer shared refresh paths when possible.

## Scientific integrity

Distinguish clearly between:

- measured/detected values
- derived metrics
- heuristic classifications
- correlations
- external scientific data
- user annotations

Do not make claims stronger than the underlying data supports.

## Required validation

Before committing run:

    ./install.sh --check
    ./tools/public-preflight.sh
    git diff --check

If Node.js is available locally also run:

    node --check app/app.js
    node --check app/features.js
    node --check app/timelapse.js
