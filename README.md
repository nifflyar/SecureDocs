# SecureDocs

Development of a Secure System for Exchanging Digital Educational Documents between Educational Organizations.

## Purpose

SecureDocs is a diploma project focused on controlled exchange of educational documents between organisations. The current academic-mobility demonstration covers synthetic preparation, simulated source confirmation, approval of the current version and recipient sharing. It addresses package consistency and provenance traceability for students, coordinators, approvers and receiving staff; benefit against manual handling remains unmeasured.

## Team

| Member | Responsibilities |
|---|---|
| Danial Balmakhanov | Requirements, architecture, technology decisions, JSON manifest generation and validation |
| Aslan Aldashev | User evidence, literature and system comparison, prototype interface, workflow and evaluation |


Supervisor: Aivar Sakhipov, PhD, Assistant Professor at the School of Software Engineering.

Programme: Software Engineering.

Group: SE-2426.

Repository: [nifflyar/SecureDocs](https://github.com/nifflyar/SecureDocs).

YouTrack project: **https://securedocs.youtrack.cloud/**.

## Current components and assessed design

The implementation provides the pure browser/CommonJS manifest builder, schema 1.0, a synthetic fixture, a Draft 2020-12 validator, an interactive browser workflow and deterministic tests. Assessed sections include the [proposal](docs/01-proposal.md), [relevance evidence](docs/02-relevance.md), [literature](docs/03-literature.md), [systems](docs/04-systems.md), [technology decisions](docs/05-technology.md), [requirements](docs/06-requirements.md), [architecture with three editable diagrams](docs/07-architecture.md), [UX](docs/08-ux.md), [evaluation](docs/09-verification.md), and [project management and risks](docs/10-management.md). [Supervisor feedback and resulting decisions](docs/11-feedback.md) records the existing consultation and its effect on the design; review of the completed deliverables remains pending. Final report assembly and consolidated final results remain a later phase.

The prototype supports preparation, field confirmation, six simulated source outcomes, sequential adviser/dean/registrar decisions, reasoned returns, replacement, send, JSON download, revocation and seven-day expiry. Replacement and every source recheck invalidate approvals/access. Browser download integration was checked against the merged validator with `--require-active`; keyboard and narrow-layout checks were also exercised. The state and module interface remain as specified in [section 6](docs/06-requirements.md#browser-state-and-integration-interface).

The UI uses plain HTML/CSS/JavaScript; Node.js runs the Ajv validator and tests. FastAPI, PostgreSQL and a worker are proposed production technologies, not deployed components. Role switching is a demonstration control; verification is simulated. Production authentication, tenant isolation, registry access, PDF/OCR, signatures, secure storage and persistent audit are not implemented. Revocation cannot erase downloaded copies. Institutional role confirmation, evidence permissions and representative-user qualification of S1 remain unresolved. Supervisor feedback is required for this submission; the available consultation is documented in section 11, while a response on the completed deliverables remains pending. No improvement, OCR accuracy or production performance target has been measured.

Editable diagrams are in `diagrams/*.drawio`, with matching SVG exports. After editing a source in diagrams.net, export its SVG again to keep the figures consistent.

## Setup and checks

Use Node.js 22 or newer and npm. From the repository root:

```sh
npm ci
npm test
node contracts/validate-manifest.cjs contracts/sample-package.json
node contracts/validate-manifest.cjs contracts/sample-package.json --require-active --at 2026-10-24T00:00:00+05:00
```

`npm test` runs all available `tests/*.test.cjs`, including the model, manifest and contract suites. The fixed-time `--at` example keeps fixture validation reproducible; omit `--at` to check active access against the current clock. Without `--require-active`, a coherent archived manifest may pass even after expiry/revocation. CLI exit codes are 0 (valid), 1 (invalid manifest) and 2 (arguments or file/JSON error). Passing validation proves neither authenticity nor live access.

Launch locally from the repository root in Windows PowerShell:

```powershell
Start-Process (Resolve-Path .\prototype\index.html).Path
```

This opens the static prototype in the default browser; no build or server is required. It is also compatible with a local static HTTP server. Start as Student, load and confirm fields; switch to Sending coordinator, confirm the simulated source and start the route. Switch to Academic adviser, Dean and Registrar to approve in order; switch back to Sending coordinator to send, then Receiving staff to download. Refresh or Reset demo clears the in-memory session.

Validate the actual browser download, replacing the path with the browser's saved file location:

```sh
node contracts/validate-manifest.cjs "PATH_TO_DOWNLOAD/securedocs-demo-manifest.json" --require-active
```

For CommonJS use `require('./prototype/manifest.js').buildManifest(state, {role, now})`; a classic browser script exposes `SecureDocsManifest.buildManifest`. The builder reads no clock/network and mutates no input. It requires explicit timezone-qualified timestamps and the complete current approved state described in section 6. The download action must recheck export conditions and display any returned error.

The fixture's hash is SHA-256 of `SecureDocs synthetic fixture v1` encoded as UTF-8 without a newline. No real student PDF is present or hashed. The retained `learning_agreement` code labels the synthetic ISP and does not establish external standards compliance.
