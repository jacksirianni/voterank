import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createOptionSchema, updateOptionSchema } from '@/lib/validations';
import { createErrorResponse } from '@/lib/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/contests/[id]/options - List options for a contest
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    const where: Record<string, unknown> = {
      contestId: contest.id,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (!includeInactive) {
      where.active = true;
    }

    const options = await prisma.option.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ options });
  } catch (error) {
    console.error('Error fetching options:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

// POST /api/contests/[id]/options - Create a new option
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = createOptionSchema.safeParse(body);
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

    // Get next sort order
    const maxSortOrder = await prisma.option.aggregate({
      where: { contestId: contest.id, categoryId: data.categoryId || null },
      _max: { sortOrder: true },
    });

    const option = await prisma.option.create({
      data: {
        contestId: contest.id,
        categoryId: data.categoryId || null,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        sortOrder: (maxSortOrder._max.sortOrder || 0) + 1,
      },
    });

    return NextResponse.json(option, { status: 201 });
  } catch (error) {
    console.error('Error creating option:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

// PATCH /api/contests/[id]/options - Bulk update options (reorder, etc.)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Handle bulk operations
    if (body.reorder && Array.isArray(body.reorder)) {
      // Reorder options: [{ id: 'xxx', sortOrder: 0 }, ...]
      await prisma.$transaction(
        body.reorder.map((item: { id: string; sortOrder: number }) =>
          prisma.option.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );
    }

    if (body.update && typeof body.update === 'object') {
      // Update a single option
      const validationResult = updateOptionSchema.safeParse(body.update);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationResult.error.flatten() },
          { status: 400 }
        );
      }

      if (!body.optionId) {
        return NextResponse.json({ error: 'optionId required for update' }, { status: 400 });
      }

      await prisma.option.update({
        where: { id: body.optionId },
        data: validationResult.data,
      });
    }

    // Return updated options
    const options = await prisma.option.findMany({
      where: { contestId: contest.id },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ options });
  } catch (error) {
    console.error('Error updating options:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

// DELETE /api/contests/[id]/options?optionId=xxx - Delete an option
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const optionId = searchParams.get('optionId');

    if (!optionId) {
      return NextResponse.json({ error: 'optionId required' }, { status: 400 });
    }

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Verify option belongs to contest
    const option = await prisma.option.findFirst({
      where: { id: optionId, contestId: contest.id },
    });

    if (!option) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }

    // Soft delete by marking inactive (to preserve ballot integrity)
    await prisma.option.update({
      where: { id: optionId },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting option:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
