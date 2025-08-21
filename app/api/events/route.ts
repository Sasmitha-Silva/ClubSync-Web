import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      clubId,
      category,
      description,
      startDateTime,
      endDateTime,
      venue,
      eventOrganizerId,
      maxParticipants
    } = body;

    // Validate required fields
    if (!title || !clubId || !startDateTime || !eventOrganizerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the event organizer exists
    const eventOrganizer = await prisma.user.findUnique({
      where: { id: eventOrganizerId }
    });

    if (!eventOrganizer) {
      return NextResponse.json(
        { error: "Event organizer not found" },
        { status: 400 }
      );
    }

    console.log("Creating event with data:", {
      title,
      subtitle,
      clubId,
      category,
      description,
      startDateTime,
      endDateTime,
      venue,
      eventOrganizerId,
      maxParticipants
    });

    // Create the event
    // Create the event using raw SQL to bypass Prisma client issues
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await prisma.$executeRaw`
      INSERT INTO events (
        id, title, subtitle, "clubId", category, description, 
        "startDateTime", "endDateTime", venue, "eventOrganizerId", 
        "maxParticipants", "isDeleted", "createdAt", "updatedAt"
      ) VALUES (
        ${eventId}, 
        ${title}, 
        ${subtitle || null}, 
        ${clubId}, 
        CAST(${category} AS "EventCategory"), 
        ${description || null}, 
        ${new Date(startDateTime)}, 
        ${endDateTime ? new Date(endDateTime) : null}, 
        ${venue || null}, 
        ${eventOrganizerId}, 
        ${maxParticipants ? parseInt(maxParticipants) : null}, 
        false, 
        NOW(), 
        NOW()
      )
    `;

    // Fetch the created event with relations
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        club: true
      }
    });

    return NextResponse.json({
      message: "Event created successfully",
      event
    });

  } catch (error) {
    console.error("Error creating event:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get("clubId");

    if (!clubId) {
      return NextResponse.json(
        { error: "Club ID is required" },
        { status: 400 }
      );
    }

    // Get events for the club
    const events = await prisma.event.findMany({
      where: {
        clubId,
        isDeleted: false
      },
      include: {
        registrations: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        startDateTime: "desc"
      }
    });

    return NextResponse.json({ events });

  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
