-- Introduce the human Validation Board workflow: farm inspection evidence,
-- producer accreditation lifecycle, batch decisions, and digital certificates.
PRAGMA foreign_keys=OFF;

ALTER TABLE "Producer" ADD COLUMN "accreditationExpiresAt" DATETIME;
ALTER TABLE "Producer" ADD COLUMN "lastInspectionAt" DATETIME;
ALTER TABLE "Producer" ADD COLUMN "accreditedById" TEXT;

ALTER TABLE "HoneyBatch" ADD COLUMN "boardStatus" TEXT NOT NULL DEFAULT 'PENDING_REVIEW';
ALTER TABLE "HoneyBatch" ADD COLUMN "boardDecisionNotes" TEXT;
ALTER TABLE "HoneyBatch" ADD COLUMN "boardReviewedAt" DATETIME;
ALTER TABLE "HoneyBatch" ADD COLUMN "boardReviewerId" TEXT;

CREATE TABLE "FarmInspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "producerId" TEXT NOT NULL,
    "verifierId" TEXT NOT NULL,
    "visitDate" DATETIME NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "identityDocumentUrl" TEXT NOT NULL,
    "apiaryPhotos" TEXT NOT NULL,
    "hivePhotos" TEXT NOT NULL,
    "honeyPhotos" TEXT NOT NULL,
    "packagingPhotos" TEXT NOT NULL,
    "certificates" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "signedReportUrl" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "outcome" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FarmInspection_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FarmInspection_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "ValidationCertificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "issuedById" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    CONSTRAINT "ValidationCertificate_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "HoneyBatch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "ValidationCertificate_batchId_key" ON "ValidationCertificate"("batchId");
CREATE UNIQUE INDEX "ValidationCertificate_number_key" ON "ValidationCertificate"("number");
CREATE INDEX "FarmInspection_producerId_idx" ON "FarmInspection"("producerId");
CREATE INDEX "FarmInspection_verifierId_idx" ON "FarmInspection"("verifierId");
CREATE INDEX "FarmInspection_visitDate_idx" ON "FarmInspection"("visitDate");
CREATE INDEX "ValidationCertificate_number_idx" ON "ValidationCertificate"("number");
CREATE INDEX "ValidationCertificate_status_idx" ON "ValidationCertificate"("status");

PRAGMA foreign_keys=ON;
