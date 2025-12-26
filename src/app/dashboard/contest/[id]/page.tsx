'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Option {
  id: string;
  name: string;
  description?: string | null;
  sortOrder: number;
}

interface Contest {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  status: string;
  visibility: string;
  votingMethod: string;
  ballotStyle: string;
  requireVoterId: boolean;
  createdAt: string;
  opensAt?: string | null;
  closesAt?: string | null;
  timezone: string;
  settings: Record<string, unknown>;
  options: Option[];
  categories: { id: string; title: string }[];
  _count?: { ballots: number };
}

interface Ballot {
  id: string;
  contestId: string;
  categoryId?: string | null;
  voterId?: string | null;
  ranking: string[];
  status: string;
  deviceFingerprintHash?: string | null;
  ipHash?: string | null;
  createdAt: string;
  updatedAt: string;
  voter?: {
    voterId: string;
    name?: string | null;
    email?: string | null;
  } | null;
}

interface AuditLogEntry {
  id: string;
  action: string;
  details?: Record<string, unknown> | null;
  createdAt: string;
  userId?: string | null;
}

export default function ContestManagementPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const contestId = params.id as string;
  const adminToken = searchParams.get('token');

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [tab, setTab] = useState<'overview' | 'options' | 'votes' | 'audit' | 'settings'>('overview');

  // Edit states
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newOptionName, setNewOptionName] = useState('');

  // Votes tab states
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [ballotsLoading, setBallotsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'createdAt' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ballotToRemove, setBallotToRemove] = useState<string | null>(null);

  // Audit log states
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      // Wait for session to load
      if (sessionStatus === 'loading') {
        return;
      }

      // Check if user has access via token OR session
      const hasTokenAccess = !!adminToken;
      const hasSessionAccess = sessionStatus === 'authenticated' && !!session?.user;

      if (!hasTokenAccess && !hasSessionAccess) {
        setAuthError('Admin access required. Please sign in or use the admin link provided when you created this contest.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/contests/${contestId}?adminToken=${adminToken}`);
        if (res.status === 403) {
          setAuthError('Invalid admin token. Please check your admin link.');
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error('Contest not found');
        const data = await res.json();
        setContest(data);
        setEditTitle(data.title);
        setEditDescription(data.description || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contest');
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [contestId, adminToken, sessionStatus, session]);

  // Fetch ballots when votes tab is selected
  useEffect(() => {
    if (tab === 'votes' && contest && adminToken) {
      const fetchBallots = async () => {
        setBallotsLoading(true);
        try {
          const res = await fetch(
            `/api/contests/${contestId}/ballots?adminToken=${adminToken}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&status=${statusFilter}`
          );
          if (res.ok) {
            const data = await res.json();
            setBallots(data.ballots);
            setTotalPages(data.pagination.totalPages);
          }
        } catch (err) {
          console.error('Failed to fetch ballots:', err);
        } finally {
          setBallotsLoading(false);
        }
      };
      fetchBallots();
    }
  }, [tab, contest, contestId, adminToken, page, sortBy, sortOrder, statusFilter]);

  // Fetch audit logs when audit tab is selected
  useEffect(() => {
    if (tab === 'audit' && contest && adminToken) {
      const fetchAuditLogs = async () => {
        setAuditLoading(true);
        try {
          const res = await fetch(`/api/contests/${contestId}/audit?adminToken=${adminToken}`);
          if (res.ok) {
            const data = await res.json();
            setAuditLogs(data.logs);
          }
        } catch (err) {
          console.error('Failed to fetch audit logs:', err);
        } finally {
          setAuditLoading(false);
        }
      };
      fetchAuditLogs();
    }
  }, [tab, contest, contestId, adminToken]);

  const handleSaveBasics = async () => {
    if (!contest || !adminToken) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/contests/${contest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription || null,
          adminToken,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const updated = await res.json();
      setContest(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!contest || !adminToken) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/contests/${contest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminToken }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setContest(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const handleAddOption = async () => {
    if (!contest || !newOptionName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/contests/${contest.id}/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newOptionName }),
      });
      if (!res.ok) throw new Error('Failed to add option');
      const newOption = await res.json();
      setContest({
        ...contest,
        options: [...contest.options, newOption],
      });
      setNewOptionName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add option');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    if (!contest) return;
    if (!confirm('Are you sure you want to delete this option?')) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/contests/${contest.id}/options?optionId=${optionId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete option');
      setContest({
        ...contest,
        options: contest.options.filter(o => o.id !== optionId),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete option');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveBallot = async () => {
    if (!contest || !adminToken || !ballotToRemove) return;

    setSaving(true);
    try {
      const res = await fetch(
        `/api/contests/${contest.id}/ballots?adminToken=${adminToken}&ballotId=${ballotToRemove}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to remove ballot');

      // Refresh ballots list
      setBallots(ballots.filter(b => b.id !== ballotToRemove));
      setBallotToRemove(null);

      // Update vote count
      if (contest._count) {
        setContest({
          ...contest,
          _count: { ballots: contest._count.ballots - 1 },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove ballot');
    } finally {
      setSaving(false);
    }
  };

  const getOptionName = (optionId: string) => {
    return contest?.options.find(o => o.id === optionId)?.name || optionId;
  };

  const formatBallotStatus = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      VALID: { label: 'Valid', color: 'bg-green-100 text-green-700' },
      SUSPECTED_DUPLICATE: { label: 'Suspected Duplicate', color: 'bg-amber-100 text-amber-700' },
      DEDUPED_IGNORED: { label: 'Deduped', color: 'bg-slate-100 text-slate-600' },
      REMOVED: { label: 'Removed', color: 'bg-red-100 text-red-700' },
      INVALID: { label: 'Invalid', color: 'bg-red-100 text-red-700' },
    };
    return statusMap[status] || { label: status, color: 'bg-slate-100 text-slate-600' };
  };

  const handleDeleteContest = async () => {
    if (!contest || !adminToken) return;
    if (!confirm('Are you sure you want to permanently delete this contest? This cannot be undone.')) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/contests/${contest.id}?adminToken=${adminToken}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setSaving(false);
    }
  };

  const copyVoteLink = () => {
    if (!contest) return;
    const url = `${window.location.origin}/vote/${contest.slug}`;
    navigator.clipboard.writeText(url);
    alert('Vote link copied to clipboard!');
  };

  const statusColors = {
    DRAFT: 'bg-slate-100 text-slate-700',
    OPEN: 'bg-green-100 text-green-700',
    CLOSED: 'bg-amber-100 text-amber-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Access Required</h1>
            <p className="text-slate-600 mb-6">{authError}</p>
            <Link href="/" className="btn-primary">Go to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Error</h1>
          <p className="text-slate-600 mb-4">{error || 'Contest not found'}</p>
          <Link href="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-sm text-brand-600 hover:text-brand-700 mb-2 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-900">{contest.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[contest.status as keyof typeof statusColors]}`}>
                  {contest.status}
                </span>
                <span className="text-sm text-slate-500">{contest._count?.ballots || 0} votes</span>
                <span className="text-sm text-slate-500">{contest.votingMethod}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={copyVoteLink} className="btn-ghost text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Link
              </button>
              <Link href={`/vote/${contest.slug}`} target="_blank" className="btn-secondary text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Preview
              </Link>
              <Link href={`/vote/${contest.slug}/results`} target="_blank" className="btn-primary text-sm">
                Results
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex gap-6">
            {(['overview', 'options', 'votes', 'audit', 'settings'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                  tab === t
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status & Actions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Contest Status</h2>
                <div className="flex flex-wrap gap-2">
                  {(['DRAFT', 'OPEN', 'CLOSED'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={saving || contest.status === status}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        contest.status === status
                          ? statusColors[status] + ' ring-2 ring-offset-2 ring-current'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {status === 'DRAFT' && '📝 Draft'}
                      {status === 'OPEN' && '✅ Open for Voting'}
                      {status === 'CLOSED' && '🔒 Closed'}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-slate-500 mt-3">
                  {contest.status === 'DRAFT' && 'Contest is not visible to voters. Open it when ready.'}
                  {contest.status === 'OPEN' && 'Voters can submit ballots. Close to finalize results.'}
                  {contest.status === 'CLOSED' && 'Voting is closed. Results are final.'}
                </p>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Info</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="input min-h-[100px]"
                    />
                  </div>
                  <button
                    onClick={handleSaveBasics}
                    disabled={saving || (editTitle === contest.title && editDescription === (contest.description || ''))}
                    className="btn-primary"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Votes</span>
                    <span className="font-semibold">{contest._count?.ballots || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Options</span>
                    <span className="font-semibold">{contest.options.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Method</span>
                    <span className="font-semibold">{contest.votingMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ballot Style</span>
                    <span className="font-semibold">{contest.ballotStyle === 'DRAG' ? 'Drag & Drop' : 'Grid'}</span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Vote Link</h2>
                <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600 break-all">
                  {typeof window !== 'undefined' && `${window.location.origin}/vote/${contest.slug}`}
                </div>
                <button onClick={copyVoteLink} className="btn-ghost w-full mt-3 text-sm">
                  Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Options Tab */}
        {tab === 'options' && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Manage Options</h2>
            
            {/* Add new option */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                placeholder="New option name"
                className="input flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
              />
              <button
                onClick={handleAddOption}
                disabled={saving || !newOptionName.trim()}
                className="btn-primary"
              >
                Add
              </button>
            </div>

            {/* Options list */}
            <div className="space-y-2">
              {contest.options.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No options yet. Add some above.</p>
              ) : (
                contest.options.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{opt.name}</div>
                      {opt.description && (
                        <div className="text-sm text-slate-500">{opt.description}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteOption(opt.id)}
                      disabled={saving}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Votes Tab */}
        {tab === 'votes' && (
          <div className="space-y-6">
            {/* Filters and controls */}
            <div className="card p-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="input py-1.5 text-sm"
                >
                  <option value="all">All</option>
                  <option value="VALID">Valid</option>
                  <option value="SUSPECTED_DUPLICATE">Suspected Duplicate</option>
                  <option value="REMOVED">Removed</option>
                  <option value="INVALID">Invalid</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'status')}
                  className="input py-1.5 text-sm"
                >
                  <option value="createdAt">Date</option>
                  <option value="status">Status</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <svg className={`w-5 h-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Ballots table */}
            <div className="card overflow-hidden">
              {ballotsLoading ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-slate-600">Loading votes...</p>
                </div>
              ) : ballots.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-slate-600">No votes yet</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Voter</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ranking</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {ballots.map((ballot) => {
                          const statusInfo = formatBallotStatus(ballot.status);
                          return (
                            <tr key={ballot.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-sm text-slate-500 font-mono">
                                {ballot.id.substring(0, 8)}...
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {ballot.voter ? (
                                  <div>
                                    <div className="font-medium text-slate-900">{ballot.voter.name || ballot.voter.voterId}</div>
                                    {ballot.voter.email && (
                                      <div className="text-xs text-slate-500">{ballot.voter.email}</div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-slate-400">Anonymous</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-600">
                                <div className="max-w-xs truncate">
                                  {ballot.ranking.slice(0, 3).map((id, idx) => (
                                    <span key={id}>
                                      {idx > 0 && ' > '}
                                      {getOptionName(id)}
                                    </span>
                                  ))}
                                  {ballot.ranking.length > 3 && ` +${ballot.ranking.length - 3} more`}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-500">
                                {new Date(ballot.createdAt).toLocaleDateString()} {new Date(ballot.createdAt).toLocaleTimeString()}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {ballot.status !== 'REMOVED' && (
                                  <button
                                    onClick={() => setBallotToRemove(ballot.id)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                  >
                                    Remove
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="btn-ghost text-sm disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-slate-600">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="btn-ghost text-sm disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Audit Log Tab */}
        {tab === 'audit' && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Audit Log</h2>
            <p className="text-sm text-slate-600 mb-6">
              All administrative actions are recorded here and cannot be modified.
            </p>

            {auditLoading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading audit log...</p>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-600">No audit log entries yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{log.action.replace(/_/g, ' ').toUpperCase()}</div>
                        {log.details && (
                          <div className="mt-1 text-sm text-slate-600">
                            <pre className="font-mono text-xs overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Contest Settings</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Visibility</span>
                  <span className="font-medium">{contest.visibility.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Require Voter ID</span>
                  <span className="font-medium">{contest.requireVoterId ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Partial Ranking</span>
                  <span className="font-medium">{contest.settings?.allowPartialRanking !== false ? 'Allowed' : 'Required full ranking'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Created</span>
                  <span className="font-medium">{new Date(contest.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="card p-6 border-red-200 bg-red-50">
              <h2 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h2>
              <p className="text-sm text-red-700 mb-4">
                Permanently delete this contest and all its data. This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteContest}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete Contest
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Remove Ballot Confirmation Modal */}
      {ballotToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Remove Vote</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to remove this vote? This action will:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 mb-6 space-y-1">
              <li>Mark the vote as REMOVED (not deleted for audit trail)</li>
              <li>Trigger results recomputation</li>
              <li>Create an audit log entry</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setBallotToRemove(null)}
                disabled={saving}
                className="flex-1 btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveBallot}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Removing...' : 'Remove Vote'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
