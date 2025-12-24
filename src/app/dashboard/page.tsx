'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Contest {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  status: string;
  visibility: string;
  votingMethod: string;
  createdAt: string;
  opensAt?: string | null;
  closesAt?: string | null;
  _count?: { ballots: number };
}

export default function DashboardPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'DRAFT' | 'OPEN' | 'CLOSED'>('all');

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch('/api/contests');
        if (res.ok) {
          const data = await res.json();
          setContests(data.contests || []);
        }
      } catch (err) {
        console.error('Failed to fetch contests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const filteredContests = filter === 'all' 
    ? contests 
    : contests.filter(c => c.status === filter);

  const statusColors = {
    DRAFT: 'bg-slate-100 text-slate-700',
    OPEN: 'bg-green-100 text-green-700',
    CLOSED: 'bg-amber-100 text-amber-700',
  };

  const statusLabels = {
    DRAFT: 'Draft',
    OPEN: 'Open',
    CLOSED: 'Closed',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VR</span>
            </div>
            <span className="font-display font-bold text-slate-900">VoteRank</span>
          </Link>
          <Link href="/create" className="btn-primary">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Contest
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your contests and view results</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="text-3xl font-bold text-slate-900">{contests.length}</div>
            <div className="text-sm text-slate-500">Total Contests</div>
          </div>
          <div className="card p-4">
            <div className="text-3xl font-bold text-green-600">{contests.filter(c => c.status === 'OPEN').length}</div>
            <div className="text-sm text-slate-500">Active</div>
          </div>
          <div className="card p-4">
            <div className="text-3xl font-bold text-slate-600">{contests.filter(c => c.status === 'DRAFT').length}</div>
            <div className="text-sm text-slate-500">Drafts</div>
          </div>
          <div className="card p-4">
            <div className="text-3xl font-bold text-slate-900">
              {contests.reduce((sum, c) => sum + (c._count?.ballots || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-500">Total Votes</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'DRAFT', 'OPEN', 'CLOSED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === status
                  ? 'bg-brand-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-300'
              }`}
            >
              {status === 'all' ? 'All' : statusLabels[status]}
              <span className="ml-1.5 opacity-70">
                ({status === 'all' ? contests.length : contests.filter(c => c.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Contest list */}
        {loading ? (
          <div className="card p-8 text-center">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading contests...</p>
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              {filter === 'all' ? 'No contests yet' : `No ${statusLabels[filter as keyof typeof statusLabels].toLowerCase()} contests`}
            </h2>
            <p className="text-slate-600 mb-4">
              {filter === 'all' ? 'Create your first contest to get started.' : 'Change the filter to see other contests.'}
            </p>
            {filter === 'all' && (
              <Link href="/create" className="btn-primary inline-flex">
                Create Contest
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContests.map((contest) => (
              <Link
                key={contest.id}
                href={`/dashboard/contest/${contest.id}`}
                className="card p-5 block hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                        {contest.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[contest.status as keyof typeof statusColors]}`}>
                        {statusLabels[contest.status as keyof typeof statusLabels]}
                      </span>
                    </div>
                    {contest.description && (
                      <p className="text-slate-600 text-sm line-clamp-1 mb-2">{contest.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {contest._count?.ballots || 0} votes
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(contest.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                        {contest.votingMethod}
                      </span>
                    </div>
                  </div>
                  <div className="text-slate-400 group-hover:text-brand-500 transition-colors ml-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
