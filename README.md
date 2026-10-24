# SecureDocs

Development of a Secure System for Exchanging Digital Educational Documents between Educational Organizations.

The current prototype demonstrates exchange of one synthetic Individual Study Plan for academic mobility.

## What works now

- Preparation and confirmation of the study plan's fields.
- Six simulated source outcomes; every new check or replacement clears previous approvals and access.
- Sequential adviser, dean and registrar approval, with a reason required for returns.
- Recipient sharing and JSON manifest download through the shared builder, with seven-day expiry and revocation.
- Automated workflow, manifest and contract tests, plus a JSON schema and semantic validator.

## Install and run

Use Node.js 22 or newer and npm. From the repository root:

```sh
npm ci
npm test
```

Open `prototype/index.html` in a browser, or use Windows PowerShell:

```powershell
Start-Process (Resolve-Path .\prototype\index.html).Path
```

No build or server is required. As Student, load and confirm the fields. As Sending coordinator, run a confirmed source simulation and start the approval route. Approve as Academic adviser, Dean and Registrar, then send as Sending coordinator and download as Receiving staff. Reset or refresh clears the session.

## Validate a manifest

Validate the supplied fixture at its reproducible test time:

```sh
node contracts/validate-manifest.cjs contracts/sample-package.json --require-active --at 2026-10-24T00:00:00+05:00
```

Validate a browser download against the current clock, replacing the example path:

```sh
node contracts/validate-manifest.cjs "PATH_TO_DOWNLOAD/securedocs-demo-manifest.json" --require-active
```

`npm test` runs all `tests/*.test.cjs`. The validator checks structure and consistency; `--require-active` also requires active access at the selected time.

## Limitations

Role switching is a demonstration control and source verification is simulated. Production authentication, tenant isolation, real PDF/OCR processing, registry calls, signatures, protected storage and persistent audit are planned. Revocation cannot erase downloaded copies, and JSON validity does not establish authenticity. User benefit and production performance remain unmeasured; institutional permissions and the complete approval route require confirmation.

## Team and documentation

Danial Balmakhanov owns requirements, architecture, technology decisions and manifest generation/validation. Aslan Aldashev owns user evidence, research, the prototype workflow and evaluation. Group: SE-2426, Software Engineering. Supervisor: Aivar Sakhipov, PhD, Assistant Professor, School of Software Engineering.

Project materials: [documentation](docs/), [requirements and module interface](docs/06-requirements.md), [architecture](docs/07-architecture.md), [evaluation plan](docs/09-verification.md), and [supervisor feedback and decisions](docs/11-feedback.md). Editable diagrams and matching SVG exports are in [diagrams](diagrams/).

[Repository](https://github.com/nifflyar/SecureDocs) · [YouTrack board](https://securedocs.youtrack.cloud/agiles/204-1/current).
