# 5 Technology comparison

FastAPI, PostgreSQL and a database-backed worker are selected as the proposed production stack because they fit the document-processing domain and transactional workflow. The current increment uses browser JavaScript and a Node.js/Ajv validator. The comparisons explain trade-offs and implementation effort rather than claiming benchmark superiority.

## Decision basis

The team has two contributors, a document-oriented domain and an intended Python processing pipeline. Correct version references, recoverable failure handling and tenant separation matter more than unmeasured throughput rankings. Comparisons below are design judgements based on primary documentation, consulted on 24 October 2026. They are not benchmark results. The JavaScript manifest module, browser UI/workflow model and Node validator are implemented in this increment; the server, database and worker remain planned.

## Decision 1 — application server

| Alternative | Relevant capability | Trade-off for SecureDocs |
|---|---|---|
| FastAPI | Python typing, request validation, OpenAPI and dependency injection. [Official features](https://fastapi.tiangolo.com/features/) | Fits the planned Python extraction pipeline. Object-level authorisation, administration and durable jobs still require explicit design. |
| Django | ORM, migrations and a model-driven administration interface. [Official overview](https://docs.djangoproject.com/en/stable/intro/overview/) | Attractive for administration-heavy workflows; API structure and background processing must still be selected. |
| NestJS | TypeScript application structure with modules, controllers and providers. [Official introduction](https://docs.nestjs.com/first-steps) | Fits a TypeScript team; Python document processing would add a language/process boundary. |

**Decision:** retain FastAPI as the proposed production server, organised as a modular monolith with access, packages, workflow and reporting modules. This follows FR-01/02/08 and NFR-09; it does not imply that FastAPI supplies tenant security automatically. Django is a reasonable replacement if administration dominates; NestJS becomes preferable if the team's validated implementation capacity is primarily TypeScript. Do not split services before a measured scaling or deployment need exists.

## Decision 2 — metadata persistence

| Alternative | Relevant capability | Trade-off for SecureDocs |
|---|---|---|
| PostgreSQL | Primary/foreign keys, unique/check constraints and relational integrity. [Official constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) | Suits memberships, immutable versions, approvals and grants; requires an operated database and disciplined transaction boundaries. |
| MongoDB | Atomic single-document writes and multi-document ACID transactions. [Official transactions](https://www.mongodb.com/docs/manual/core/transactions/) | Flexible document layout; cross-package references and uniqueness still need deliberate modelling. It is not correct to claim MongoDB lacks transactions. |
| SQLite | Embedded persistence with low administration overhead; one writer at a time per database. [Official use cases](https://www.sqlite.org/whentouse.html) | Useful for a local prototype; less suitable for the intended shared concurrent service and separate workers. |

**Decision:** plan PostgreSQL for metadata and a private object store for document bytes (FR-07/10/14, NFR-01/03). `PackageItem` and `Approval` reference an immutable `DocumentVersion`. Grant creation and its audit/job record must share a transaction. A failed file upload must not produce a ready package. Database constraints supplement application authorisation; they do not authenticate a user. Reconsider only if measured workload or deployment constraints justify a different data model.

## Decision 3 — slow verification/extraction work

| Alternative | Failure behaviour | Operational trade-off |
|---|---|---|
| Synchronous HTTP processing | The request waits; an interrupted request leaves completion ambiguous unless the operation is idempotent. | Smallest deployment, unsuitable for an assumed fast request while slow OCR/remote checks run. |
| HTTP plus database job/outbox and worker | A committed job can be retried after worker failure; a lease and idempotency key are required. PostgreSQL documents `SKIP LOCKED` for queue-like consumers, not general consistent reads. [Official SELECT](https://www.postgresql.org/docs/current/sql-select.html) | Reuses the metadata store, but the team must implement leases, bounded retries, deduplication and recovery. |
| Kafka-backed event processing | Durable event streams decouple producers and consumers. [Official introduction](https://kafka.apache.org/intro/) | Appropriate for multiple independent event consumers; adds broker operation and does not by itself make business side effects exactly once. |

**Decision:** use HTTP plus a database-backed job/outbox and worker for the planned MVP (FR-08/15, NFR-04). Include a job ID, timeout, bounded backoff, lease recovery and idempotent effects. Treat an unavailable source as `unavailable`, never as confirmation. FastAPI's in-process background tasks are useful for small follow-up actions; its [official caveat](https://fastapi.tiangolo.com/tutorial/background-tasks/#caveat) distinguishes heavier processing requiring other tools. They are not our durable queue. Kafka is deferred until independently justified.

## Decision 4 — manifest validation in this increment

| Alternative | Benefit | Limitation |
|---|---|---|
| Hand-written property checks alone | No dependency and easy local assertions. | Easy to miss nested properties, required fields and schema dialect rules; not an acceptable replacement for the contract. |
| Ajv's Draft 2020-12 implementation plus semantic checks | Compiles the supplied standard schema and reports structural errors; custom checks enforce document references, ordered approvals and time relationships. [Ajv dialect documentation](https://ajv.js.org/json-schema.html#draft-2020-12-breaking) | Requires a pinned dependency and separate cross-field code; passing validation still says nothing about authenticity. |

**Decision:** use `ajv/dist/2020` in strict mode with no coercion, defaults or removal of properties. Keep schema 1.0 and its existing field mapping. The builder is dependency-free for a classic browser script and CommonJS; Node's built-in test runner covers all available `tests/*.test.cjs`. The schema allows some general contract states; the CLI additionally applies the completed-demo profile (`demo=true`, confirmed provenance and three ordered approvals per document). Archive validation and active-access validation are explicitly different. See section 6 for their precise limits.

## Security design and limits

TLS and protected storage are proposed for production. A hash detects a byte change only against a trusted expected hash; anyone can recompute an untrusted hash. A future signed manifest must bind document hashes, versions, sender, recipient, purpose and validity period under an agreed canonicalisation/signature profile. Verification must include trusted issuer identity, key status, rotation/revocation and replay policy. A self-generated demonstration key is not a qualified institutional signature. NCALayer/national-signature interoperability and any legal effect remain unverified; this increment implements no signing.

Keys must be managed separately from encrypted data with controlled access, recovery and rotation, following the design principles in [OWASP cryptographic storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html). Server-side OCR requires server access to plaintext, so the proposed OCR architecture must not be advertised as end-to-end encryption from student to recipient.

The fixture uses a reproducible synthetic SHA-256 value, independently checked by the manifest tests; it represents no student PDF. `learning_agreement` is the retained schema code for the synthetic ISP, not a claim of external Learning Agreement compliance.

Threats, proposed controls and verification conditions are mapped in section 7. Revisit technology choices if a permitted external API imposes a different exchange/signature profile, operational recovery tests fail, or measured processing requirements change. Use only synthetic documents until the team has established an authorised processing basis and controls for real records.
