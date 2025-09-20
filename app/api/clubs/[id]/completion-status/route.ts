import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/prisma/client";

// Helper function to check if user has club officer permission
async function checkClubOfficerPermission(clubId: string, userEmail: string) {
  try {
    // Get user from email
    const user = await (prisma.user as any).findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return { hasPermission: false, error: "User not found" };
    }

    // Check if user is system admin (can access all clubs)
    if (user.role === 'systemAdmin') {
      return { hasPermission: true, user };
    }

    // Check if user is a club officer (president, secretary, treasurer, webmaster)
    const clubMember = await (prisma.clubMember as any).findFirst({
      where: {
        clubId: clubId,
        userId: user.id,
        membershipStatus: 'active', // Only active members
        role: {
          in: ['president', 'secretary', 'treasurer', 'webmaster']
        }
      },
      include: {
        club: true,
        user: true
      }
    });

    if (!clubMember) {
      return { 
        hasPermission: false, 
        error: "Access denied. Only club officers (President, Secretary, Treasurer, Webmaster) can access club details." 
      };
    }

    return { hasPermission: true, user, clubMember };
  } catch (error) {
    console.error("Error checking club officer permission:", error);
    return { 
      hasPermission: false, 
      error: "Error checking permissions" 
    };
  }
}

// GET /api/clubs/[id]/completion-status - Check if club details are complete
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clubId } = await params;

    if (!clubId) {
      return NextResponse.json(
        { error: "Club ID is required" },
        { status: 400 }
      );
    }

    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has club officer permission
    const permissionCheck = await checkClubOfficerPermission(clubId, session.user.email);
    if (!permissionCheck.hasPermission) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Fetch club data
    const club = await (prisma.club as any).findFirst({
      where: {
        id: clubId,
        isDeleted: false,
      },
    });

    if (!club) {
      return NextResponse.json(
        { error: "Club not found" },
        { status: 404 }
      );
    }

    // Check if essential club details are complete
    const requiredFields = {
      name: club.name,
      motto: club.motto,
      about: club.about,
      mission: club.mission,
      email: club.email,
      phone: club.phone,
      headquarters: club.headquarters,
      profileImage: club.profileImage,
      coverImage: club.coverImage,
    };

    // Count completed fields
    const completedFields = Object.values(requiredFields).filter(
      (field) => field && field.toString().trim() !== ""
    ).length;

    const totalFields = Object.keys(requiredFields).length;
    const completionPercentage = Math.round((completedFields / totalFields) * 100);

    // Consider complete if 80% or more fields are filled
    const isComplete = completionPercentage >= 80;

    return NextResponse.json({
      isComplete,
      completionPercentage,
      completedFields,
      totalFields,
      missingFields: Object.keys(requiredFields).filter(
        (key) => !requiredFields[key as keyof typeof requiredFields] || 
        requiredFields[key as keyof typeof requiredFields].toString().trim() === ""
      ),
    });

  } catch (error) {
    console.error("Error checking club completion status:", error);
    return NextResponse.json(
      { error: "Failed to check completion status" },
      { status: 500 }
    );
  }
}