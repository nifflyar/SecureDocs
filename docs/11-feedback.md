# 11 Supervisor feedback and resulting decisions

The supervisor supplied feedback on the completed stage materials on 24 October 2026. The team shortened the README, added opening summaries to the report and removed distracting technical detail and repeated general caveats. The supervisor confirmed the documentation corrections on 24 October 2026. Research, security, development-process and interface-language recommendations remain open.

## Review of the stage materials: 24 October 2026

The review covered the README, sections 1–11, diagrams, prototype, schema, validator and tests, identifying commit `5ab4fe6` as the reviewed baseline. It recognised the separation of implemented and planned work, the schema and validator, automated tests, and comparison with EWP and Europass. The table records the resulting decisions and distinguishes resolved documentation concerns from remaining work.

| Review point | Team decision and evidence | Status |
|---|---|---|
| 1. The local problem, user benefit and distinction from EWP/OLA need stronger evidence. The supervisor consultation is expert opinion rather than user evidence. | Retain the evidence qualification in [section 2](02-relevance.md) and the comparison in [section 4](04-systems.md). Further process interviews, workload estimates and positioning against EWP/OLA require discussion at the next meeting. The supervisor proposed completion by the end of November. | Open; no additional interviews or measured benefit claimed. |
| 2. The project needs a concrete security scope, a signature profile and a protected exchange between organisations. | Keep production security separate from the browser demonstration in [section 7](07-architecture.md). Discuss the proposed signature choice by mid-November, a protected server exchange for pre-defence 2, priorities for OCR/XML/portfolio and whether a third organisation remains mandatory. | Open; proposed milestones and scope changes await agreement. |
| 3. The target stack and server-side authorisation need implementation priority. | Treat the requested FastAPI/PostgreSQL skeleton, server workflow and negative cross-organisation access tests as next-stage work for planning. The current prototype remains evidence of UI and workflow behaviour. | Open; no target-stack implementation or migration claimed. |
| 4. Submission traceability and development practice need improvement. | The review requests the submitted-version tag, reviewer access, a factual tool-use disclosure, and regular peer-reviewed changes. These require a separate response supported by actual version, access and review evidence; a README edit does not resolve them. | Open in this record; no tag creation, access check or retrospective review is asserted. |
| 5a. The README is too verbose and makes current functionality difficult to find. | Shorten the [README](../README.md) to five implemented capabilities, installation, launch and test/validation commands, one limitations section, and concise team/documentation links. Remove repeated caveats and low-level manifest details from the entry page while retaining the technical documentation. Follow-up belongs to SD-14. | Resolved; confirmed by the supervisor on 24 October 2026. Documentation checks completed; revision commit/PR reference pending. |
| 5b. Report sections need short summaries and less distracting detail and repetition. | Add three-sentence opening summaries to sections 1–10; section 11 provides a four-sentence summary. Remove decoder troubleshooting from section 2 while retaining transcription uncertainty and source intervals. Replace the timestamp-format catalogue in section 6 with links to the unchanged parser and tests. Shorten the fixture-hash explanation and retrieval-error detail. Collect common implementation limits in [section 7](07-architecture.md#current-limitations) and replace repeated general statements with cross-references. Follow-up belongs to SD-14. | Resolved; confirmed by the supervisor on 24 October 2026. Documentation checks completed. |
| 5c. The interface needs Russian and Kazakh language support. | Keep language support as an unresolved scope decision. The editorial corrections do not change NFR-08 or implement localisation. | Open; the full point 5 is only partially resolved. |

### Confirmation and verification of the corrections

The README and report-readability corrections address points 5a and 5b and have been confirmed by the supervisor. The remaining recommendations retain the statuses shown above.

The revised README contains exactly five capability bullets, Node.js/npm prerequisites, dependency installation, the complete test-suite command, a local launch command, fixture validation and browser-download validation. Limitations appear together in one section. Local documentation links and command references were checked against the available files and `package.json`. These checks concern the documentation correction; no new runtime test result is claimed. No commit or PR has been created for this revision.

All eleven sections now begin with a short summary. The editorial check preserves requirement identifiers and priorities, source IDs and intervals, the five-system comparison, references, requirement-to-test mapping, role/state interfaces and the exact expiry boundary. Local file links resolve, including the corrected README launch anchor in section 8. Source-specific uncertainty remains beside the finding it qualifies. Code, schema and diagram sources are unchanged by this correction.

## Consultation record

Source S1 is the written consultation with the academic supervisor supplied by the team. The original message date is not recorded in the supplied extract. The recommendations below are translated paraphrases. They concern the proposed system and informed the current requirements and design; they do not establish approval of the completed submission.

The consultation and its relationship to the staff discussions are documented in [section 2](02-relevance.md#s1-suggestions-and-resulting-decisions).

## Recommendations, decisions and evidence

| Supervisor recommendation | Team decision and resulting change | Evidence and current status |
|---|---|---|
| Consult the academic department about existing document exchange and checks; consider NOBD and EPVO as sources. | Separate reported practices from assumptions and record the source, method, outcome and limitations of a check. | [Evidence analysis](02-relevance.md), [FR-08/09](06-requirements.md). The prototype simulates source outcomes; no registry access is claimed. |
| Consider integration with ESUVO, NOBD, DU or LMS systems. | Place external systems behind separate adapters and define a versioned exchange representation. | [Architecture](07-architecture.md), [JSON schema](../contracts/package.schema.json). Source adapters and institutional permissions remain pending. |
| Account for the difficulty of obtaining DU access. | Keep the demonstration independent of DU and plan an authorised manual-input fallback. | [FR-03](06-requirements.md), [prototype](../prototype/index.html). Current input is synthetic, not an implemented PDF-upload fallback. |
| Allow students to upload PDFs and use automated extraction to reduce repeated manual entry. | Include PDF handling and assisted extraction in the final-system requirements, with mandatory human confirmation of fields. | [FR-01/02](06-requirements.md), [evaluation plan](09-verification.md). Real PDF processing and OCR are planned; the prototype demonstrates confirmation of fixed fields. |
| Check documents through QR codes, links or external services and produce a verification report. | Distinguish source unavailability, negative results and confirmation; present the method and limitations separately from the approval stage. | [FR-08/09](06-requirements.md), [recipient report](08-ux.md). Six simulated outcomes are implemented. QR fetching and real-source verification are not implemented. |
| Export JSON or XML for exchange with other systems. | Implement the JSON demonstration first; defer XML until a receiving system's schema is agreed. | [Manifest builder](../prototype/manifest.js), [validator](../contracts/validate-manifest.cjs), [FR-12/13](06-requirements.md). Browser JSON export and validation are implemented. |
| Add cryptographic protection for exchange between organisations. | Specify organisation-scoped access, version integrity and a future trust/key lifecycle; distinguish these controls from structural JSON validation. | [Threat analysis and cryptographic boundaries](07-architecture.md), [FR-14/16 and NFR-01/03](06-requirements.md). Production authentication and signatures remain planned. |
| Consider a portfolio and present the team's proposed solution for discussion. | Keep portfolio functionality optional and prioritise the academic-mobility workflow supported by the staff discussions. | [Proposal](01-proposal.md), [FR-17](06-requirements.md), [UX scenarios](08-ux.md). This prioritisation is a team decision awaiting supervisor assessment. |

## Effect on the current increment

The consultation is reflected in explicit integration dependencies, human field confirmation, separate source outcomes, a recipient verification explanation and structured JSON export. The requirements and architecture also record the protection mechanisms still needed for a production service. These changes make the proposed capabilities and the implemented demonstration distinguishable.

The review of 24 October now provides the supervisor's assessment of the stage deliverables and the follow-up decisions above. The complete institutional approval route, integration permissions and portfolio priority remain open. Neither the initial consultation nor the new review establishes final acceptance, deployment permission or a confirmed client agreement. The README and report-readability corrections are resolved following supervisor confirmation.
