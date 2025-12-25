import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getEngineForMethod, TabulationOption, StoredBallot, TabulationSettings } from '@/lib/tabulation';
import { createErrorResponse } from '@/lib/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/contests/[id]/results - Get tabulated results
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        options: { where: { active: true } },
        categories: true,
      },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Check if results should be visible
    const settings = contest.settings as Record<string, unknown>;

    // For now, always show results (add auth checks later)
    // In production, check if user is organizer or if results are public
    if (contest.status === 'DRAFT') {
      return NextResponse.json(
        { error: 'Results are not available for draft contests' },
        { status: 403 }
      );
    }

    // Check for cached results
    if (!forceRefresh) {
      const cached = await prisma.resultSnapshot.findFirst({
        where: {
          contestId: contest.id,
          categoryId: categoryId || null,
        },
        orderBy: { computedAt: 'desc' },
      });

      if (cached) {
        return NextResponse.json({
          cached: true,
          computedAt: cached.computedAt,
          method: cached.method,
          rounds: cached.rounds,
          summary: cached.summary,
          integrity: cached.integrity,
        });
      }
    }

    // Get the appropriate tabulation engine
    const engine = getEngineForMethod(contest.votingMethod);
    if (!engine) {
      return NextResponse.json(
        { error: `Unsupported voting method: ${contest.votingMethod}` },
        { status: 400 }
      );
    }

    // Get ballots
    const ballotWhere: Record<string, unknown> = {
      contestId: contest.id,
      status: { in: ['VALID', 'SUSPECTED_DUPLICATE'] },
    };

    if (categoryId) {
      ballotWhere.categoryId = categoryId;
    }

    const ballots = await prisma.ballot.findMany({
      where: ballotWhere,
      select: {
        id: true,
        ranking: true,
        status: true,
      },
    });

    // Filter options by category if specified
    let options = contest.options;
    if (categoryId) {
      options = options.filter((o: { categoryId: string | null }) => o.categoryId === categoryId);
    }

    // Prepare data for tabulation
    const tabulationOptions: TabulationOption[] = options.map((o: { id: string; name: string; active: boolean }) => ({
      id: o.id,
      name: o.name,
      active: o.active,
    }));

    const storedBallots: StoredBallot[] = ballots.map((b: { id: string; ranking: unknown; status: string }) => ({
      id: b.id,
      ranking: b.ranking as string[],
      status: b.status as StoredBallot['status'],
    }));

    const tabulationSettings: TabulationSettings = {
      allowPartialRanking: settings.allowPartialRanking !== false,
      tieBreakMethod: (settings.tieBreakMethod as TabulationSettings['tieBreakMethod']) || 'eliminate-all',
      excludeDuplicates: contest.deduplicationEnabled,
      excludeRemoved: true,
    };

    // Run tabulation
    const result = engine.tabulate(storedBallots, tabulationOptions, tabulationSettings);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Tabulation failed' },
        { status: 500 }
      );
    }

    // Cache the results
    await prisma.resultSnapshot.create({
      data: {
        contestId: contest.id,
        categoryId: categoryId || null,
        method: contest.votingMethod,
        rounds: JSON.parse(JSON.stringify(result.rounds)),
        summary: JSON.parse(JSON.stringify(result.summary)),
        integrity: JSON.parse(JSON.stringify(result.integrity)),
        computeTimeMs: result.computeTimeMs,
      },
    });

    return NextResponse.json({
      cached: false,
      computedAt: result.computedAt,
      method: result.method,
      methodDisplayName: result.methodDisplayName,
      rounds: result.rounds,
      summary: result.summary,
      integrity: result.integrity,
      computeTimeMs: result.computeTimeMs,
    });
  } catch (error) {
    console.error('Error computing results:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
