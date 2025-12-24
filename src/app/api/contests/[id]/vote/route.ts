import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { submitBallotSchema } from '@/lib/validations';
import {
  createErrorResponse,
  isContestOpen,
  hashDeviceFingerprint,
  hashIP,
  checkRateLimit,
  AppError,
} from '@/lib/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/contests/[id]/vote - Submit a ballot
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Rate limiting by IP
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimit = checkRateLimit(`vote:${clientIP}`, 10, 60000); // 10 votes per minute per IP
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          }
        }
      );
    }

    // Validate input
    const validationResult = submitBallotSchema.safeParse(body);
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
      include: {
        options: { where: { active: true } },
        allowedVoters: true,
      },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Check if contest is open
    if (!isContestOpen(contest.status, contest.opensAt, contest.closesAt)) {
      return NextResponse.json(
        { error: 'This contest is not currently accepting votes' },
        { status: 403 }
      );
    }

    // Get settings
    const settings = contest.settings as Record<string, unknown>;
    const allowPartialRanking = settings.allowPartialRanking !== false;

    // Validate ranking
    const validOptionIds = new Set(contest.options.map((o: { id: string }) => o.id));
    
    // Filter to valid options (category-specific if provided)
    let categoryOptions = contest.options;
    if (data.categoryId) {
      categoryOptions = contest.options.filter((o: { categoryId: string | null }) => o.categoryId === data.categoryId);
      if (categoryOptions.length === 0) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }
    }
    const categoryOptionIds = new Set(categoryOptions.map((o: { id: string }) => o.id));

    // Validate ranking entries
    const seenOptions = new Set<string>();
    const validRanking: string[] = [];

    for (const optionId of data.ranking) {
      // Check for duplicates
      if (seenOptions.has(optionId)) {
        return NextResponse.json(
          { error: 'Duplicate option in ranking' },
          { status: 400 }
        );
      }

      // Check option exists and is valid for this category
      if (!validOptionIds.has(optionId)) {
        return NextResponse.json(
          { error: `Unknown option: ${optionId}` },
          { status: 400 }
        );
      }

      if (data.categoryId && !categoryOptionIds.has(optionId)) {
        return NextResponse.json(
          { error: `Option ${optionId} is not in the selected category` },
          { status: 400 }
        );
      }

      seenOptions.add(optionId);
      validRanking.push(optionId);
    }

    // Check for empty ranking
    if (!allowPartialRanking && validRanking.length === 0) {
      return NextResponse.json(
        { error: 'At least one choice is required' },
        { status: 400 }
      );
    }

    // Handle voter ID
    let voter = null;
    let voterIdHash = null;

    if (contest.requireVoterId) {
      if (!data.voterId) {
        return NextResponse.json(
          { error: 'Voter ID is required for this contest' },
          { status: 400 }
        );
      }

      // Check restricted list
      if (contest.visibility === 'RESTRICTED_LIST') {
        const allowed = contest.allowedVoters.find((v: { voterId: string }) => v.voterId === data.voterId);
        if (!allowed) {
          return NextResponse.json(
            { error: 'You are not authorized to vote in this contest' },
            { status: 403 }
          );
        }
      }

      // Find or create voter
      voter = await prisma.voter.upsert({
        where: {
          contestId_voterId: {
            contestId: contest.id,
            voterId: data.voterId,
          },
        },
        update: {
          lastSeenAt: new Date(),
          name: data.voterName || undefined,
          email: data.voterEmail || undefined,
        },
        create: {
          contestId: contest.id,
          voterId: data.voterId,
          name: data.voterName,
          email: data.voterEmail,
        },
      });

      // Check for existing vote from this voter
      const existingBallot = await prisma.ballot.findFirst({
        where: {
          contestId: contest.id,
          categoryId: data.categoryId || null,
          voterId: voter.id,
          status: { in: ['VALID', 'SUSPECTED_DUPLICATE'] },
        },
      });

      if (existingBallot) {
        return NextResponse.json(
          { error: 'You have already voted in this contest' },
          { status: 409 }
        );
      }

      voterIdHash = voter.id;
    }

    // Handle device fingerprint
    let deviceFingerprintHash = null;
    let status: 'VALID' | 'SUSPECTED_DUPLICATE' | 'DEDUPED_IGNORED' = 'VALID';

    if (data.deviceFingerprint) {
      deviceFingerprintHash = hashDeviceFingerprint(data.deviceFingerprint);

      // Check for existing ballots with same fingerprint
      const existingFromDevice = await prisma.ballot.findFirst({
        where: {
          contestId: contest.id,
          categoryId: data.categoryId || null,
          deviceFingerprintHash,
          status: { in: ['VALID', 'SUSPECTED_DUPLICATE'] },
        },
      });

      if (existingFromDevice) {
        if (contest.deduplicationEnabled) {
          // Deduplication mode: reject this ballot
          status = 'DEDUPED_IGNORED';
        } else {
          // Just flag as suspected duplicate
          status = 'SUSPECTED_DUPLICATE';
        }
      }
    }

    // Hash IP for storage
    const ipHash = hashIP(clientIP);
    const userAgent = request.headers.get('user-agent') || undefined;

    // Create ballot
    const ballot = await prisma.ballot.create({
      data: {
        contestId: contest.id,
        categoryId: data.categoryId || null,
        voterId: voter?.id,
        ranking: validRanking,
        deviceFingerprintHash,
        ipHash,
        userAgent,
        status,
      },
    });

    // Update allowed voter's hasVoted flag
    if (contest.visibility === 'RESTRICTED_LIST' && data.voterId) {
      await prisma.allowedVoter.updateMany({
        where: {
          contestId: contest.id,
          voterId: data.voterId,
        },
        data: {
          hasVoted: true,
        },
      });
    }

    // Invalidate result cache
    await prisma.resultSnapshot.deleteMany({
      where: {
        contestId: contest.id,
        categoryId: data.categoryId || null,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        contestId: contest.id,
        action: 'ballot_submitted',
        details: {
          ballotId: ballot.id,
          status,
          categoryId: data.categoryId,
          rankingLength: validRanking.length,
        },
        ipHash,
        userAgent,
      },
    });

    // Return success
    const response: Record<string, unknown> = {
      success: true,
      ballotId: ballot.id,
      status,
    };

    if (status === 'DEDUPED_IGNORED') {
      response.warning = 'A vote from this device was already recorded. This submission was not counted.';
    } else if (status === 'SUSPECTED_DUPLICATE') {
      response.notice = 'Your vote was recorded but flagged for review due to potential duplicate submission.';
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error submitting vote:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
