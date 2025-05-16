/*
  Warnings:

  - Added the required column `badge` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "badge" TEXT NOT NULL,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL;
