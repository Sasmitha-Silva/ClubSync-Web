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
      maxParticipants,
    } = body;

    // Validate required fields
    if (!title || !clubId || !startDateTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
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
      maxParticipants,
    });

    // Create the event
    // Create the event using raw SQL to bypass Prisma client issues
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await prisma.$executeRaw`
      INSERT INTO events (
        id, title, subtitle, "clubId", category, description, 
        "startDateTime", "endDateTime", venue, 
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
        club: true,
      },
    });

    return NextResponse.json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get("clubId");

    // Build the where clause conditionally
    const whereClause = {
      isDeleted: false,
      ...(clubId && { clubId }), // Only add clubId filter if it exists
    };

    // Get events (either filtered by club or all events)
    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
        registrations: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        startDateTime: "desc",
      },
    });

    // Transform the data to match the Event interface expected by the frontend
    const transformedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.startDateTime.toISOString().split("T")[0],
      time: event.startDateTime.toTimeString().slice(0, 5),
      location: event.venue,
      venue: event.venue,
      coverImage: event.coverImage,
      category: event.category,
      maxCapacity: event.maxParticipants,
      registeredCount: event.registrations.length,
      isActive: new Date(event.startDateTime) > new Date(),
      isPaid: false, // Add this field to your schema if needed
      price: 0, // Add this field to your schema if needed
      organizer: {
        id: event.club.id,
        name: event.club.name,
        type: "club" as const,
      },
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
