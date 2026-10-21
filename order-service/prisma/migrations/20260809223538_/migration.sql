-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'CANCELED', 'DELIVERED');

-- CreateTable
CREATE TABLE "public"."Orders" (
    "id" SERIAL NOT NULL,
    "products" TEXT[],
    "price" INTEGER NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);
