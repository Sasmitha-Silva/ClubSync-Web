-- CreateEnum
CREATE TYPE "ClubType" AS ENUM ('academic', 'sports', 'cultural', 'volunteer', 'professional', 'hobby', 'other');

-- CreateEnum
CREATE TYPE "ClubCategory" AS ENUM ('communityBased', 'instituteBased');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'underReview', 'approved', 'rejected', 'needsMoreInfo');

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('general', 'technicalSupport', 'partnership', 'feedback', 'other');

-- CreateEnum
CREATE TYPE "InquirerRole" AS ENUM ('guest', 'volunteer', 'clubAdmin');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('workshop', 'seminar', 'competition', 'social', 'fundraising', 'meeting', 'conference', 'other');

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "about" TEXT,
ADD COLUMN     "avenues" TEXT[],
ADD COLUMN     "constitution" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "founded" TIMESTAMP(3),
ADD COLUMN     "googleMapURL" TEXT,
ADD COLUMN     "headquarters" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkedIn" TEXT,
ADD COLUMN     "mission" TEXT,
ADD COLUMN     "motto" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "values" TEXT[],
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "excom_members" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "about" TEXT,
    "memberSince" TIMESTAMP(3) NOT NULL,
    "businessEmail" TEXT,
    "businessMobile" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "excom_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL DEFAULT 'other',
    "description" TEXT,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3),
    "venue" TEXT,
    "maxParticipants" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_requests" (
    "id" TEXT NOT NULL,
    "clubName" TEXT NOT NULL,
    "motto" TEXT,
    "clubType" "ClubType" NOT NULL,
    "clubCategory" "ClubCategory" NOT NULL,
    "founded" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "mission" TEXT,
    "university" TEXT,
    "headquarters" TEXT,
    "requestedById" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "idProofDocument" TEXT,
    "constitutionDoc" TEXT,
    "approvalLetter" TEXT,
    "clubLogo" TEXT,
    "requestStatus" "RequestStatus" NOT NULL DEFAULT 'pending',
    "adminComments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedClubId" TEXT,
    "userId" TEXT,

    CONSTRAINT "club_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "inquirerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "type" "InquiryType" NOT NULL DEFAULT 'general',
    "message" TEXT NOT NULL,
    "role" "InquirerRole" NOT NULL DEFAULT 'guest',
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "adminResponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_eventId_volunteerId_key" ON "event_registrations"("eventId", "volunteerId");

-- CreateIndex
CREATE UNIQUE INDEX "club_requests_approvedClubId_key" ON "club_requests"("approvedClubId");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "excom_members" ADD CONSTRAINT "excom_members_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_requests" ADD CONSTRAINT "club_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_requests" ADD CONSTRAINT "club_requests_approvedClubId_fkey" FOREIGN KEY ("approvedClubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_requests" ADD CONSTRAINT "club_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
