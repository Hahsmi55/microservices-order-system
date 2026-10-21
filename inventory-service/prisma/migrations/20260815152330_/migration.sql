/*
  Warnings:

  - The primary key for the `Inventory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `product_name` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Inventory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Inventory" DROP CONSTRAINT "Inventory_pkey",
DROP COLUMN "id",
DROP COLUMN "price",
DROP COLUMN "product_name",
DROP COLUMN "stock",
ADD COLUMN     "iID" SERIAL NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Inventory_pkey" PRIMARY KEY ("iID");

-- CreateTable
CREATE TABLE "public"."Products" (
    "productId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productId_key" ON "public"."Inventory"("productId");

-- AddForeignKey
ALTER TABLE "public"."Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
