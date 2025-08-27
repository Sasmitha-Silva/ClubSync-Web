import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

// GET - Fetch attendance lists
export async function GET(req: Request, context: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await context.params; // Must await params!

  try {
    const attended = await prisma.eventAttendance.findMany({
      where: { eventId },
      include: { user: true },
      orderBy: { attendTime: "asc" }, // sort earliest first
    });

    const registered = await prisma.eventRegistration.findMany({
      where: { eventId },
      include: { volunteer: true },
    });

    const attendedUserIds = attended.map((a) => a.userId);
    const notAttended = registered
      .filter((r) => !attendedUserIds.includes(r.volunteerId))
      .map((r) => ({
        userId: r.volunteerId,
        userName: `${r.volunteer.firstName} ${r.volunteer.lastName}`,
      }));

    const attendedFormatted = attended.map((a) => ({
      userId: a.userId,
      userName: `${a.user.firstName} ${a.user.lastName}`,
      arrivedTime: a.attendTime,
    }));

    return NextResponse.json({
      attended: attendedFormatted,
      notAttended,
    });
  } catch (err) {
    console.error("Attendance fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch attendance data" }, { status: 500 });
  }
}

// POST - Mark attendance
export async function POST(req: Request, context: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await context.params; // Must await params!
  const body = await req.json();
  const { userId } = body;

  try {
    const existing = await prisma.eventAttendance.findFirst({
  where: { userId, eventId },
});
if (existing && existing.isAttend) {
      // Already attended → don’t update again
      return NextResponse.json({
        success: false,
        message: "Attendance already marked",
        attendance: existing,
      });
    }
let attendance;

if (existing) {
  attendance = await prisma.eventAttendance.update({
    where: { id: existing.id },
    data: { isAttend: true, attendTime: new Date() },
  });
} else {
  attendance = await prisma.eventAttendance.create({
    data: { userId, eventId, isAttend: true, attendTime: new Date() },
  });
}


    return NextResponse.json({ success: true, attendance });
  } catch (err) {
    console.error("Attendance mark error:", err);
    return NextResponse.json({ success: false,  }, { status: 500 });
  }
}
