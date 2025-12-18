/*
  Warnings:

  - You are about to drop the `AffiliateClick` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AffiliateClick" DROP CONSTRAINT "AffiliateClick_affiliateId_fkey";

-- DropTable
DROP TABLE "AffiliateClick";

-- CreateTable
CREATE TABLE "SiteClick" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SiteClick_createdAt_idx" ON "SiteClick"("createdAt");

-- CreateIndex
CREATE INDEX "SiteClick_affiliateId_idx" ON "SiteClick"("affiliateId");

-- AddForeignKey
ALTER TABLE "SiteClick" ADD CONSTRAINT "SiteClick_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
