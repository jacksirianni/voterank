import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { allowedVoterSchema } from '@/lib/validations';
import { createErrorResponse } from '@/lib/utils';

// POST /api/contests/[id]/allowed-voters - Add an allowed voter
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contestId = params.id;
    const body = await request.json();

    // Validate input
    const validationResult = allowedVoterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Verify contest exists
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      select: { id: true },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Create allowed voter
    const allowedVoter = await prisma.allowedVoter.create({
      data: {
        contestId,
        voterId: data.voterId,
        name: data.name,
        email: data.email,
      },
    });

    return NextResponse.json(allowedVoter, { status: 201 });
  } catch (error) {
    console.error('Error creating allowed voter:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

// GET /api/contests/[id]/allowed-voters - List allowed voters
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contestId = params.id;

    const allowedVoters = await prisma.allowedVoter.findMany({
      where: { contestId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ allowedVoters });
  } catch (error) {
    console.error('Error fetching allowed voters:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
