# 1 Project proposal

## Project and participants

**Development of a Secure System for Exchanging Digital Educational Documents between Educational Organizations** (SecureDocs).

The team is Danial Balmakhanov and Aslan Aldashev, Software Engineering, group SE-2426. The academic supervisor is Aivar Sakhipov, PhD, Assistant Professor at the School of Software Engineering. Official English title and full-name spellings remain subject to confirmation against university records. Repository: [nifflyar/SecureDocs](https://github.com/nifflyar/SecureDocs).

Danial is responsible for requirements, technology decisions, architecture and manifest generation/validation. Aslan is responsible for evidence analysis, literature/system comparisons and the interactive workflow.

## Evidence and problem

The initial scenario is academic mobility: prepare a student's package, approve an Individual Study Plan (ISP), transmit the approved version to a receiving organisation and later obtain a confirmed transcript.

The evidence includes two recorded discussions with university staff and a substantive written consultation with the academic supervisor. These three substantive discussions comprise:

- **I1:** a recorded discussion with a university staff member about diploma-verification enquiries, dated 23 October 2026.
- **I2:** a recorded discussion with an international-cooperation representative about academic mobility and document processing, dated 23 October 2026.
- **S1:** a substantive written consultation with the academic supervisor about current practices, verification sources, integration constraints and proposed capabilities; **date not recorded**.

The findings below are attributed paraphrases of the available discussion notes and correspondence summary, not verified verbatim quotations.

| Evidence | Observation and scope | Design implication |
|---|---|---|
| I2, 01:34–02:05 | The international-cooperation respondent did not report major document-delivery problems. | The evidence does not support claims of widespread delivery failures or losses. |
| I2, 02:05–02:57 | Registrar-issued local transcripts are trusted; a student's copy of a foreign transcript is preliminary until a partner coordinator confirms it. | Distinguish a copy from a source-confirmed document; retain the method, source and limits of confirmation (FR-04, FR-08). |
| I2, 03:30–04:00 | Reusing a transcript from the university portal was preferred to repeated student upload. | Plan a permitted source adapter; retain a manual fallback where no API is available (FR-03). |
| I2, 04:00–05:32 | ISP preparation involves a sequence of paper approvals; electronic routing could reduce waiting. | Bind each decision to the current version and an ordered approval stage (FR-06, FR-07). The exact canonical role names are a design choice requiring institutional confirmation. |
| I2, 05:32–06:57 | Partners set deadlines; MyDU supports applications and selection before nomination. | Control recipient and expiry; keep selection and nomination outside this MVP (FR-10, FR-11). |
| I1, 00:18–00:58 | A staff member described responding to employers about issued diplomas. | Employer verification is a possible extension, not a second mandatory mobility product. |
| S1, written consultation | The supervisor suggested NOBD and EPVO as verification sources, possible university/LMS integration, and reported difficulty obtaining access to DU. | Separate source adapters and retain a manual fallback; external access is a dependency (FR-03/08; sections 5 and 7). |
| S1, written consultation | PDF upload and assisted extraction of document information were proposed, together with verification through available QR codes, links or external sources. | Require human confirmation of extracted fields and distinguish verification outcomes from source availability (FR-01/02/08). |
| S1, written consultation | Verification reports and structured JSON/XML export were proposed. | Preserve method, source, time and limitations; use JSON schema 1.0, with XML conditional on a receiving contract (FR-09/12/13). |
| S1, written consultation | Cryptographic protection for inter-organisational exchange was suggested. | Plan trust/key management and integrity controls separately from the synthetic demonstration (FR-16; NFR-01/03; sections 5 and 7). |
| S1, written consultation | The supervisor requested a presentation of the proposed solution for further discussion. | Define a scoped demonstration and expected outcomes; consultation is not approval of the final submission. |

The problem is therefore package consistency and traceability: which document was received, what supports its provenance, which version was approved, and who may obtain the result. I1 and I2 provide participant observations; S1 contributes the supervisor's reported practices and expert suggestions. The resulting priorities, canonical roles and controls are engineering decisions. The evidence does not establish forgery frequency or measured processing delays. Suggested sources and integrations do not establish API availability, permission to integrate, deployment approval or implemented capabilities.

The evidence qualification against the rubric and the remaining source-verification gaps are recorded in [section 2](02-relevance.md#evidence-and-method).

## Aim

The final-project aim remains to develop and evaluate a secure exchange system that connects document versions, source evidence, approvals and time-limited inter-organisational access. The final demonstration must retain the original **three-organisation** objective. A sender–recipient pair is the first increment; a third organisation must later demonstrate separation and controlled sharing.

## Objectives

- Analyse the current document-exchange process using the available evidence.
- Define prioritised requirements, trust boundaries and architecture.
- Develop the scoped prototype with version-bound approvals and JSON exchange.
- Evaluate the implementation against defined acceptance criteria and a baseline.

## Research questions

Research questions are whether the process reduces repeated actions and completeness errors against email plus a manual register; whether a replacement version can ever reuse stale approval; and whether field extraction helps preparation while leaving authenticity decisions to appropriate evidence and authority. No improvement percentage or time saving has yet been measured.

## Expected outcomes

Expected final outputs are a web application, exchange specification, permitted source adapters, threat/control analysis, auditable workflow, automated checks and an evaluation against the baseline. The final system is intended to accept supported PDF diplomas, certificates and transcripts, prepare mobility packages, extract fields for human confirmation, support an ISP approval route, and exchange versioned JSON. An XML adapter is conditional on a receiving contract. Signature compatibility and trust management require separate implementation and evaluation.

## Users and responsibilities

| User / canonical demo role | Intended responsibility |
|---|---|
| Student / `student` | Prepare the demonstration item, confirm fields, replace a version and see required corrections. |
| Sending coordinator / `coordinator` | Check completeness and provenance, start the approval route, grant/revoke recipient access. |
| Academic adviser / `adviser` | Decide at the first approval stage for the current ISP version. |
| Dean / `dean` | Decide at the second stage after the adviser. |
| Registrar / `registrar` | Decide at the final stage. Production transcript issuance requires separately granted authority. |
| Receiving staff / `recipient` | Obtain an authorised current package and inspect its evidence and limitations. |
| Organisation administrator / production only | Manage membership, scoped permissions and key lifecycle; no automatic academic approval authority. |

## Current increment and boundaries

The current implementation includes the assessed analysis/design sections, three diagrams, a pure synthetic manifest builder, the existing schema 1.0 and fixture, a standard validator and the interactive workflow with deterministic tests. The demonstration covers one synthetic ISP: prepare → confirm fields → simulate provenance checking → adviser/dean/registrar approval → grant → download → revoke/expire. Replacement and source rechecking invalidate previous decisions/access. The browser-generated download has been checked with the active-manifest validator. It uses synthetic data rather than real PDF uploads; final report assembly and project-management materials remain separate work.

Production authentication, tenant isolation, PDF processing/OCR, external registry calls, signatures, protected storage and a persistent audit service are planned work, not delivered security controls. Browser role selection is not authentication. A structurally valid JSON file is not proof of authenticity, institutional recognition or legal signature validity.

The project does not replace MyDU or a government registry. Selection, visas, automatic credit recognition, a certification authority, blockchain and training a large model from scratch are outside the first implementation. A portfolio could later present already supported data without upgrading unverified statements to verified facts. Evaluation will compare the implementation with the stated baseline and acceptance criteria; no measured improvement is claimed.
