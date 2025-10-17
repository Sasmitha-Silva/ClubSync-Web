import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET - Fetch a single event
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> },
) {
  try {
    const params = await context.params;
    const { eventId } = params;

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        isDeleted: false,
      },
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
        addons: true,
        agenda: {
          orderBy: {
            startTime: "asc",
          },
        },
        resourcePersons: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Transform to match frontend Event interface
    const transformedEvent = {
      id: event.id,
      title: event.title,
      subtitle: event.subtitle,
      description: event.description,
      date: event.startDateTime.toISOString().split("T")[0],
      time: event.startDateTime.toTimeString().slice(0, 5),
      location: event.venue,
      venue: event.venue,
      coverImage: event.addons?.[0]?.tags?.[0] || null, // Adjust based on your schema
      category: event.category,
      maxCapacity: event.maxParticipants,
      registeredCount: event.registrations.length,
      isActive: new Date(event.startDateTime) > new Date(),
      isPaid: false, // Add to schema if needed
      price: 0, // Add to schema if needed
      organizer: {
        id: event.club.id,
        name: event.club.name,
        type: "club" as const,
      },
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      // Additional data if needed
      agenda: event.agenda,
      resourcePersons: event.resourcePersons,
      addons: event.addons,
    };

    return NextResponse.json(transformedEvent);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update an event
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> },
) {
  try {
    const params = await context.params;
    const { eventId } = params;
    const body = await request.json();

    const {
      title,
      subtitle,
      category,
      description,
      startDateTime,
      endDateTime,
      venue,
      eventOrganizerId,
      maxParticipants,
    } = body;

    // Validate required fields
    if (!title || !startDateTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify the event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Update the event using raw SQL
    await prisma.$executeRaw`
      UPDATE events 
      SET 
        title = ${title},
        subtitle = ${subtitle || null},
        category = CAST(${category} AS "EventCategory"),
        description = ${description || null},
        "startDateTime" = ${new Date(startDateTime)},
        "endDateTime" = ${endDateTime ? new Date(endDateTime) : null},
        venue = ${venue || null},
        "maxParticipants" = ${maxParticipants ? parseInt(maxParticipants) : null},
        "updatedAt" = NOW()
      WHERE id = ${eventId}
    `;

    // Fetch the updated event with relations
    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        club: true,
        registrations: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// DELETE - Soft delete an event
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> },
) {
  try {
    const params = await context.params;
    const { eventId } = params;

    // Verify the event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Soft delete the event
    await prisma.$executeRaw`
      UPDATE events 
      SET 
        "isDeleted" = true,
        "updatedAt" = NOW()
      WHERE id = ${eventId}
    `;

    return NextResponse.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
