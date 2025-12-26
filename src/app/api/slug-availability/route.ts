import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createErrorResponse } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// Reserved slugs that cannot be used
const RESERVED_SLUGS = [
  'create',
  'dashboard',
  'api',
  'admin',
  'login',
  'signup',
  'settings',
  'about',
  'help',
  'terms',
  'privacy',
  'contact',
  'pricing',
  'features',
  'docs',
  'vote',
  'results',
  'new',
  'edit',
];

// Validate slug format
function isValidSlugFormat(slug: string): boolean {
  // Only lowercase letters, numbers, and hyphens
  // Must start and end with alphanumeric
  // No consecutive hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
}

// GET /api/slug-availability?slug=my-contest
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { available: false, reason: 'Slug is required' },
        { status: 400 }
      );
    }

    // Check format
    if (!isValidSlugFormat(slug)) {
      return NextResponse.json({
        available: false,
        reason: 'Invalid format. Use lowercase letters, numbers, and hyphens only. Must be 3-100 characters.',
      });
    }

    // Check if reserved
    if (RESERVED_SLUGS.includes(slug.toLowerCase())) {
      return NextResponse.json({
        available: false,
        reason: 'This slug is reserved and cannot be used.',
      });
    }

    // Check if already taken
    const existing = await prisma.contest.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({
        available: false,
        reason: 'This slug is already taken.',
      });
    }

    return NextResponse.json({
      available: true,
    });
  } catch (error) {
    console.error('Error checking slug availability:', error);
    const err = createErrorResponse(error);
    return NextResponse.json({ error: err.error }, { status: err.statusCode });
  }
}
