-- Rename videoUrl to videoKey
ALTER TABLE "articles" ADD COLUMN "videoKey" TEXT;

-- Copy data from videoUrl to videoKey
UPDATE "articles" SET "videoKey" = "videoUrl";

-- Make videoKey not nullable
ALTER TABLE "articles" ALTER COLUMN "videoKey" SET NOT NULL;

-- Drop videoUrl column
ALTER TABLE "articles" DROP COLUMN "videoUrl"; 