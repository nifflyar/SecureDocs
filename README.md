# SecureDocs

Development of a Secure System for Exchanging Digital Educational Documents between Educational Organizations.

## Purpose

SecureDocs is a diploma project focused on controlled exchange of educational documents between organisations. The initial demonstration will cover an academic mobility workflow: preparing a document, confirming its source, approving its current version and sharing it with a recipient.

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

This first implementation provides the pure browser/CommonJS manifest builder, schema 1.0, a synthetic fixture, a Draft 2020-12 validator and deterministic tests. It also provides the [proposal](docs/01-proposal.md), [technology decisions](docs/05-technology.md), [requirements](docs/06-requirements.md) and [architecture with three editable diagrams](docs/07-architecture.md).

The workflow model, browser interface (`model.js`, `app.js`, `index.html`) and model tests are planned and are not present in this checkout. There is no interactive application to launch. The state and module interface are specified in [section 6](docs/06-requirements.md#browser-state-and-integration-interface). Browser integration checks have not been completed. Production authentication, tenant isolation, registry access, OCR, signatures and protected storage are not implemented.

Editable diagrams are in `diagrams/*.drawio`, with matching SVG exports. After editing a source in diagrams.net, export its SVG again to keep the figures consistent.

## Setup and checks

Use Node.js 22 or newer and npm. From the repository root:

```sh
npm ci
npm test
node contracts/validate-manifest.cjs contracts/sample-package.json
node contracts/validate-manifest.cjs contracts/sample-package.json --require-active --at 2026-10-24T00:00:00+05:00
```

`npm test` runs all available `tests/*.test.cjs`, including model tests when available. The fixed-time `--at` example keeps fixture validation reproducible; omit `--at` to check active access against the current clock. Without `--require-active`, a coherent archived manifest may pass even after expiry/revocation. CLI exit codes are 0 (valid), 1 (invalid manifest) and 2 (arguments or file/JSON error). Passing validation proves neither authenticity nor live access.

Once the planned browser interface is available, its downloaded manifest can be checked with:

```sh
node contracts/validate-manifest.cjs securedocs-demo-manifest.json --require-active
```

For CommonJS use `require('./prototype/manifest.js').buildManifest(state, {role, now})`; a classic browser script exposes `SecureDocsManifest.buildManifest`. The builder reads no clock/network and mutates no input. It requires explicit timezone-qualified timestamps and the complete current approved state described in section 6. The download action must recheck export conditions and display any returned error.

The fixture's hash is SHA-256 of `SecureDocs synthetic fixture v1` encoded as UTF-8 without a newline. No real student PDF is present or hashed. The retained `learning_agreement` code labels the synthetic ISP and does not establish external standards compliance.
