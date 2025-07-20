/*
  Warnings:

  - Made the column `createdById` on table `Club` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Club` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_createdById_fkey";

-- AlterTable
ALTER TABLE "Club" ALTER COLUMN "createdById" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
