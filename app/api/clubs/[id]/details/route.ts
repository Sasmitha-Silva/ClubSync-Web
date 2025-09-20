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

// GET endpoint to fetch club details for the complete-details form
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const clubId = params.id;

    // Check if user has club officer permission
    const permissionCheck = await checkClubOfficerPermission(clubId, session.user.email);
    if (!permissionCheck.hasPermission) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    // Find the club
    const club = await prisma.club.findUnique({
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

    // Transform club data to match the form structure
    const clubDetails = {
      coverImage: club.coverImage || "",
      profileImage: club.profileImage || "",
      socialMedia: {
        facebook: club.facebook || "",
        instagram: club.instagram || "",
        twitter: club.twitter || "",
        linkedIn: club.linkedIn || "",
        website: club.website || "",
      },
      contact: {
        email: club.email || "",
        phone: club.phone || "",
        googleMapURL: club.googleMapURL || "",
        headquarters: club.headquarters || "",
      },
      details: {
        values: club.values || [],
        avenues: club.avenues || [],
        about: club.about || "",
        mission: club.mission || "",
      },
    };

    return NextResponse.json(clubDetails);
  } catch (error) {
    console.error("Error fetching club details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT endpoint to update club details
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const clubId = params.id;

    // Check if user has club officer permission
    const permissionCheck = await checkClubOfficerPermission(clubId, session.user.email);
    if (!permissionCheck.hasPermission) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate the request body structure
    const { coverImage, profileImage, socialMedia, contact, details } = body;

    if (!socialMedia || !contact || !details) {
      return NextResponse.json(
        { error: "Invalid request body structure" },
        { status: 400 }
      );
    }

    // Find the club
    const club = await prisma.club.findUnique({
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

    // Update the club with new details
    const updatedClub = await prisma.club.update({
      where: { id: clubId },
      data: {
        coverImage: coverImage || club.coverImage,
        profileImage: profileImage || club.profileImage,
        facebook: socialMedia.facebook || null,
        instagram: socialMedia.instagram || null,
        twitter: socialMedia.twitter || null,
        linkedIn: socialMedia.linkedIn || null,
        website: socialMedia.website || null,
        email: contact.email || null,
        phone: contact.phone || null,
        googleMapURL: contact.googleMapURL || null,
        headquarters: contact.headquarters || null,
        values: details.values || [],
        avenues: details.avenues || [],
        about: details.about || null,
        mission: details.mission || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Club details updated successfully",
      club: updatedClub,
    });
  } catch (error) {
    console.error("Error updating club details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}