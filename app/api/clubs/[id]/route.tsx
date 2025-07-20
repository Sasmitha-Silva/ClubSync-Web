import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET /api/clubs/[id] - Get specific club by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const club = await prisma.club.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        motto: true,
        founded: true,
        headquarters: true,
        coverImage: true,
        profileImage: true,
        constitution: true,
        about: true,
        mission: true,
        values: true,
        avenues: true,
        email: true,
        phone: true,
        website: true,
        googleMapURL: true,
        instagram: true,
        facebook: true,
        linkedIn: true,
        twitter: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        excomMembers: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            name: true,
            position: true,
            image: true,
            about: true,
            memberSince: true,
            businessEmail: true,
            businessMobile: true,
          },
          orderBy: {
            memberSince: "desc",
          },
        },
        events: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            title: true,
            category: true,
            description: true,
            startDateTime: true,
            endDateTime: true,
            venue: true,
            maxParticipants: true,
          },
          orderBy: {
            startDateTime: "desc",
          },
        },
        elections: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            description: true,
            year: true,
            votingStart: true,
            votingEnd: true,
          },
          orderBy: {
            year: "desc",
          },
        },
      },
    });

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    return NextResponse.json(club);
  } catch (error) {
    console.error("Error fetching club:", error);
    return NextResponse.json(
      { error: "Failed to fetch club" },
      { status: 500 },
    );
  }
}

// PUT /api/clubs/[id] - Update specific club
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if club exists and is not deleted
    const existingClub = await prisma.club.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingClub) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    const updatedClub = await prisma.club.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        motto: true,
        founded: true,
        headquarters: true,
        coverImage: true,
        profileImage: true,
        about: true,
        mission: true,
        values: true,
        avenues: true,
        email: true,
        phone: true,
        website: true,
        googleMapURL: true,
        instagram: true,
        facebook: true,
        linkedIn: true,
        twitter: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedClub);
  } catch (error) {
    console.error("Error updating club:", error);
    return NextResponse.json(
      { error: "Failed to update club" },
      { status: 500 },
    );
  }
}

// DELETE /api/clubs/[id] - Soft delete club
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Check if club exists and is not already deleted
    const existingClub = await prisma.club.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingClub) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    // Soft delete the club
    await prisma.club.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Club deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting club:", error);
    return NextResponse.json(
      { error: "Failed to delete club" },
      { status: 500 },
    );
  }
}
