/*
  Warnings:

  - You are about to alter the column `price` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "amount" DECIMAL(10,2),
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'PKR',
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
