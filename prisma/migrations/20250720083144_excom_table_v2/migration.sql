-- AlterTable
ALTER TABLE "excom_members" ADD COLUMN     "image" TEXT DEFAULT '',
ALTER COLUMN "memberSince" DROP NOT NULL,
ALTER COLUMN "memberSince" SET DATA TYPE TEXT;
