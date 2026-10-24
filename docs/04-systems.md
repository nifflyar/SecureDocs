# 4 Existing system comparison

## Scope and evidence

Five systems are compared against nine consistent criteria. EPVO and NOBD are local verification sources; Europass EDC and Blockcerts support digital credentials; Erasmus Without Paper (EWP) addresses inter-university mobility exchanges. These are different layers, so the comparison concerns suitability for the mobility scenario rather than a ranking of interchangeable products. Official references were consulted on 24 October 2026.

**Not established** means insufficient support in the inspected documentation, not evidence that a capability is absent. A public form or published API specification does not establish access for this team. Local applicability below is a project assessment, not certification or a legal conclusion.

| Criterion | EPVO [S1] | NOBD technical/vocational verification [S2] | Europass EDC [S3] | Blockcerts [S4] | EWP [S5] |
|---|---|---|---|---|---|
| 1. Main object | Higher-education diploma records | Technical/vocational diploma records | Structured learning credentials | Verifiable certificates in supported formats | Mobility data and agreements |
| 2. Main operation | Record-based diploma checking | Checking diploma details through a form | Issue, hold, share and verify | Issue and independently verify | Exchange data between participating institutions |
| 3. Trust basis | Institutional records in the platform | Records referenced by the official service | Issuer electronic seal and credential checks | Proof/integrity, issuer and revocation checks | Participating institutions and agreed API protocols |
| 4. Arbitrary PDF support | Universal checking not established | Universal checking not established | Documented core is structured issuance, not universal PDF validation | Verification requires a supported certificate representation | Domain data contracts, not universal PDF verification |
| 5. Local ISP approval route | Not established | Not established | Not established | Not established | Learning-agreement exchange/approval documented; local role mapping still needed |
| 6. Format and integration access | Team API rights/contract unconfirmed | Team API rights/contract unconfirmed | Structured credentials and issuer/developer tools | Public verification implementation and format | Purpose-specific APIs; partner readiness varies |
| 7. Disclosure control | Specific access rules require confirmation | Public search inputs; authorised reuse conditions unconfirmed | Holder storage/sharing facilities | Depends on issuing and holder applications | Exchange between network participants |
| 8. Kazakhstan applicability | Relevant local higher-education source | Relevant local technical/vocational source | Local issuer/trust adaptation needs assessment | Local issuer/trust policy needs assessment | Participation and partner adapters needed |
| 9. SecureDocs design use | Conditional source adapter | Separate adapter by diploma type | Distinguish issuer, holder and issued credential | Explain each verification stage | Agree a mobility-specific receiving contract |

## Interpretation and limitations

The Ministry's EPVO material [S1] links diploma generation to registered student information and directs employers to verification. NOBD's official catalogue and indexed form [S2] identify a different diploma category and inputs. Neither establishes permission for unattended team queries. Direct automated retrieval of the NOBD form returned 403 during this review; no conclusion about a production outage follows.

Europass [S3] explicitly describes mandatory electronic seals for EDCs and holder sharing. This is useful for reasoning about origin and disclosure, but does not make a scanned document equivalent to a sealed credential. Blockcerts [S4] exposes verification stages, including issuer/revocation information; it does not itself establish the institution's local ISP approval policy. The lack of that policy in the cited documentation is recorded as unknown, not as missing product functionality.

EWP [S5] is the closest process analogue. Its official API overview describes learning-agreement exchange and approval, while explicitly noting that nomination and transcript APIs are not ready for wide usage in that page's description. Specification availability and actual partner adoption must therefore be checked separately. SecureDocs' `learning_agreement` manifest code is not a claim of EWP conformance.

The proposed contribution is a traceable package process across existing channels: current version, source evidence, ordered decisions, intended recipient and access status. It does not replace a registry, prove a new cryptographic method or establish novelty simply by combining existing controls. Its local benefit remains a hypothesis for the baseline comparison in section 9.

## Official references

- **S1 / L12:** Ministry of Science and Higher Education, [diploma verification information](https://www.gov.kz/org/sci/press/news/details/1119470?lang=ru).
- **S2 / L16:** NOBD, [technical/vocational verification form](https://diplom.nobd.edu.kz/tipo-verify/) and [module catalogue](https://nedb.edu.kz/).
- **S3 / L13:** Europass, [European Digital Credentials](https://europass.europa.eu/en/european-digital-credentials), including electronic seals and sharing.
- **S4 / L14:** Blockcerts, [verification process](https://github.com/blockchain-certificates/cert-verifier-js/blob/master/docs/verification-process.md).
- **S5 / L15:** European Commission, [EWP API overview](https://erasmus-plus.ec.europa.eu/what-are-apis-and-how-do-i-use-them).
