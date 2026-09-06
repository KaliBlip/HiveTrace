-- Store the email entered at checkout for delivery communication and order details
ALTER TABLE "Order" ADD COLUMN "customerEmail" TEXT;