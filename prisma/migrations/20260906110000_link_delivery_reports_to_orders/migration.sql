-- Link fraud reports to the paid order under investigation
ALTER TABLE "FraudAlert" ADD COLUMN "orderId" TEXT;
CREATE INDEX "FraudAlert_orderId_idx" ON "FraudAlert"("orderId");