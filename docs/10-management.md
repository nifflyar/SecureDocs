# 10 Project management and risks

The project assigns requirements, architecture and manifest work to Danial and evidence, prototype workflow and evaluation work to Aslan. Tasks and repository references connect these responsibilities to deliverables. Milestones and risks identify dependencies for the remaining implementation and final submission; later schedule changes require agreement.

## Coordination and responsibilities

Repository: [nifflyar/SecureDocs](https://github.com/nifflyar/SecureDocs). Task tracker: [SecureDocs YouTrack](https://securedocs.youtrack.cloud/). Each student uses their own account. Danial coordinates submission assembly; Aslan checks the consistency of the evidence, prototype and evaluation materials. Both are responsible for reviewing each other's changes.

| Member and account | Deliverables | Published contribution | YouTrack tasks |
|---|---|---|---|
| Danial Balmakhanov — [nifflyar](https://github.com/nifflyar) | Proposal, technology comparison, requirements, architecture, security analysis, manifest generation and validation; submission assembly | [Commit 53f717a](https://github.com/nifflyar/SecureDocs/commit/53f717a), [PR #1](https://github.com/nifflyar/SecureDocs/pull/1) | [SD-1](https://securedocs.youtrack.cloud/issue/SD-1/D01-Project-proposal) — proposal; [SD-3](https://securedocs.youtrack.cloud/issue/SD-3/D02-Technology-selection-and-justification) — technology selection; [SD-5](https://securedocs.youtrack.cloud/issue/SD-5/D03-Requirements-specification) — requirements; [SD-6](https://securedocs.youtrack.cloud/issue/SD-6/D04-Architecture-and-diagrams) — architecture and diagrams; [SD-8](https://securedocs.youtrack.cloud/issue/SD-8/D05-JSON-manifest-generation-and-validation) — manifest generation and validation; [SD-9](https://securedocs.youtrack.cloud/issue/SD-9/D06-Security-analysis) — security analysis; [SD-13](https://securedocs.youtrack.cloud/issue/SD-13/D08-Final-submission-package) — final submission assembly |
| Aslan Aldashev — [Lamgy](https://github.com/Lamgy) | Interview and correspondence analysis, literature, system comparison, interface, workflow model and evaluation plan | [Research commit 72f084e](https://github.com/nifflyar/SecureDocs/commit/72f084e), [prototype commit 93e6ad4](https://github.com/nifflyar/SecureDocs/commit/93e6ad4), [PR #2](https://github.com/nifflyar/SecureDocs/pull/2) | [SD-2](https://securedocs.youtrack.cloud/issue/SD-2/A01-Analysis-of-the-existing-interviews) — interview analysis; [SD-4](https://securedocs.youtrack.cloud/issue/SD-4/A02-Critical-literature-review) — literature review; [SD-7](https://securedocs.youtrack.cloud/issue/SD-7/A03-Comparison-of-existing-systems) — system comparison; [SD-10](https://securedocs.youtrack.cloud/issue/SD-10/A04-Prototype-interface-and-end-to-end-workflow) — prototype interface and workflow; [SD-12](https://securedocs.youtrack.cloud/issue/SD-12/A05-Verification-and-evaluation-plan) — verification and evaluation plan; [SD-14](https://securedocs.youtrack.cloud/issue/SD-14/A06-Evidence-requirements-and-supervisor-feedback-traceability) — evidence, requirements and supervisor-feedback traceability |

The reviewed baseline is commit `fcd81ea5930af31fd8b8cb997fc43347bec5006c`. It contains sections 1–9, three editable diagrams and their exports, the interactive synthetic workflow, and manifest validation. All 140 automated tests passed during the baseline check. A browser-generated JSON file also passed active-manifest validation; revocation blocked subsequent download and replacement reset recipient access. These results concern the demonstration, not production security or user benefit.

PRs #1 and #2 were merged without recorded peer reviews. Their existing records therefore do not demonstrate review before merging. Remaining changes require a substantive review by the other student before merge. The published history establishes contributions from both accounts, but does not by itself establish work spread across the earlier dates reported by the team.

## Milestones and dependencies

The first submission deadline is fixed. Later windows are a proposed team schedule, not university-approved deadlines, and remain subject to the university calendar and supervisor feedback.

| Milestone / target | Owner | Completion evidence and dependency |
|---|---|---|
| Analysis and demonstration baseline — 24 October 2026 | Both | Sections 1–9 and functioning synthetic workflow are present in the reviewed baseline. |
| First submission — 24 October 2026, before 18:00 Asia/Almaty | Danial; Aslan checks consistency | Eleven-section English report, YouTrack evidence PDF, accessible links, recorded feedback and review, and matching `prob-period-1` tag. Assembly and submission remain open at the baseline. |
| Process and integration definition — November 2026 | Aslan: process; Danial: interfaces | Confirm institutional approval roles, permitted evidence use, source access and receiving-system data requirements. Access-dependent functionality remains conditional. |
| Protected service increment — December 2026–January 2027 | Danial: service; Aslan: interface and scenarios | Real file/version handling, authenticated organisation-scoped actions and persistent workflow; positive and negative access tests. Depends on agreed scope and data-handling rules. |
| Extraction, adapters and trust controls — February–March 2027 | Both | Evaluate extraction on permitted data; implement authorised adapters and an agreed key/signature approach. Depends on source permission and verified technical compatibility. |
| Evaluation — April 2027 | Aslan; Danial supports security checks | Execute the section 9 baseline and correctness experiments; retain raw observations, failures and limitations. Depends on stable implementation and prepared datasets. |
| Final demonstration — May 2027 | Both | Reproducible three-organisation scenario and final report. Depends on completed integration, isolation and evaluation checks. |

## Risks and response

Likelihood and impact are qualitative planning estimates, not measured probabilities.

| Risk | Likelihood / impact | Response and dependency | Owner |
|---|---|---|---|
| Evidence does not establish three user-representative discussions | High / high | Retain two staff discussions and S1 expert consultation with their actual roles; seek clarification of S1's operational role and the supervisor's assessment. Do not claim that the numerical condition is already established. | Aslan |
| Supervisor feedback or material access is unavailable before submission | Medium / high | Request review of the key deliverables promptly; retain the actual response and resulting decisions. Check repository, tracker and supporting links from the intended reader's account. | Danial |
| DU, registry or partner API access is unavailable | High / high | Keep adapters conditional; develop the core workflow with synthetic inputs and a clearly identified manual fallback. Require permission and a receiving contract before integration. | Danial |
| Scope exceeds team capacity | High / high | Prioritise academic mobility, version-bound approvals and controlled exchange. Defer portfolio and XML until the core scenario and receiving requirements justify them. | Both |
| Wrong approval route or stale approval authorises a replacement | Medium / high | Confirm institutional signatories; preserve explicit design assumptions meanwhile. Test version invalidation now and transactional concurrency in the future service. | Danial |
| Private documents, credentials or keys are exposed | Medium / high | Keep Git fixtures synthetic; exclude raw recordings and personal records. Require authorised storage, permissions and log checks before using real data. | Danial |
| Extraction errors or unsupported signature claims mislead users | Medium / high | Require human field confirmation and separate source evidence from extraction. Evaluate local templates and the selected trust/key approach before claiming authenticity. | Aslan: extraction; Danial: trust controls |
| Parallel changes or weak review leave inconsistent materials | Medium / medium | Use task branches, explicit ownership and cross-review. Recheck affected scenarios and links after integration; assemble PDFs from the tagged submission version. | Both |
| The prototype provides no measurable improvement | Medium / medium | Use the defined baseline, identical task inputs and recorded conditions. Report the observed result even if the target improvement is not reached. | Aslan |

## Task completion and release control

Each YouTrack issue records its assignee, priority, deadline, expected outcome and acceptance criteria. `To do` means not started; `In progress` means active work; `Review` means the result and checks are ready for the other student; `Done` means the acceptance criteria and required review have been satisfied. Completed issues link to the actual commit or PR. Internal labels such as D01 and A01 do not replace YouTrack issue IDs.

A task branch and its commit message or PR description identify the real issue ID. The PR explains the result and checks; the other student records findings and the author addresses them before merge. Reported earlier completion dates remain distinct from actual Git, issue-creation and review timestamps.

The submission package contains the consolidated report and a separate PDF of the real YouTrack board and task details. The tag `prob-period-1` identifies the exact submitted revision and is not moved after submission. Submission is complete only after one representative sends the form with both members' contributions and verifies access to the linked materials. Subsequent development continues in the same repository.
