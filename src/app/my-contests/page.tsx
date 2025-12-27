import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function MyContestsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  const contests = await prisma.contest.findMany({
    where: {
      ownerId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          ballots: {
            where: { status: { in: ['VALID', 'SUSPECTED_DUPLICATE'] } },
          },
          options: true,
        },
      },
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-slate-100 text-slate-700';
      case 'OPEN':
        return 'bg-green-100 text-green-700';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-700';
      case 'CLOSED':
        return 'bg-red-100 text-red-700';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
                My Contests
              </h1>
              <p className="text-lg text-slate-600">
                Manage your elections and polls
              </p>
            </div>
            <Link
              href="/create"
              className="btn-primary px-6 py-3"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Contest
            </Link>
          </div>

          {/* Contests List */}
          {contests.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">
                No contests yet
              </h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Create your first contest to start collecting votes with ranked choice voting.
              </p>
              <Link href="/create" className="btn-primary inline-block">
                Create Your First Contest
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {contests.map((contest) => (
                <div
                  key={contest.id}
                  className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-display font-bold text-slate-900">
                          {contest.title}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusBadge(contest.status)}`}>
                          {contest.status}
                        </span>
                      </div>
                      {contest.description && (
                        <p className="text-slate-600 mb-3">
                          {contest.description}
                        </p>
                      )}
                      <div className="flex items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          <span>{contest._count.ballots} votes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          <span>{contest._count.options} options</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(contest.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/${contest.slug}`}
                      className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold text-center hover:bg-slate-200 transition-colors"
                    >
                      View Vote Page
                    </Link>
                    <Link
                      href={`/${contest.slug}/results?admin=${contest.adminToken}`}
                      className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-semibold text-center hover:bg-purple-200 transition-colors"
                    >
                      View Results
                    </Link>
                    <Link
                      href={`/${contest.slug}/admin?token=${contest.adminToken}`}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
