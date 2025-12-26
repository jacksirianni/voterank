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

// GET /api/contests/[id]/audit - Get audit logs for contest (admin only)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const adminToken = searchParams.get('adminToken');
    const limit = parseInt(searchParams.get('limit') || '50');

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

    // Get audit logs
    const logs = await prisma.auditLog.findMany({
      where: {
        contestId: contest.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
