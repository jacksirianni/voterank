import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createErrorResponse } from '@/lib/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/contests/[id]/export - Export ballot data (premium feature)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'json';
    const includeRemoved = searchParams.get('includeRemoved') === 'true';

    // TODO: Check if user is authenticated and has premium access
    // For now, allow export for demo purposes

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        options: true,
        categories: true,
      },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Get ballots
    const statusFilter = includeRemoved 
      ? {} 
      : { status: { in: ['VALID', 'SUSPECTED_DUPLICATE'] as const } };

    const ballots = await prisma.ballot.findMany({
      where: {
        contestId: contest.id,
        ...statusFilter,
      },
      select: {
        id: true,
        ranking: true,
        status: true,
        categoryId: true,
        createdAt: true,
        // Exclude PII
      },
      orderBy: { createdAt: 'asc' },
    });

    // Build option lookup
    const optionMap = new Map(contest.options.map((o: { id: string; name: string }) => [o.id, o.name]));

    // Transform ballots to include option names
    const exportBallots = ballots.map((b: { id: string; categoryId: string | null; ranking: unknown; status: string; createdAt: Date }) => ({
      id: b.id,
      categoryId: b.categoryId,
      ranking: (b.ranking as string[]).map(optId => ({
        optionId: optId,
        optionName: optionMap.get(optId) || 'Unknown',
      })),
      status: b.status,
      createdAt: b.createdAt.toISOString(),
    }));

    const exportData = {
      contest: {
        id: contest.id,
        slug: contest.slug,
        title: contest.title,
        votingMethod: contest.votingMethod,
        exportedAt: new Date().toISOString(),
      },
      options: contest.options.map((o: { id: string; name: string; categoryId: string | null }) => ({
        id: o.id,
        name: o.name,
        categoryId: o.categoryId,
      })),
      categories: contest.categories.map((c: { id: string; title: string }) => ({
        id: c.id,
        title: c.title,
      })),
      ballotCount: exportBallots.length,
      ballots: exportBallots,
    };

    if (format === 'csv') {
      // Generate CSV format
      const csvRows: string[] = [];
      
      // Header
      const maxRanks = Math.max(...ballots.map((b: { ranking: unknown }) => (b.ranking as string[]).length), 0);
      const rankHeaders = Array.from({ length: maxRanks }, (_, i) => `Rank${i + 1}`);
      csvRows.push(['BallotID', 'CategoryID', 'Status', 'CreatedAt', ...rankHeaders].join(','));
      
      // Rows
      for (const ballot of exportBallots) {
        const ranking = ballot.ranking.map((r: { optionId: string; optionName: string }) => `"${r.optionName}"`);
        while (ranking.length < maxRanks) ranking.push('');
        csvRows.push([
          ballot.id,
          ballot.categoryId || '',
          ballot.status,
          ballot.createdAt,
          ...ranking,
        ].join(','));
      }

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${contest.slug}-ballots.csv"`,
        },
      });
    }

    // Default: JSON format
    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="${contest.slug}-export.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
