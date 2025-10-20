import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const take = limitParam ? Math.min(50, Number(limitParam)) : 5;

    const p = prisma as any;
    const feedbacks = await p.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
        club: {
          select: { id: true, name: true },
        },
      },
    });

    // Map to a simple shape expected by the UI
    const mapped = feedbacks.map((f: any) => ({
      id: f.id,
      volunteerName: f.user ? `${f.user.firstName || ""} ${f.user.lastName || ""}`.trim() : "Anonymous",
      club: f.club ? f.club.name : "Unknown",
      rating: f.rating,
      comment: f.comment,
      date: f.createdAt ? new Date(f.createdAt).toISOString().split("T")[0] : null,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("Failed to fetch recent feedbacks", err);
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}
