# 11 Supervisor feedback and resulting decisions

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

The complete institutional approval route, integration permissions, portfolio priority and the supervisor's assessment of the completed deliverables remain open. The supplied evidence contains no final acceptance, deployment permission or confirmed client agreement. A subsequent review can be recorded with its actual date, comments, decisions and resulting changes when received.
