import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";
import { randomUUID } from "crypto";

const InquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
  type: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = InquirySchema.parse(body);
    const inquiry = await prisma.inquiry.create({
      data: {
        id: randomUUID(),
        inquirerName: validated.name,
        email: validated.email,
        subject: validated.subject,
        message: validated.message,
        type: validated.type || "general",
        role: "guest",
        isResolved: false,
        adminResponse: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 400 });
  }
}