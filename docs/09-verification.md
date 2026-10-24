# 9 Verification and evaluation plan

Verification covers workflow correctness and manifest integration using synthetic fixtures and explicit clocks. A separate planned experiment compares the prototype with email-style exchange and a manual register under matching conditions. Requirement-to-test mapping distinguishes observed demonstration checks from unmeasured security, extraction and performance targets.

## Evaluation layers

Evaluation separates implemented demonstration correctness, future server security, extraction quality and benefit to the university process. A passing state-machine or schema test cannot establish user benefit, authenticity, tenant isolation or legal recognition. Targets in this section are planned thresholds, not measurements. The current executable datasets are synthetic state fixtures in `tests/model.test.cjs`, the existing manifest/contract tests and `contracts/sample-package.json`.

## Reproducible baseline and process experiment

The proposed baseline is email-style message exchange, a local file folder and a manual register containing package ID, version, field confirmation, source outcome/time, three decisions, recipient and access deadline. It reproduces the reported channels without sending real messages or contacting participants. The comparison uses the same synthetic values displayed by the prototype: `DEMO-STUDENT-001`, `DEMO-HOME`, `DEMO-PARTNER`, Spring 2027 and course `DEMO-CS101` with 5 credits. Version 2 is a replacement of the same synthetic item. No personal records are required.

Both conditions receive the same scripted source/approval responses. The baseline operator updates the register and identifies the permitted final recipient result; the prototype operator performs the corresponding actions. Every run begins with an empty register/folder or reset browser session. Tasks end only when the correct state and its evidence are identified, not when an attempted action returns. The seven-day deadline is a design condition shared by both arms, not a measured university deadline.

| Dataset case | Scripted input and expected result |
|---|---|
| B01 | Missing item or unconfirmed fields: reject send and identify the missing preparation step. |
| B02 | Confirmed v1 with adviser/dean/registrar responses in order: send to the fixed recipient and identify evidence/time. |
| B03 | Return at dean with reason “Correct course selection”: close route; restart requires fresh sequential decisions. |
| B04 | Approved/sent v1 then replacement v2: old decisions/access cannot authorise v2. |
| B05 | Sent v1 then a new check: repeat for all six source outcomes; previous grant and decisions always become invalid. |
| B06 | Duplicate live send, revocation, expiry exactly at the deadline and one millisecond either side: apply the same rules in both arms. |

Two team members perform one excluded practice run and five measured repetitions of each case per condition. Member A alternates baseline/prototype order by repetition; member B uses the opposite order. The source/decision response script is instantaneous in both arms; separately recorded external waiting is not included in active handling time. This is a technical pilot, not a representative user sample or independent evaluator study. Synthetic and repetitive tasks may favour the prototype; learning and author familiarity are threats to validity.

The recorded conditions include revision, browser/OS, CPU/RAM, viewport, input method, case order, participant code, start/end time, interruptions, errors and corrections. Both arms use the same machine and input method. A manual entry is one completed field value; an upload/load is one item insertion; a correction counts as an additional action. Timing starts at the first case action and ends at the correct state/evidence identification. An incorrect terminal state is a failure, not a faster completion. Raw records are retained for final evaluation; this corpus and its timed runs have not yet been produced.

| Metric | Calculation and planned target | Interpretation limit |
|---|---|---|
| Active handling time | Per-case paired medians, range and sample count; target ≥20% reduction, `(baseline - prototype) / baseline × 100` | Unmeasured; no claim about partner waiting or all users. |
| Repeated actions | Count manual field entries and item loads per successful case; target below baseline | Same input/output obligation in each arm; corrections are counted. |
| Completeness decisions | Incorrect acceptance/rejection count; target zero missed required items in B01 | One-item demo does not validate production multi-document templates. |
| Stale authority | Successful sends/downloads after replacement/recheck divided by attempts; target 0 | Model correctness only now; server race checks remain necessary. |
| False source confirmation | Negative/unavailable outcomes incorrectly promoted to confirmed; target 0 | Simulated responses do not measure registry accuracy. |
| Field extraction | Exact match per required field, macro averages by language/type; target ≥95% | Future experiment, not implemented; human confirmation remains required. |
| Metadata performance | p50/p95 plus error rate; target p95 ≤2 seconds at 20 concurrent users and 10,000 records | Future server target; exclude OCR/source latency and report them separately. |
| Recovery | Measured restored-data loss and elapsed recovery; RPO ≤24 hours, RTO ≤4 hours | Future backup/restore exercise; no current persistence. |

## Future extraction and service datasets

The planned extraction corpus contains at least 60 synthetic or explicitly permitted documents: 3 types (diploma, certificate, transcript) × 2 languages (Russian, Kazakh) × 10 items. English remains the language of assessed artifacts and UI. Three disjoint issuer/template families per type-language cell allocate 4 items to training, 3 to development and 3 to test (24/18/18 overall). Template families, issuer identities and near-duplicates cannot cross splits. This small test set yields descriptive results only. A manifest of document IDs, language/type, template family, perturbations and expected fields is fixed before model selection; none of these future documents is claimed to exist now.

Two annotators independently label required fields and resolve disagreements before scoring. Normalisation is Unicode NFC, trimmed/collapsed whitespace and ISO dates only where the date is unambiguous; names/identifiers are not fuzzily matched. Rotations, low-resolution scans and deliberate typos are identified as separate slices. OCR-plus-rules, LayoutLMv3, Donut and LiLT use identical splits and frozen settings selected only on development data. Report exact-match failures, missing fields, correction time, inference latency and memory per method; publish no inferred authenticity score.

Future API data includes three synthetic organisations with overlapping local identifiers, each allowed and denied role/action pair, guessed object IDs and grants invalidated between authorisation and download. The load experiment fixes hardware, seed, record generator and request mix, warms up for 2 minutes and measures three 10-minute runs at 20 concurrent users. The recovery experiment restores an isolated backup and checks version/file references. These datasets and service experiments remain planned.

## Requirement-to-test mapping

| Test | Requirement coverage | Procedure and expected result | Current scope / executable evidence |
|---|---|---|---|
| VT-01 | FR-01/02/05; NFR-02 | Reject unprepared item and unconfirmed fields; later reject corrupt, encrypted, oversized PDF and incomplete multi-item packages | Model preparation tests cover synthetic flags only. Real upload/template tests planned. |
| VT-02 | FR-06/14; NFR-01/08 | Attempt every action under all six roles; reject wrong approval order; production denies cross-tenant IDs and privilege escalation | Model role matrix and browser negative actions implemented; authentication/tenant API checks planned. |
| VT-03 | FR-06/07; NFR-03 | Replace approved/sent v1; v2 clears fields/source/decisions/grant/timestamps. Return needs reason and explicit restart | Model replacement/return tests; browser replacement denial. Concurrent server writes planned. |
| VT-04 | FR-03/04/08/09; NFR-04 | Recheck all six outcomes, including reconfirmation; no stale decisions/access; unknown outcomes fail | Model outcome loop and recipient report; live adapter and manual-import authority planned. |
| VT-05 | FR-08; NFR-02 | Reject loopback/private/link-local destinations, unsafe redirects and DNS rebinding; preserve unavailable outcomes | Planned fetcher tests; current builder/model never query a source. |
| VT-06 | FR-10/12; NFR-04 | Reject duplicate live send; resend after revocation/expiry establishes a new seven-day deadline; future crash/retry tests prove idempotency | Model send tests and browser duplicate rejection; worker/API recovery planned. |
| VT-07 | FR-16; NFR-03 | Reject tampered signed fields, unknown/revoked keys under an agreed trust policy | Planned signatures/key service; no synthetic-hash authenticity claim. |
| VT-08 | FR-15; NFR-05 | Inspect events/exports for real data and secrets; future protected checkpoints detect log edits | Demo events use synthetic values; immutable audit tests planned. |
| VT-09 | FR-10/11 | At `expiresAt - 1 ms` download succeeds; equality and later fail; revoke/simulated expiry block subsequent downloads | Model/builder/validator explicit-clock tests; browser revocation/simulated expiry and natural exact-boundary checks. Live server lookup planned. |
| VT-10 | FR-09/12/13; NFR-09 | Actual downloaded JSON passes schema and semantic validator with `--require-active`; invalid schema, references, role/order/version/time fail | Shared builder/contract/model tests and browser download; XML/import tests planned. |
| VT-11 | NFR-06/07 | Execute fixed load/restore experiments and report raw results including errors | Planned, unmeasured. |
| VT-12 | NFR-08 | Complete route with Tab/keyboard activation, inspect visible focus and text errors, check 375-pixel layout | Browser demonstration check; screen-reader/user evaluation not claimed. |
| VT-13 | FR-17 | Portfolio links to supported source records and never upgrades unverified claims | Optional future feature, not implemented. |

## Reproduction and reporting

From the repository root, `npm ci` installs locked dependencies and `npm test` runs **all** `tests/*.test.cjs`. The model tests use explicit clocks around `2026-10-24T10:00:00.000Z` and the exact seven-day boundary. The optional four-argument API test checks compatibility without making timing assertions. Contract tests use an independent fixture as well as negative mutations. A browser check follows UX-01–08, downloads the file through the actual download control and runs `node contracts/validate-manifest.cjs PATH_TO_DOWNLOAD --require-active`; it does not substitute a Node-generated file for browser evidence.

Natural expiry can be reproduced in an isolated automated browser by setting its clock before preparation, sending, then advancing to one millisecond before the displayed deadline and to exact equality. The page must recheck at the click, including when its display has not refreshed. A missing `manifest.js` must show integration pending and disable export. Negative actions must yield no download event. Browser role switching demonstrates policy only; it is intentionally user-controlled.

The observed checks cover demonstration integration. The tables above identify the experiments and targets that remain unmeasured.
