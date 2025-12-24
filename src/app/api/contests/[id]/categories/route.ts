import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createCategorySchema } from '@/lib/validations';
import { createErrorResponse } from '@/lib/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/contests/[id]/categories - List categories
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    const categories = await prisma.category.findMany({
      where: { contestId: contest.id },
      orderBy: { sortOrder: 'asc' },
      include: {
        options: {
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { ballots: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

// POST /api/contests/[id]/categories - Create a category
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = createCategorySchema.safeParse(body);
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
    const maxSortOrder = await prisma.category.aggregate({
      where: { contestId: contest.id },
      _max: { sortOrder: true },
    });

    const category = await prisma.category.create({
      data: {
        contestId: contest.id,
        title: data.title,
        description: data.description,
        sortOrder: data.sortOrder ?? (maxSortOrder._max.sortOrder || 0) + 1,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}

// DELETE /api/contests/[id]/categories?categoryId=xxx - Delete a category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json({ error: 'categoryId required' }, { status: 400 });
    }

    // Find contest
    const contest = await prisma.contest.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Verify category belongs to contest
    const category = await prisma.category.findFirst({
      where: { id: categoryId, contestId: contest.id },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Delete category (cascades to options and ballots)
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
