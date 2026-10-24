# 6 Requirements specification

## Scope, priority and evidence

**M** = must, **S** = should, **C** = could. **Current** means the implemented builder/validator; **Current demo** means the implemented interactive UI and workflow model; **Production** means a future protected service. A requirement can span these levels without claiming that the production control exists. Model, manifest, contract and browser checks exercise demonstration acceptance conditions; production conditions and performance targets remain planned. The requirement-to-test mapping is in section 9.

Evidence identifiers refer to the three substantive discussions described in [section 1](01-proposal.md#evidence-and-problem): I1 = recorded staff diploma-verification discussion; I2 = recorded international-cooperation discussion; S1 = substantive written expert consultation with the academic supervisor (date not recorded). Requirements citing S1 are informed by the supervisor consultation, not attributed to the two recorded discussions. Design-derived requirements are marked **Design**, not presented as participant statements. Exact institutional approval roles require confirmation. No user-study, performance or deployment result is asserted here.

## Functional requirements

| ID / priority | Requirement and basis | Acceptance condition and implementation scope |
|---|---|---|
| FR-01 M | Accept educational PDF documents with type and owner (S1). | **Production:** a valid PDF up to 20 MB creates a private immutable version; reject unsupported, corrupt or encrypted input with an English explanation. **Current demo:** a synthetic load action only; never claim a real PDF upload. |
| FR-02 M | Extract fields for human confirmation (S1). | **Production:** show field/page provenance and require confirmation of mandatory fields. **Current:** `loaded=true` and `fields=true` are necessary for export; missing/false/truthy-string flags fail. **Current demo:** present those states honestly without OCR claims. |
| FR-03 S | Reuse a trusted transcript source where permitted (I2 03:30–04:00). | **Production:** an adapter preserves source/time; if no permitted API exists, an authorised manual upload remains available and is labelled manual. No adapter is implemented here. |
| FR-04 M | Separate document copy from provenance confirmation (I2 02:05–02:57). | **Current:** a completed manifest cannot use `student_copy`; simulation records `manual_confirmed`, method, source, time and limitations. **Production:** only an authorised source decision can set issuer confirmation; a student-uploaded file alone cannot. |
| FR-05 M | Enforce package completeness (I2 01:02–01:34; Design). | **Production:** a selected template lists missing mandatory items and blocks sending. **Current demo:** only one synthetic ISP is required; both load and field-confirmation flags gate the route. **Current:** builder always exports exactly that one item. |
| FR-06 M | Approve sequentially (I2 04:00–05:32; Design role names). | **Current demo:** adviser → dean → registrar; wrong-role/out-of-order actions fail, a return requires a reason and closes the route. **Current:** exactly three ordered current approvals and a started route are required for export. |
| FR-07 M | Bind decisions to the current version (I2 04:00–05:32; Design). | **Current demo:** replacement increments version and clears confirmation, decisions, grant and timestamps. **Current:** reject any approval/sent-version mismatch and non-positive, fractional or unsafe versions. **Production:** retain old immutable decisions as history, never permission for a new version. |
| FR-08 M | Distinguish source outcomes (S1; I2 02:05–02:57). | `not_checked`, `confirmed`, `mismatch`, `not_found`, `unavailable`, `manual_review` are distinct. **Current:** only `confirmed` permits export. **Current demo:** every new check, including re-confirmation, invalidates prior approvals/grant. **Production:** a timeout is `unavailable`; absence of a record is `not_found`, not proof of forgery. |
| FR-09 M | Explain the basis and limits of verification (S1). | **Current:** include version/hash, method, source, checked time, outcome and nonempty limitations; reject missing or blank method/source/limitations. **Current demo:** recipient can read this explanation. A valid manifest is never labelled authentic solely because validation passes. |
| FR-10 M | Share with a specified receiving organisation (I2 05:32–06:57; Design). | **Current:** fixed distinct synthetic organisation IDs; only `recipient` can invoke successful export. **Current demo:** coordinator sends the approved current version, sets `sentAt` and a seven-day expiry, rejects duplicate live sends. **Production:** server verifies recipient membership/object permission on every download and rejects another organisation even if it knows the ID. |
| FR-11 M | Revoke and expire future access (Design). | **Current:** only an active grant and `now < expiresAt` export; exact equality fails. CLI `--require-active` applies the same expiry boundary to the supplied file. **Current demo:** recheck in-memory access at download, not only when rendering the button. **Production:** recheck the server-held live grant. Revocation does not erase an already downloaded copy. |
| FR-12 M | Export a versioned JSON manifest (S1). | **Current:** output passes Draft 2020-12 schema 1.0 and semantic checks; unknown schema versions, extra fields, bad references/order/version/time fail. Browser and CommonJS produce equivalent output without input mutation or network calls. **Current demo:** download `securedocs-demo-manifest.json`. **Production:** idempotent import prevents duplicate packages; import is not implemented now. |
| FR-13 S | Support XML when a receiving contract exists (S1). | **Production:** only after defining the target schema; round-trip tests preserve all mandatory fields. No XML interoperability claim now. |
| FR-14 M | Enforce roles and tenant isolation (Design). | **Production:** negative API tests deny cross-tenant reads/writes, privilege changes and unauthorised approvals; administration does not confer academic approval. **Current demo:** role selection illustrates workflow, not security. |
| FR-15 M | Record auditable actions (I1 00:00–00:18; Design). | **Production:** record actor, organisation, action, object/version, time, outcome and correlation ID for successes/denials without document content or secrets. **Current demo:** in-memory `events` explain actions; **Current:** accepts an events array, does not attest to its history. |
| FR-16 S | Manage institutional trust and keys (Design). | **Production:** rotate/revoke keys and reject unknown/revoked signing keys under the agreed trust policy. No keys or signatures are implemented in this increment. |
| FR-17 C | Present a document portfolio (S1). | **Production:** a view links to source records and clearly marks unsupported statements; aggregation cannot turn an unverified record into a verified one. |

## Non-functional requirements

| ID / priority | Requirement | Testable acceptance condition and scope |
|---|---|---|
| NFR-01 M | Tenant separation and least privilege | **Production:** cover every protected operation with allowed-role and cross-tenant denial cases, including guessed IDs and administrator attempts to approve. |
| NFR-02 M | Safe uploads and external references | **Production:** enforce 20 MB plus a configured page limit, inspect content, quarantine input; deny loopback/private/link-local destinations, unsafe redirects and DNS rebinding in isolated source fetching. **Current:** source references are text only; builder/validator make no fetch. |
| NFR-03 M | Version integrity | **Current:** stale references and approvals fail. **Production:** byte changes and signed-field changes fail trusted integrity verification; race tests cannot send a version replaced during authorisation. A syntax-valid hash alone is insufficient. |
| NFR-04 M | Predictable failure and retry | **Current demo:** negative verification never restores old decisions; duplicate active send fails. **Production:** retry/crash tests prove idempotent effects and bounded retries; no timeout becomes confirmation. |
| NFR-05 M | Data minimisation and secrets | **All stages:** only synthetic documents/IDs in Git and tests; inspect logs and exports for real records, personal identifiers, tokens and keys. **Production:** public QR links still require authorisation and disclose no private content. |
| NFR-06 S | Metadata response time | **Production target, unmeasured:** p95 ≤2 seconds with 20 concurrent users and 10,000 records, excluding OCR; report hardware, dataset, duration and error rate. |
| NFR-07 S | Recoverability | **Production targets, unmeasured:** RPO ≤24 hours and RTO ≤4 hours, demonstrated by restoring a backup and verifying referenced files/versions. |
| NFR-08 M | Accessible English interface | **Current demo:** complete the route by keyboard, with visible focus, text errors and non-colour-only states; test narrow layouts. **Current:** returned errors and CLI messages are English. |
| NFR-09 S | Reproducible maintenance | **Current:** locked dependencies, `npm ci` and `npm test` from README; tests use fixed clocks. **Production:** version migrations/contracts and recover deliberately from unsupported versions. |

## Browser state and integration interface

Canonical roles are `student`, `coordinator`, `adviser`, `dean`, `registrar`, `recipient`. Use these identifiers in logic; display labels may be human-readable. The model must keep:

| Field | Required meaning |
|---|---|
| `version` | Positive safe integer; replacement increments it. |
| `loaded`, `fields` | Booleans for the synthetic document and confirmed fields. |
| `verification` | One of the six source outcomes above. |
| `started` | Boolean; true for the running/completed route used by a valid export, false before start or after return/reset. |
| `approvals` | Ordered array of `{role, version}`; approved decisions only, never stale ones. |
| `grant` | `active`, `revoked`, `expired`, or a model-specific inactive initial value; only `active` exports. |
| `sentVersion` | Sent document version; null before send. |
| `verifiedAt`, `sentAt`, `expiresAt` | Null before the relevant action, then timezone-qualified ISO strings. |
| `events` | Array of demonstration events; not a protected audit trail. |

Load `prototype/manifest.js` as a classic script. Call `SecureDocsManifest.buildManifest(state, {role, now})` at the download action; CommonJS callers use `require('./prototype/manifest.js').buildManifest`. It returns a new plain manifest or throws an English `Error`. It reads no model, network or current clock. The caller supplies `now`. `parseTimestamp` is also exported for the Node validator to share the same date rules; UI code needs only `buildManifest`.

Time strings follow a documented ISO 8601 profile: `YYYY-MM-DDTHH:mm:ss[.SSS]Z` or a numeric `±HH:MM` offset; fractional seconds may have one to three digits. Valid Gregorian dates, years 0001–9999 and known offsets are required. Missing zones, unknown `-00:00`, leap seconds, hour 24 and finer-than-millisecond precision are rejected rather than silently normalised. Compare instants, not lexicographic strings.

For export require `loaded=true`, `fields=true`, `started=true`, an events array, `verification=confirmed`, `grant=active`, `sentVersion=version`, exactly adviser/dean/registrar approvals at `version`, and **`verifiedAt <= sentAt <= now < expiresAt`**. The builder does not change state or grant access. The workflow model shall expose `act(state, role, type, value, {now})`, keeping the fifth argument optional and the original four-argument call shape. Deterministic model tests must supply a clock.

Implemented demonstration transitions: replacement resets fields, verification, route, decisions, access and timestamps; every verification invalidates the route/decisions/grant, setting `verifiedAt` only for confirmation; return requires a reason and explicit restart; send establishes current version/time and seven-day expiry; duplicate sending while a live grant exists fails; simulated expiry changes both the grant and deadline; revoke blocks subsequent export. Re-confirmation must not resurrect old approvals.

## Mapping and validator limits

The builder emits schema `1.0`, `demo=true`, purpose `academic_mobility`, package `SD-DEMO-001`, sender `DEMO-HOME`, recipient `DEMO-PARTNER`, one `DOC-DEMO-001` of type `learning_agreement`, current version, and the synthetic hash explained in section 5. Provenance is `manual_confirmed`; method `simulated_coordinator_confirmation`; source `demo://coordinator/1`; `checkedAt=verifiedAt`. It explicitly states synthetic data, no external query and no signature. Each approval references the same document/version and has decision `approved`; access maps the active grant and expiry.

The CLI first validates the unchanged structural schema, then checks the demo marker, distinct nonblank organisations, unique document IDs, safe versions, confirmed provenance, nonblank evidence, ordered approvals for each current document and timestamp relationships. It can validate multi-document schema-1.0 archives, although this builder emits only one synthetic ISP.

Without `--require-active`, revoked/expired archives may pass if their internal structure and completed approvals remain coherent; this grants no access. With `--require-active`, status must be active and verification times must be at or before `--at` (or the current clock), which must be strictly before expiry. `--at` alone also rejects future verification but does not require a live grant. Invalid CLI arguments/unreadable JSON exit 2, invalid manifests exit 1, valid manifests exit 0.

Schema 1.0 has no `sentAt`, runtime role, signature or trusted live grant lookup. The CLI therefore cannot establish send-time ordering, caller identity, current revocation, authenticity or permission to download; the builder checks the supplied state's send-time ordering, and a future server must enforce real authorisation. A downloaded file with `active` status can become stale. Passing either validator is not proof that the browser workflow ran or that a document exists.
