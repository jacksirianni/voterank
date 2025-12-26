import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createErrorResponse } from '@/lib/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper to verify admin token
async function verifyAdminToken(contestId: string, adminToken: string | null): Promise<boolean> {
  if (!adminToken) return false;

  const contest = await prisma.contest.findFirst({
    where: {
      OR: [{ id: contestId }, { slug: contestId }],
      adminToken,
    },
    select: {
      id: true,
      adminTokenExpiresAt: true
    },
  });

  if (!contest) return false;

  // Check if token is expired
  if (contest.adminTokenExpiresAt && contest.adminTokenExpiresAt < new Date()) {
    return false;
  }

  return true;
}

// GET /api/contests/[id]/ballots - Get ballots for contest (admin only)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const adminToken = searchParams.get('adminToken');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const statusFilter = searchParams.get('status') || 'all';

    // Verify admin token
    const isAdmin = await verifyAdminToken(id, adminToken);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Build where clause
    const where: Record<string, unknown> = {
      contestId: contest.id,
    };

    if (statusFilter !== 'all') {
      where.status = statusFilter;
    }

    // Get total count
    const total = await prisma.ballot.count({ where });

    // Get paginated ballots
    const ballots = await prisma.ballot.findMany({
      where,
      include: {
        voter: {
          select: {
            voterId: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      ballots,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching ballots:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

// DELETE /api/contests/[id]/ballots - Remove a ballot (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const adminToken = searchParams.get('adminToken');
    const ballotId = searchParams.get('ballotId');

    // Verify admin token
    const isAdmin = await verifyAdminToken(id, adminToken);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    if (!ballotId) {
      return NextResponse.json({ error: 'Ballot ID required' }, { status: 400 });
    }

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Mark ballot as removed (don't actually delete for audit trail)
    const ballot = await prisma.ballot.update({
      where: { id: ballotId },
      data: { status: 'REMOVED' },
    });

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        contestId: contest.id,
        action: 'vote_removed',
        details: {
          ballotId: ballot.id,
          previousStatus: ballot.status,
          voterId: ballot.voterId,
        },
      },
    });

    // Invalidate cached results by deleting result snapshots
    await prisma.resultSnapshot.deleteMany({
      where: { contestId: contest.id },
    });

    return NextResponse.json({ success: true, ballot });
  } catch (error) {
    console.error('Error removing ballot:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
