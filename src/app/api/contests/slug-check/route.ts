import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/contests/slug-check?slug={slug} - Check if slug is available
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({
        available: false,
        error: 'Slug is required'
      }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({
        available: false,
        error: 'Slug can only contain lowercase letters, numbers, and hyphens',
      });
    }

    if (slug.length < 3) {
      return NextResponse.json({
        available: false,
        error: 'Slug must be at least 3 characters',
      });
    }

    if (slug.length > 100) {
      return NextResponse.json({
        available: false,
        error: 'Slug cannot exceed 100 characters',
      });
    }

    // Check database for existing slug
    const existing = await prisma.contest.findUnique({
      where: { slug },
      select: { id: true },
    });

    return NextResponse.json({
      available: !existing,
      slug,
    });
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return NextResponse.json({
      available: false,
      error: 'Failed to check slug availability'
    }, { status: 500 });
  }
}
