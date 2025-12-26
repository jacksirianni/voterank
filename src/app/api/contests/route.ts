import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createContestSchema } from '@/lib/validations';
import { createContestSlug, createErrorResponse, AppError } from '@/lib/utils';
import { auth } from '@/auth';

// GET /api/contests - List contests (for dashboard)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [contests, total] = await Promise.all([
      prisma.contest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: {
              ballots: {
                where: { status: { in: ['VALID', 'SUSPECTED_DUPLICATE'] } },
              },
              options: true,
              categories: true,
            },
          },
        },
      }),
      prisma.contest.count({ where }),
    ]);

    return NextResponse.json({
      contests,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching contests:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

// POST /api/contests - Create a new contest
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    const ownerId = session?.user?.id || null;

    const body = await request.json();

    // Validate input
    const validationResult = createContestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Use custom slug if provided, otherwise generate one
    let slug: string;
    if (data.slug) {
      // Verify custom slug is available
      const existing = await prisma.contest.findUnique({ where: { slug: data.slug } });
      if (existing) {
        throw new AppError('Slug already taken', 'SLUG_TAKEN', 409);
      }
      slug = data.slug;
    } else {
      // Generate unique slug
      slug = createContestSlug();
      let attempts = 0;
      while (attempts < 5) {
        const existing = await prisma.contest.findUnique({ where: { slug } });
        if (!existing) break;
        slug = createContestSlug();
        attempts++;
      }

      if (attempts >= 5) {
        throw new AppError('Could not generate unique contest slug', 'SLUG_GENERATION_FAILED', 500);
      }
    }

    // Create contest
    const contest = await prisma.contest.create({
      data: {
        slug,
        title: data.title,
        description: data.description,
        contestType: data.contestType,
        votingMethod: data.votingMethod,
        visibility: data.visibility,
        ballotStyle: data.ballotStyle,
        timezone: data.timezone,
        opensAt: data.opensAt ? new Date(data.opensAt) : null,
        closesAt: data.closesAt ? new Date(data.closesAt) : null,
        settings: data.settings,
        deduplicationEnabled: data.deduplicationEnabled,
        requireVoterId: data.requireVoterId,
        status: 'DRAFT',
        ownerId, // Link contest to authenticated user (null if not logged in)
      },
      include: {
        options: true,
        categories: true,
      },
    });

    return NextResponse.json(contest, { status: 201 });
  } catch (error) {
    console.error('Error creating contest:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
