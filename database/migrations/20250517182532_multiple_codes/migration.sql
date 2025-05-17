/*
  Warnings:

  - You are about to drop the column `data` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "data",
ADD COLUMN     "codes" TEXT[];
