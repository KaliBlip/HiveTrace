# Validation Board Workflow

HiveTrace validates honey through documented human review. It does not claim that blockchain, GPS, or machine learning proves honey authenticity.

## Roles

| Role | Responsibility |
|---|---|
| Producer / Beekeeper | Registers, maintains farm details, and submits batch evidence. |
| Validation Board | Performs farm visits, records evidence, accredits producers, and decides batch submissions. |
| Administrator | Manages platform access and oversees records without replacing the board's field decision. |
| Consumer | Views a public certificate and batch information through a QR code. |

## Producer accreditation

1. A beekeeper registers with status `PENDING_BOARD_REVIEW`.
2. A Validation Board member records an on-site inspection.
3. The inspection must include identity document, GPS (when available), apiary/hive/honey/packaging photos, certificates, video, signed report, visit date, and notes.
4. The board accredits, rejects, or requests an inspection. Accreditation lasts one year and must be renewed.

## Batch validation

1. Only an accredited producer can submit a batch.
2. A batch requires finished-honey photo, packaging photo, and video evidence.
3. The board compares the batch evidence to the most recent inspection evidence and records human decision notes.
4. The board approves, rejects, or requests corrections.
5. Approval generates a digital certificate and QR payload. The producer may then create a marketplace listing for the approved batch.

## Public QR page

The public verification page displays the producer, Validation Board, latest inspection date, approval date, batch details, and certificate number. It describes a documented human validation decision, not an automated proof of authenticity.
