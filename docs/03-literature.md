# 3 Literature review

The review compares sixteen sources, including eight scientific publications, to inform credential trust, document extraction and exchange design. The main decisions are to separate authenticity from structural validation and require human confirmation of extracted fields. Local extraction quality and workflow benefit require project-specific evaluation.

## Questions and selection

This targeted critical review asks how educational claims gain trust, how controlled disclosure differs from authenticity, and how document fields can be extracted without treating recognition as verification. Eight scientific publications (L1–L8) are compared below; standards and official system documentation (L9–L16) are used separately. Primary publisher, author and official pages were checked on 24 October 2026. This is not a systematic search with a claimed exhaustive corpus.

The scientific core is from 2022–2025. L4, published on 19 July 2021, lies outside the strict preceding five-year window and is retained as a foundational account of the SSI ecosystem. Selection favours methods that affect a concrete SecureDocs decision: issuer trust, status/revocation, version evidence, human confirmation or language transfer. Published benchmark results are not SecureDocs measurements.

## Trust and credential management

Rustemi et al. [L1] use PRISMA to select 34 studies from 1,744 papers concerning blockchain-based academic certificate verification. This makes architectural assumptions and research gaps visible, but a blockchain-focused corpus does not establish superiority over ordinary trusted institutional services. SecureDocs therefore separates issuer authority, data integrity and status rather than adopting a ledger as an automatic trust solution.

Jaime Maestre et al. [L2] combine a review with the BeCertify implementation, including its architecture and API. The contribution gives a more concrete engineering path than a taxonomy alone. Nevertheless, an implementation example is not evidence of fit to the local mobility approval process or a comparative deployment trial. SecureDocs adopts the separation of issuance, storage and verification; the blockchain dependency is not justified by the present requirements.

Mazzocca et al. [L3] survey DID/VC mechanisms, implementations and threats, including credential validity, key compromise and privacy. Their broader trust analysis complements L1's certificate-specific focus. Standardised identifiers and verifiable claims still need a policy for trusting the issuing organisation. SecureDocs keeps structural JSON validation distinct from authenticity and plans organisation/key management under FR-16.

Soltani et al. [L4] explain the SSI ecosystem and user-controlled disclosure. This supports minimising what is shared, but key custody and recovery impose operational obligations beyond a download button. Schardong and Custódio [L5] offer a systematic mapping and taxonomy covering conceptual and practical questions, including recovery and usability. Their heterogeneous corpus is useful for finding unresolved issues, not evidence that one wallet design works for this university. The first SecureDocs increment demonstrates recipient, version and expiry control; it does not implement an SSI wallet. Credential revocation, withdrawal of download access and recovery of an account are separate problems.

## Extraction and human confirmation

LayoutLMv3 [L6] jointly models text, layout and image information using unified masking objectives. Its benchmark evaluation supports multimodal document representation; dependence on textual input leaves OCR errors relevant. Donut [L7] instead learns image-to-structured-output generation without a separate OCR stage and uses synthetic document generation in training. Removing an OCR component does not remove recognition or structure errors. Neither paper establishes accuracy on SecureDocs' Russian/Kazakh educational documents.

LiLT [L8] separates layout learning from language representations and evaluates cross-language transfer using existing textual models. It addresses a different risk from Donut: portability of learned layout rather than removal of OCR. The published language experiments do not justify assuming equal quality on local Russian/Kazakh diploma templates. The proposed comparison therefore includes a simple OCR-plus-rules baseline and fixed document-level test splits, with per-language/per-field errors, correction effort and resource use. Human confirmation in FR-02 remains necessary regardless of the extraction method.

| Publication | Approach and evidence | Limitation for this project | Consequence |
|---|---|---|---|
| L1 Rustemi et al., 2023 | PRISMA review; 34 blockchain credential studies | Technology-bounded selection; no local comparative deployment | Explicit trust assumptions; no blockchain requirement. |
| L2 Jaime Maestre et al., 2022 online | Review plus BeCertify engineering example | Issuance architecture does not establish mobility workflow suitability | Separate issuance/storage/checking. |
| L3 Mazzocca et al., 2025 | DID/VC survey, implementation and threat analysis | Interoperable syntax does not decide issuer authority | Separate integrity, status and trust policy. |
| L4 Soltani et al., 2021 | SSI ecosystem survey | Foundational, older; operational key/recovery burden | Minimise disclosure without requiring a wallet. |
| L5 Schardong and Custódio, 2022 | Systematic mapping and taxonomy | Heterogeneous material; usability remains context-specific | Evaluate recovery and human interaction separately. |
| L6 Huang et al., 2022 | Text/image/layout pretraining; FUNSD, CORD and other benchmarks | OCR and domain/language shift | Candidate extraction method, not implemented quality. |
| L7 Kim et al., 2022 | OCR-free image-to-output model; benchmark and synthetic training data | Generation errors and training/compute requirements | Validate fields and resources on the same local test set. |
| L8 Wang et al., 2022 | Language-independent layout learning; eight-language evaluation | Local templates/languages not validated here | Report language and template slices. |

## Standards and official systems as design constraints

W3C VC Data Model 2.0 [L9] distinguishes issuer, holder and verifier and describes credential status and privacy concerns. It informs the conceptual separation of an educational claim from its presentation. SecureDocs schema 1.0 is a local demonstration contract, not a claim of VC conformance. OWASP ASVS 5.0 [L10] supplies a security-requirements framework for future authorisation, input handling and data protection checks. Passing local workflow tests is not ASVS certification.

The Kazakhstan NCA's NCALayer/SDK documentation [L11] identifies a concrete integration ecosystem for future signature investigation. It does not establish legal recognition, authority to sign or compatibility of an unimplemented SecureDocs signature. The Ministry's EPVO description [L12] and NOBD's technical/vocational diploma service [L16] establish relevant local source categories, not public unrestricted API access. Their limited document scope supports separate adapters and an explicit unavailable/manual-review outcome instead of universal PDF verification.

Europass EDC [L13] describes structured credentials protected by an issuer's electronic seal and facilities for holding/sharing them. This illustrates why an arbitrary scanned PDF is different from a natively issued credential. Blockcerts' verification process [L14] separates proof/integrity checking, issuer information and revocation; it supports a report of verification stages rather than one unexplained success badge. These patterns motivate FR-09 without importing either product's assurance claims into the demo.

Erasmus Without Paper [L15] specifies purpose-specific APIs for mobility exchanges, including learning agreements. Its documentation explicitly distinguishes API availability/maturity across uses. This is the closest process comparator, but an API specification alone does not enrol a university or establish interoperability. The local manifest remains an intermediate demonstration until a receiving partner's contract is agreed.

The resulting design uses version-bound approvals, explicit evidence and limitations, time-limited access and human-confirmed fields. It defers signatures, registry adapters and extraction-model selection to tests with actual permission and representative data. Section 9 defines those experiments; no paper's accuracy or performance score is presented as a project result.

## References

- **L1.** Rustemi, A., Dalipi, F., Atanasovski, V., and Risteski, A. (2023). *A Systematic Literature Review on Blockchain-Based Systems for Academic Certificate Verification*. IEEE Access 11, 64679–64696. DOI: [10.1109/ACCESS.2023.3289598](https://ieeexplore.ieee.org/abstract/document/10163764). [Institutional full text](https://lnu.diva-portal.org/smash/get/diva2%3A1775492/FULLTEXT01.pdf).
- **L2.** Jaime Maestre, R., Bermejo Higuera, J., Gámez Gómez, N., Bermejo Higuera, J. R., Sicilia Montalvo, J. A., and Orcos Palma, L. *The application of blockchain algorithms to the management of education certificates*. Evolutionary Intelligence; online 30 December 2022. DOI: 10.1007/s12065-022-00812-0. [Full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC9800236/).
- **L3.** Mazzocca, C., Acar, A., Uluagac, A. S., Montanari, R., Bellavista, P., and Conti, M. (2025). *A Survey on Decentralized Identifiers and Verifiable Credentials*. IEEE Communications Surveys & Tutorials. DOI: 10.1109/COMST.2025.3543197. [Author text, version 2](https://arxiv.org/html/2402.02455v2).
- **L4.** Soltani, R., Nguyen, U. T., and An, A. (2021). *A Survey of Self-Sovereign Identity Ecosystem*. Security and Communication Networks, 8873429. [DOI: 10.1155/2021/8873429](https://onlinelibrary.wiley.com/doi/10.1155/2021/8873429).
- **L5.** Schardong, F., and Custódio, R. (2022). *Self-Sovereign Identity: A Systematic Review, Mapping and Taxonomy*. Sensors 22(15), 5641. DOI: 10.3390/s22155641. [Full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC9371034/).
- **L6.** Huang, Y., Lv, T., Cui, L., Lu, Y., and Wei, F. (2022). *LayoutLMv3*. ACM Multimedia. DOI: 10.1145/3503161.3548112. [Author text](https://arxiv.org/html/2204.08387v3).
- **L7.** Kim, G., Hong, T., Yim, M., Nam, J., Park, J., Yim, J., Hwang, W., Yun, S., Han, D., and Park, S. (2022). *OCR-free Document Understanding Transformer*. ECCV. DOI: 10.1007/978-3-031-19815-1_30. [Author text](https://arxiv.org/html/2111.15664v5).
- **L8.** Wang, J., Jin, L., and Ding, K. (2022). *LiLT: A Simple yet Effective Language-Independent Layout Transformer for Structured Document Understanding*. ACL, 7747–7757. [DOI: 10.18653/v1/2022.acl-long.534](https://aclanthology.org/2022.acl-long.534/).
- **L9.** W3C (15 May 2025). [Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/2025/REC-vc-data-model-2.0-20250515/).
- **L10.** OWASP (30 May 2025). [Application Security Verification Standard 5.0.0](https://asvs.owasp.org/).
- **L11.** National Certification Authority of Kazakhstan. [NCALayer](https://pki.gov.kz/ru/ncalayer/) and [developer SDK](https://sdk.pki.gov.kz/).
- **L12.** Ministry of Science and Higher Education of Kazakhstan. [Information on measures for confirming diploma authenticity](https://www.gov.kz/org/sci/press/news/details/1119470?lang=ru) (English translation of title).
- **L13.** Europass. [European Digital Credentials](https://europass.europa.eu/en/european-digital-credentials).
- **L14.** Blockcerts. [Certificate verification process](https://github.com/blockchain-certificates/cert-verifier-js/blob/master/docs/verification-process.md).
- **L15.** European Commission. [Erasmus Without Paper APIs](https://erasmus-plus.ec.europa.eu/what-are-apis-and-how-do-i-use-them).
- **L16.** NOBD. [Technical/vocational diploma verification](https://diplom.nobd.edu.kz/tipo-verify/) and [official module catalogue](https://nedb.edu.kz/).

Access note: the NOBD service's indexed official form/catalogue was available, while direct automated retrieval returned 403. This supports only the described service/form scope, not live availability, API rights or test results. The L1 publisher abstract and institutional record were available; L5 was checked through its full-text archive after the publisher endpoint rate-limited access. No service query using personal identifiers was performed.
