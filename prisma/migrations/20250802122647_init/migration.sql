/*
  Warnings:

  - You are about to drop the column `brand` on the `Gadget` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Gadget` table. All the data in the column will be lost.
  - Added the required column `image` to the `Gadget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Gadget` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('WISHLIST', 'BOUGHT', 'PENDING');

-- AlterTable
ALTER TABLE "public"."Gadget" DROP COLUMN "brand",
DROP COLUMN "description",
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'WISHLIST';
