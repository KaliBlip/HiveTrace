-- Add consumer proof-of-delivery timestamp
ALTER TABLE "Order" ADD COLUMN "deliveryConfirmedAt" DATETIME;
