import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/prisma/client';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    const userId = user.id;
  try {
    const data = await req.json();

    const clubRequest = await prisma.clubRequest.create({
      data: {
        clubName: data.clubName,
        motto: data.motto || null,
        clubType: data.clubType, // must match ClubType enum
        clubCategory: data.clubCategory, // must match ClubCategory enum
        founded: data.founded ? new Date(data.founded) : null, // expects Date
        description: data.description,
        mission: data.mission || null,
        university: data.university || null,
        headquarters: data.headquarters || null,
        requestedById: userId, // use session user id directly
        designation: data.designation,
        idProofDocument: data.idProofDocument || null,
        constitutionDoc: data.constitutionDoc || null,
        approvalLetter: data.approvalLetter || null,
        clubLogo: data.clubLogo || null,
        // requestStatus, adminComments, approvedClubId, userId are optional/managed by admin
      },
    });

    return NextResponse.json({ success: true, clubRequest }, { status: 201 });
  } catch (e) {
    console.error('Error saving club verification:', e);
    return NextResponse.json({ error: 'Failed to save club verification' }, { status: 500 });
  }
}
