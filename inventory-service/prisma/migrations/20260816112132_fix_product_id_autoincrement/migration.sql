-- AlterTable
CREATE SEQUENCE "public".products_productid_seq;
ALTER TABLE "public"."Products" ALTER COLUMN "productId" SET DEFAULT nextval('"public".products_productid_seq');
ALTER SEQUENCE "public".products_productid_seq OWNED BY "public"."Products"."productId";
