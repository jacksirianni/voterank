import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createErrorResponse, hashIP } from '@/lib/utils';

interface RouteParams {
  params: Promise<{ id: string; voteId: string }>;
}

// POST /api/contests/[id]/votes/[voteId]/remove - Remove a vote (premium feature)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, voteId } = await params;

    // TODO: Check if user is authenticated and has premium access
    // For now, allow removal for demo purposes

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Find ballot
    const ballot = await prisma.ballot.findFirst({
      where: { id: voteId, contestId: contest.id },
    });

    if (!ballot) {
      return NextResponse.json({ error: 'Ballot not found' }, { status: 404 });
    }

    if (ballot.status === 'REMOVED') {
      return NextResponse.json({ error: 'Ballot already removed' }, { status: 400 });
    }

    // Mark ballot as removed
    await prisma.ballot.update({
      where: { id: voteId },
      data: { status: 'REMOVED' },
    });

    // Invalidate result cache
    await prisma.resultSnapshot.deleteMany({
      where: {
        contestId: contest.id,
        categoryId: ballot.categoryId,
      },
    });

    // Create audit log
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    await prisma.auditLog.create({
      data: {
        contestId: contest.id,
        action: 'ballot_removed',
        details: {
          ballotId: voteId,
          previousStatus: ballot.status,
        },
        ipHash: hashIP(clientIP),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing vote:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
