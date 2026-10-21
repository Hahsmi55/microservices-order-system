/*
  Warnings:

  - The values [INITIATED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `failureReason` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentStatus_new" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Payment" ALTER COLUMN "status" TYPE "public"."PaymentStatus_new" USING ("status"::text::"public"."PaymentStatus_new");
ALTER TYPE "public"."PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "public"."PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "public"."Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "failureReason",
DROP COLUMN "metadata";
