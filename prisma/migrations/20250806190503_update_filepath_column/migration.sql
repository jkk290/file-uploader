-- AlterTable
ALTER TABLE "public"."File" ALTER COLUMN "filePath" DROP NOT NULL,
ALTER COLUMN "modifiedAt" DROP NOT NULL;
