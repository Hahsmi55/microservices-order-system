-- CreateTable
CREATE TABLE "public"."Inventory" (
    "id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "stock" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);
