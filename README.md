# CREDO Analyzer

Local web dashboard and research workspace for detection data associated
with the CREDO (Cosmic-Ray Extremely Distributed Observatory) ecosystem.

CREDO Analyzer provides a browser interface for archiving, reviewing,
visualising and analysing detections while keeping runtime databases,
downloaded images and local configuration outside the public repository.

## Screenshots

### Dashboard

![CREDO Analyzer dashboard](docs/screenshots/credo-dashboard-overview.png)

### Detection timelapse

![CREDO Analyzer detection timelapse](docs/screenshots/credo-timelapse.png)

### Research candidates

![CREDO Analyzer research candidates](docs/screenshots/credo-research-candidates.png)

## Requirements

Known audited production environment:

- macOS 12.7.6
- Intel x86_64
- Python 3.14

The public installation profile requires Python 3.10 or newer.

GitHub Actions currently validates the project with:

- Python 3.12
- Node.js 22

Required local tools:

- Python 3
- Python venv
- curl
- network access when external CREDO/scientific data is used

Python dependencies are listed in `requirements.txt`.

Cross-platform support outside the audited environment should be
verified independently.

## Configuration

Local configuration is provided through `.env`.

Create it from the example:

    cp .env.example .env

Default configuration:

    CREDO_HOST=127.0.0.1
    CREDO_PORT=8091
    CREDO_OPEN_BROWSER=1

Optional path overrides are documented in `.env.example`.

The real `.env` file is ignored by Git.

## Network access

The default bind address is:

    CREDO_HOST=127.0.0.1

This keeps the dashboard accessible only from the local machine.

For access from a trusted LAN it can be changed explicitly to:

    CREDO_HOST=0.0.0.0

CREDO Analyzer does not provide built-in public-Internet authentication
or TLS termination.

Do not expose it directly to the public Internet without an
authenticated reverse proxy, VPN or another trusted access layer.

## Installation

First perform a read-only readiness check:

    ./install.sh --check

The check verifies:

- required project files
- Python availability
- Python source syntax
- shell syntax
- upstream CREDO provenance

It does not install packages and does not start the application.

Prepare the local installation with:

    ./install.sh

The installer:

- creates a local Python virtual environment
- installs dependencies from `requirements.txt`
- creates runtime directories
- creates `.env` from `.env.example` if needed
- does not start CREDO Analyzer automatically

## Usage

Start:

    ./start-credo.command

Status:

    ./status-credo.command

Health check:

    curl http://127.0.0.1:8091/healthz

Stop:

    ./stop-credo.command

Default browser address:

    http://127.0.0.1:8091/

## Runtime data

Runtime data is deliberately excluded from Git.

This includes:

- SQLite databases
- downloaded detection images
- logs
- PID/run files
- caches
- backups
- Python virtual environments
- `.env`

A fresh installation creates its own runtime environment.

## Repository layout

    app/
        server.py
        index.html
        app.js
        features.js
        timelapse.js
        style.css
        legacy.py
        network_import.py
        credo-data-exporter_universal.py

    docs/
        screenshots/

    tools/
        public-preflight.sh
        verify-provenance.sh

    .env.example
    install.sh
    start-credo.command
    status-credo.command
    stop-credo.command
    requirements.txt
    AGENTS.md
    llms.txt
    INSPIRATION.md
    CODE_PROVENANCE.yaml
    THIRD_PARTY_NOTICES.md
    CITATION.cff
    LICENSE

## CREDO integration and acknowledgements

CREDO Analyzer is an independent project for local analysis and
visualisation of data associated with the wider CREDO ecosystem.

The repository contains an unmodified upstream CREDO utility:

    app/credo-data-exporter_universal.py

Its upstream source is:

    credo-science/credo-api-tools
    data-exporter/credo-data-exporter_universal.py

The exact upstream Git blob and license are documented in:

- `CODE_PROVENANCE.yaml`
- `THIRD_PARTY_NOTICES.md`
- `LICENSES/MIT-credo-science.txt`

The exact upstream file is verified automatically by:

    ./tools/verify-provenance.sh

External APIs and scientific datasets are integrations/data sources.
They are not automatically classified as copied source code.

## Inspiration and related projects

CREDO Analyzer is independently developed, but its design and workflow
were informed by experience with open scientific and citizen-science
projects.

Conceptual references include:

- `projecthorus/sondehub-tracker` — scientific monitoring dashboards,
  operator status and telemetry presentation
- `SatNOGS / Libre Space Foundation` — distributed citizen-science
  stations, observation history and local-versus-network state
- `tinygs/tinyGS` — compact station status, event-oriented monitoring
  and community-operated sensor networks

These references describe conceptual inspiration only.

They do **not** mean that source code from those projects was
incorporated into CREDO Analyzer.

Exact third-party source-code provenance is recorded separately in
`CODE_PROVENANCE.yaml`.

See `INSPIRATION.md` for the detailed classification.

## GitHub topics

`credo` · `cosmic-rays` · `citizen-science` · `data-analysis` ·
`python` · `visualization`

## Development

The current implementation grew from an operational local installation.

Some backend and frontend modules are intentionally large.

Behaviour-preserving incremental refactoring is preferred over large
rewrites.

Before committing changes run:

    ./install.sh --check
    ./tools/public-preflight.sh
    git diff --check

GitHub Actions performs additional Python, JavaScript, shell,
provenance and publication checks.

## AI agents and automated tools

This repository includes:

- `AGENTS.md` — editing and provenance rules
- `llms.txt` — concise repository index for automated tools

Agents should read both files before editing.

Important rules:

- never invent credentials or private local paths
- never commit runtime databases or downloaded detections
- preserve the byte-identical upstream CREDO exporter unless provenance
  is deliberately updated
- distinguish project-local code from third-party source code
- distinguish scientific data/API usage from copied code
- keep localhost binding as the safe default
- run repository validation after changes

## Citation

Citation metadata is provided in:

    CITATION.cff

## License

CREDO Analyzer project-local code is released under the MIT License.

Copyright (c) 2026 `Tomasz`.

See the root `LICENSE` file.

Third-party components retain their original licenses and copyright
notices.

See:

- `THIRD_PARTY_NOTICES.md`
- `CODE_PROVENANCE.yaml`
- `LICENSES/`
