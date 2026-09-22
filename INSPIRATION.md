# Inspiration and related projects

CREDO Analyzer is an independently developed project.

Its implementation, source-code provenance and conceptual inspiration
are deliberately documented as separate categories.

The projects listed below influenced ideas, workflows or presentation
patterns during development.

They must not be interpreted as sources of copied code unless a specific
file is explicitly recorded as third-party code in
`CODE_PROVENANCE.yaml`.

## CREDO

Project / ecosystem:

`CREDO — Cosmic-Ray Extremely Distributed Observatory`

Relevant organization:

`credo-science`

Relevant upstream tooling:

`credo-science/credo-api-tools`

Relationship to CREDO Analyzer:

- primary scientific ecosystem
- source of CREDO detection data
- source of the byte-identical official exporter included in this repo
- terminology and data-oriented workflow reference

Unlike the projects listed below, one CREDO source file is actually
incorporated into this repository.

That exact file and its license are recorded in
`CODE_PROVENANCE.yaml`.

## SondeHub

Relevant project:

`projecthorus/sondehub-tracker`

Conceptual influence:

- operator-facing scientific monitoring dashboard
- clear distinction between local receiver state and network data
- status-first presentation of live and historical information
- practical presentation of scientific telemetry
- public documentation aimed at both operators and developers

No SondeHub Tracker source code is recorded as incorporated into
CREDO Analyzer.

## SatNOGS

Project:

`SatNOGS — Satellite Networked Open Ground Station`

Project ecosystem:

`Libre Space Foundation / SatNOGS`

Historical GitHub organization:

`satnogs`

Conceptual influence:

- distributed citizen-science station model
- local station versus network state
- scheduled and historical observations
- operational status monitoring
- separation of acquisition, processing and network presentation

No SatNOGS source code is recorded as incorporated into CREDO Analyzer.

## TinyGS

Relevant project:

`tinygs/tinyGS`

Conceptual influence:

- compact ground-station status presentation
- community-operated sensor network model
- received-event / packet-oriented monitoring
- lightweight local-device plus network workflow
- emphasis on accessible citizen-science instrumentation

No TinyGS source code is recorded as incorporated into CREDO Analyzer.

## Internal project experience

Development of CREDO Analyzer also benefited from experience gained while
building and operating other local scientific monitoring dashboards,
including `SondeHub+ Local`.

This is an internal design/workflow relationship rather than
third-party source-code provenance.

## Attribution rule

There are three deliberately separate categories in this repository:

1. **Third-party source code**
   Exact incorporated source code.
   Recorded in `CODE_PROVENANCE.yaml`.

2. **External data/services**
   Scientific APIs and datasets consumed by the application.
   These are not source-code dependencies.

3. **Conceptual inspiration**
   Projects whose workflows, architecture, presentation or
   citizen-science model informed design decisions.
   Inspiration does not mean source-code incorporation.

If future development directly adapts or copies source code from another
project, that source must be moved from the conceptual-inspiration
category into explicit third-party provenance with its upstream source,
license and modification status recorded.
