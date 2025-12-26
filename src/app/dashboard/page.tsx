import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // Fetch user's contests
  const contests = await prisma.contest.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      _count: {
        select: {
          ballots: {
            where: { status: { in: ['VALID', 'SUSPECTED_DUPLICATE'] } },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform to match the expected format
  const contestsData = contests.map(contest => ({
    id: contest.id,
    slug: contest.slug,
    title: contest.title,
    description: contest.description,
    status: contest.status,
    visibility: contest.visibility,
    votingMethod: contest.votingMethod,
    createdAt: contest.createdAt.toISOString(),
    opensAt: contest.opensAt?.toISOString() || null,
    closesAt: contest.closesAt?.toISOString() || null,
    _count: { ballots: contest._count.ballots },
  }));

  return (
    <DashboardClient
      contests={contestsData}
      userName={session.user.name || session.user.email || 'User'}
    />
  );
}
