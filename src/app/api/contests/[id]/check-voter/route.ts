import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/contests/[id]/check-voter?voterId=xxx - Check if voter is allowed
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const voterId = searchParams.get('voterId');

    if (!voterId) {
      return NextResponse.json(
        { error: 'Voter ID is required' },
        { status: 400 }
      );
    }

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true, visibility: true },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // If not restricted list, anyone can vote
    if (contest.visibility !== 'RESTRICTED_LIST') {
      return NextResponse.json({ allowed: true });
    }

    // Check if voter is on the allowed list
    const allowedVoter = await prisma.allowedVoter.findUnique({
      where: {
        contestId_voterId: {
          contestId: contest.id,
          voterId: voterId.trim(),
        },
      },
    });

    if (!allowedVoter) {
      return NextResponse.json(
        { error: 'You are not authorized to vote in this contest.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ allowed: true, voter: allowedVoter });
  } catch (error) {
    console.error('Error checking voter:', error);
    return NextResponse.json(
      { error: 'Failed to check voter eligibility' },
      { status: 500 }
    );
  }
}
