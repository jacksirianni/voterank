'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function ContestManagementPage() {
  const params = useParams();
  const router = useRouter();
  const contestId = params.id as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'overview' | 'options' | 'settings'>('overview');

  // Edit states
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newOptionName, setNewOptionName] = useState('');

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await fetch(`/api/contests/${contestId}`);
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
  }, [contestId]);

  const handleSaveBasics = async () => {
    if (!contest) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/contests/${contest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription || null,
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
    if (!contest) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/contests/${contest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
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

  const handleDeleteContest = async () => {
    if (!contest) return;
    if (!confirm('Are you sure you want to permanently delete this contest? This cannot be undone.')) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/contests/${contest.id}`, { method: 'DELETE' });
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
            {(['overview', 'options', 'settings'] as const).map(t => (
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
    </div>
  );
}
