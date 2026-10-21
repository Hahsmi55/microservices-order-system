/*
  Warnings:

  - You are about to drop the column `product` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "product",
ADD COLUMN     "productId" INTEGER NOT NULL DEFAULT 2;
