# 2 Evidence of the relevance

## Evidence and method

The evidence includes two recorded discussions with university staff and a substantive written consultation with the academic supervisor. The recordings are dated 23 October 2026. I1 is the Student Department discussion supplied in two parts (I1a and I1b); I2 is the International Cooperation Department (ICD) discussion. Three audio files therefore represent two staff discussions, not three independent interviews. Department attribution and the grouping of the Student Department parts were confirmed by the project participant who supplied the recordings. S1 has no recorded correspondence date. The original project justification (D1) supplies aims and proposed responsibilities, not observed results.

The analysis separates participant observations, interviewer suggestions and engineering decisions. The statements below are translated paraphrases, not verified quotations. The supplied interval notes were compared with local automatic transcription of the recordings. Audio was recovered through temporary WAV conversion after the direct decoder failed; the conversion reported an AAC packet error, so recovery does not establish that every original sample was preserved. Automatic transcription supports content checks but does not establish exact wording, speaker identity or unclear institutional terminology. Timestamps are approximate and relative to each named recording; uncertain passages remain subject to listening confirmation. The written correspondence was read directly.

| ID | Source identifier and context | Evidence limits |
|---|---|---|
| I1a | `23.10.2026 11.49 Student Dep.m4a`; first Student Department part, approximately 02:01, about diploma enquiries | Staff member's exact position is unknown; recording begins mid-conversation. Existing I1 references without a part suffix refer to I1a. |
| I1b | `23.10.2026 12.41 Student Dep 2.m4a`; second Student Department part, approximately 03:34 | Part of I1, not an additional independent interview; exact speaker identity and position are not established. |
| I2 | `23.10.2026 12.15 ICD.m4a`; approximately 07:53, with an International Cooperation Department representative | Exact title, name, approval-role wording and some document names need listening confirmation. |
| S1 | `supervisor_correspondence.txt`; substantive written consultation with an Assistant Professor in the Software Engineering School and the project's academic supervisor | Pasted correspondence lacks original dates and sender metadata; practices and suggestions are attributed, not independently established. |
| D1 | Original project justification | Proposed final system, technology and three-organisation demonstration; no measured operating results. |

S1 is classified as expert consultation. The participant confirms the supervisor's Assistant Professor role in the Software Engineering School, but not an operational user-representative or actual-client mandate. Consequently, the rubric's three-to-five discussions with user representatives or substantive agreement with an actual client is not yet established. The qualification is applied consistently to this evidence corpus.

## Process and observations

According to I2, programmes and deadlines are published before students apply through MyDU. Staff check completeness, a commission selects candidates, and the coordinator nominates them to a partner by email or platform. Partners may give students their own registration/upload link. The ISP follows an approval route; after mobility, the partner's transcript supports registrar processing. Selection, visas and automatic credit recognition remain outside the demonstration.

| Evidence ID | Attributed observation | Source interval | Requirement or design implication |
|---|---|---|---|
| E01 | Misplacement or misdirection can occur, but is described as rare. | I1 00:00–00:18 | FR-15: trace actions; no claim of widespread loss. |
| E02 | Staff respond to employers' enquiries about issued diplomas using issuing/registration information. | I1 00:18–00:58 | FR-09: explain evidence; employer verification is a possible later extension. |
| E03 | Response format depends on the enquiry: electronic response or originals by post. | I1 00:58–01:16 | Preserve channel context; no unsupported expansion of the unclear abbreviation. |
| E04 | Corporate email and partner platforms carry mobility information/documents. | I2 00:03–01:34 | FR-05/10/12: package completeness and structured exchange alongside existing channels. |
| E05 | No major delivery problems are reported. | I2 01:34–02:05 | Evaluate specific consistency and approval tasks, not an assumed widespread delivery failure. |
| E06 | Local registrar-issued transcripts are trusted; a foreign student copy is preliminary until the partner coordinator confirms it. | I2 02:05–02:57 | FR-04/08/09: distinguish copy, source outcome and evidence. |
| E07 | Speed depends on the platform and known contacts; internal automation work has a queue. | I2 02:58–03:30 | Section 9 separates active handling from external waiting; no baseline duration is known. |
| E08 | Reusing a portal transcript is preferred to repeated student upload. | I2 03:30–04:00 | FR-03: permitted source adapter with an authorised manual fallback. |
| E09 | ISP preparation involves several paper approvals; staff describe an electronic signing queue and onward routing as a way to reduce waiting. The transcription mentions adviser, dean and registrar roles alongside an unclear additional director title. | I2 04:00–05:32; role wording around 04:24–04:35 | FR-06/07: ordered, version-bound decisions. The canonical adviser/dean/registrar route is a design choice, not a verified complete institutional route; the additional title and actual order require confirmation. |
| E10 | Partners set deadlines; MyDU supports application and completeness checks before selection/nomination. | I2 05:32–06:57 | FR-05/10: explicit package and recipient. The seven-day grant is a design rule, not an interview-derived deadline. |
| E11 | After study, transcripts with courses, credits and grades support registrar processing; paper work remains. | I2 07:24–07:53 | Versioned transfer with provenance; no automatic credit-recognition decision. |
| E12 | Student Department staff discuss replacing postal delivery with electronic exchange if recipients can check document provenance and match student details; QR-based checking is discussed as a condition, not an existing universal capability. | I1b 00:18–01:01 | FR-08/09: distinguish a verification mechanism from its result. A QR code alone does not establish authenticity; this is a proposed improvement, not proof of an available integration. |
| E13 | Staff describe a mixture of paper originals, handwritten forms and manually certified copies of orders. These documents help explain continued use of physical delivery. | I1b 00:47–01:29 | FR-01/03/05: later document templates and authorised manual handling must accommodate different source formats. The current synthetic ISP does not implement these additional document workflows. |
| E14 | Staff contrast paper handling with electronic test-result and grant-related records retrieved from existing systems. Exact system names and access arrangements are unclear in the transcription. | I1b 01:29–01:55 | FR-03/08: source-specific adapters remain conditional on permission and a verified receiving/source contract; reported staff access does not establish project API access. |
| E15 | Asked about required platform functions, the speaker describes universities using different systems, expresses uncertainty about a common solution and tentatively mentions an existing inter-organisational correspondence system. | I1b 02:03–03:01 | FR-12/13: interoperability requires agreed contracts. This is a compatibility concern and tentative suggestion, not endorsement of a particular product or SecureDocs. Product names remain unconfirmed. |
| E16 | In the described university-transfer case, especially transfer retaining a grant, an original school certificate is sent between universities following a request rather than handed to the student. The speaker doubts that physical handling can be fully replaced before the relevant documents are digitised. | I1b 03:01–03:30 | FR-10/14: institutional recipient and authority matter. This is a reported practice, not an independently verified legal rule; full student-record transfer remains outside the synthetic ISP demonstration. |

I1 01:16–01:19 contains no substantive security answer in the supplied notes. I1 01:19–01:47 concerns a possible further conversation subject to managerial permission; it is not pilot consent. I2 06:57–07:24 describes later invitation/visa/travel steps outside scope. Unclear names, abbreviations and regulatory references are not inferred.

## S1 suggestions and resulting decisions

The source correspondence was read directly. The following are translated paraphrases, with textual anchors identifying the relevant message rather than invented dates or timestamps.

| S1 anchor / suggestion | Requirement and present design decision |
|---|---|
| Messages linking NOBD and EPVO and referring to checks in those systems | FR-08/09: source-specific verification with method, time, outcome and limitations; registry access remains conditional. |
| Message suggesting ESUVO, NOBD, DU or LMS integration | FR-03/12; sections 5 and 7: separate adapters and a versioned exchange contract; the reported API availability does not establish team permission. |
| Message reporting difficulty obtaining DU access | FR-03: manual fallback; the prototype has no DU dependency. A later suggestion that a proposal might enable access is a possibility, not access granted. |
| Message suggesting student PDF upload and automated extraction | FR-01/02: planned PDF processing with human confirmation; the current prototype loads fixed synthetic fields only. |
| Message suggesting QR/link checks and a verification document | FR-08/09 and NFR-02: separate source availability from outcome; planned isolated fetching; current report explicitly describes simulation. |
| Message proposing JSON or XML export to other systems | FR-12/13: implemented schema-1.0 JSON demonstration; XML awaits an actual receiving contract. |
| Message proposing cryptographic exchange between organisations | FR-16, NFR-01/03; section 7: trust/key lifecycle, scoped authorisation and integrity remain production requirements. |
| Message proposing a portfolio and requesting a presentation of the team's view | FR-17 remains optional; the mobility scenario is prioritised for discussion. No acceptance of the current submission follows from that invitation. |

## Conflicts, uncertainty and verification gaps

D1 motivates broad secure exchange using claims about slow paper/email handling, forgery and legal significance. I2 01:34–02:05 does not report major delivery difficulties, while I1 00:00–00:18 describes errors as rare. These are different levels of evidence: the justification's general motivation cannot replace local findings or quantify incident frequency. The merged design scope concentrates on provenance, completeness and approval consistency; legal significance, signatures and protected audit remain future goals. D1's final three-organisation objective remains, whereas the current fixture has two organisations.

The portfolio suggestion in S1 differs from the stronger process detail about transcript reuse and ISP routing in I2. Prioritising mobility is an engineering decision, not a supervisor-approved rejection of the portfolio. No API credentials, institutional route approval, pilot agreement, response-time measurements or quantified user benefit are supplied.

I1b qualifies the proposed benefits of electronic exchange: staff describe both paper-dependent records and uncertainty about interoperability between university systems. The conditional interest in verifiable electronic documents does not establish that all originals can be replaced, that an existing correspondence product solves the problem, or that the department has accepted SecureDocs. I1b supplies additional context for I1 rather than an independent third user discussion.

Local transcription supports the main themes in the supplied notes: I1a 00:00–00:58 on rare errors and diploma enquiries; I2 01:54–02:58 on delivery, provenance and coordinator confirmation; I2 03:30–05:08 on portal reuse and paper approvals; and I2 05:42–06:56 on deadlines, MyDU and nomination. These are content-level cross-checks, not certified transcripts. Direct listening remains necessary before using quotations or resolving unclear terminology: I1a 00:58–01:16 for the response channel and abbreviation; I2 04:24–04:35 for the complete list of signatories, 05:15–05:33 for the unspecified regulatory reference, and 07:18–07:44 for the registrar document name; I1b 00:18–01:29 for QR checking and paper document types, and 01:29–01:55 for the electronic source names. Institutional confirmation of the complete approval route remains separate from transcription accuracy.

Original audio, personal correspondence and real student records remain outside Git. Public evidence links and publication permissions are not established. S1 informs the initial requirements and design decisions above; it is separate from the later review of completed deliverables reserved for section 11.
