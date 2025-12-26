import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateContestSchema } from '@/lib/validations';
import { createErrorResponse, isContestOpen } from '@/lib/utils';
import { auth } from '@/auth';

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

// GET /api/contests/[id] - Get a single contest
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const adminToken = searchParams.get('adminToken');

    // Check authentication: either admin token OR authenticated user who owns the contest
    const session = await auth();
    let hasAccess = false;

    // Check admin token access
    if (adminToken) {
      const isAdmin = await verifyAdminToken(id, adminToken);
      if (isAdmin) {
        hasAccess = true;
      }
    }

    // Check session-based access (user owns the contest)
    if (!hasAccess && session?.user) {
      const contestOwnership = await prisma.contest.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
          ownerId: session.user.id,
        },
        select: { id: true },
      });
      if (contestOwnership) {
        hasAccess = true;
      }
    }

    // For dashboard access, require authentication
    if (!hasAccess && request.url.includes('/dashboard/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Try to find by slug first, then by id
    let contest = await prisma.contest.findUnique({
      where: { slug: id },
      include: {
        options: {
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        },
        categories: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: {
              where: { active: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        _count: {
          select: {
            ballots: {
              where: { status: { in: ['VALID', 'SUSPECTED_DUPLICATE'] } },
            },
          },
        },
      },
    });

    if (!contest) {
      contest = await prisma.contest.findUnique({
        where: { id },
        include: {
          options: {
            where: { active: true },
            orderBy: { sortOrder: 'asc' },
          },
          categories: {
            orderBy: { sortOrder: 'asc' },
            include: {
              options: {
                where: { active: true },
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
          _count: {
            select: {
              ballots: {
                where: { status: { in: ['VALID', 'SUSPECTED_DUPLICATE'] } },
              },
            },
          },
        },
      });
    }

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Add computed fields
    const isOpen = isContestOpen(contest.status, contest.opensAt, contest.closesAt);

    return NextResponse.json({
      ...contest,
      isOpen,
      voteCount: contest._count.ballots,
    });
  } catch (error) {
    console.error('Error fetching contest:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

// PATCH /api/contests/[id] - Update a contest
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verify admin token (required for updates)
    const adminToken = body.adminToken || request.nextUrl.searchParams.get('adminToken');
    const isAdmin = await verifyAdminToken(id, adminToken);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Validate input
    const validationResult = updateContestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.contestType !== undefined) updateData.contestType = data.contestType;
    if (data.votingMethod !== undefined) updateData.votingMethod = data.votingMethod;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;
    if (data.ballotStyle !== undefined) updateData.ballotStyle = data.ballotStyle;
    if (data.timezone !== undefined) updateData.timezone = data.timezone;
    if (data.opensAt !== undefined) updateData.opensAt = data.opensAt ? new Date(data.opensAt) : null;
    if (data.closesAt !== undefined) updateData.closesAt = data.closesAt ? new Date(data.closesAt) : null;
    if (data.settings !== undefined) updateData.settings = data.settings;
    if (data.deduplicationEnabled !== undefined) updateData.deduplicationEnabled = data.deduplicationEnabled;
    if (data.requireVoterId !== undefined) updateData.requireVoterId = data.requireVoterId;
    if (data.status !== undefined) updateData.status = data.status;

    const updatedContest = await prisma.contest.update({
      where: { id: contest.id },
      data: updateData,
      include: {
        options: {
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        },
        categories: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    // If status changed or settings changed, invalidate results cache
    if (data.status !== undefined || data.settings !== undefined || data.deduplicationEnabled !== undefined) {
      // Mark all result snapshots as stale by deleting them
      // They'll be recomputed on next results request
      await prisma.resultSnapshot.deleteMany({
        where: { contestId: contest.id },
      });
    }

    return NextResponse.json(updatedContest);
  } catch (error) {
    console.error('Error updating contest:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

// DELETE /api/contests/[id] - Delete a contest
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Verify admin token (required for deletion)
    const adminToken = request.nextUrl.searchParams.get('adminToken');
    const isAdmin = await verifyAdminToken(id, adminToken);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Delete contest (cascades to related records)
    await prisma.contest.delete({
      where: { id: contest.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contest:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
