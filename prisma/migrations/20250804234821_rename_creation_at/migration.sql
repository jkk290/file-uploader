/*
  Warnings:

  - You are about to drop the column `creationAt` on the `Folder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Folder" RENAME COLUMN "creationAt" TO "createdAt";