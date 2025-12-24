'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DragBallot from '@/components/voting/DragBallot';
import GridBallot from '@/components/voting/GridBallot';

interface Option {
  id: string;
  name: string;
  description?: string | null;
}

interface Category {
  id: string;
  title: string;
  description?: string | null;
  options: Option[];
}

interface Contest {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  status: string;
  visibility: string;
  ballotStyle: string;
  votingMethod: string;
  opensAt?: string | null;
  closesAt?: string | null;
  timezone: string;
  settings: {
    requireVoterId?: boolean;
    allowPartialRanking?: boolean;
  };
  categories: Category[];
  options: Option[];
  _count?: { ballots: number };
}

type VotingStep = 'loading' | 'voter-id' | 'voting' | 'submitting' | 'success' | 'error' | 'closed';

export default function VotePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [step, setStep] = useState<VotingStep>('loading');
  const [error, setError] = useState<string | null>(null);
  const [voterId, setVoterId] = useState('');
  const [voterName, setVoterName] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [rankings, setRankings] = useState<Record<string, string[]>>({});
  const [deviceFingerprint, setDeviceFingerprint] = useState<string>('');

  // Generate a simple device fingerprint
  useEffect(() => {
    const generateFingerprint = () => {
      const stored = localStorage.getItem('vr_device_id');
      if (stored) return stored;
      
      const random = Math.random().toString(36).substring(2);
      const ua = navigator.userAgent;
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const fp = `${random}-${btoa(ua).substring(0, 20)}-${tz}`;
      localStorage.setItem('vr_device_id', fp);
      return fp;
    };
    setDeviceFingerprint(generateFingerprint());
  }, []);

  // Fetch contest data
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await fetch(`/api/contests/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Contest not found');
          } else {
            setError('Failed to load contest');
          }
          setStep('error');
          return;
        }
        const data = await res.json();
        setContest(data);

        // Check if contest is open
        if (data.status !== 'OPEN') {
          setStep('closed');
          return;
        }

        // Check timing
        const now = new Date();
        if (data.opensAt && new Date(data.opensAt) > now) {
          setStep('closed');
          return;
        }
        if (data.closesAt && new Date(data.closesAt) < now) {
          setStep('closed');
          return;
        }

        // Determine starting step
        if (data.settings?.requireVoterId) {
          setStep('voter-id');
        } else {
          setStep('voting');
        }
      } catch {
        setError('Failed to load contest');
        setStep('error');
      }
    };

    fetchContest();
  }, [slug]);

  const handleRankingChange = useCallback((categoryId: string, ranking: string[]) => {
    setRankings(prev => ({ ...prev, [categoryId]: ranking }));
  }, []);

  const categories = contest?.categories.length ? contest.categories : [{ id: 'default', title: '', description: null, options: contest?.options || [] }];
  const currentCategory = categories[currentCategoryIndex];
  const isLastCategory = currentCategoryIndex === categories.length - 1;
  const currentRanking = rankings[currentCategory?.id || 'default'] || [];

  const handleNext = () => {
    if (!isLastCategory) {
      setCurrentCategoryIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!contest) return;

    setStep('submitting');
    setError(null);

    try {
      // Submit ballots for each category
      for (const category of categories) {
        const ranking = rankings[category.id] || [];
        if (ranking.length === 0 && !contest.settings?.allowPartialRanking) {
          continue; // Skip empty rankings if partial not allowed
        }

        const res = await fetch(`/api/contests/${contest.id}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ranking,
            categoryId: category.id !== 'default' ? category.id : undefined,
            voterId: voterId || undefined,
            voterName: voterName || undefined,
            voterEmail: voterEmail || undefined,
            deviceFingerprint,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to submit vote');
        }
      }

      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
      setStep('voting');
    }
  };

  const handleVoterIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterId.trim()) {
      setError('Please enter your voter ID');
      return;
    }
    setError(null);
    setStep('voting');
  };

  // Loading state
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading contest...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (step === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">Oops!</h1>
          <p className="text-slate-600 mb-6">{error || 'Something went wrong'}</p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Closed state
  if (step === 'closed') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-10V7a4 4 0 00-8 0v4h12V7a4 4 0 00-8 0" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">{contest?.title}</h1>
          <p className="text-slate-600 mb-6">
            {contest?.status === 'DRAFT' && 'This contest is not yet open for voting.'}
            {contest?.status === 'CLOSED' && 'This contest has ended.'}
            {contest?.status === 'OPEN' && contest?.opensAt && new Date(contest.opensAt) > new Date() && `Voting opens ${new Date(contest.opensAt).toLocaleDateString()}`}
            {contest?.status === 'OPEN' && contest?.closesAt && new Date(contest.closesAt) < new Date() && 'Voting has closed.'}
          </p>
          {contest?.status === 'CLOSED' && (
            <Link href={`/vote/${slug}/results`} className="btn-primary">
              View Results
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Success state
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Vote Submitted!</h1>
          <p className="text-slate-600 mb-8">Thank you for participating. Your vote has been recorded.</p>
          <div className="space-y-3">
            <Link href={`/vote/${slug}/results`} className="btn-primary w-full block">
              View Results
            </Link>
            <Link href="/" className="btn-ghost w-full block">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Voter ID step
  if (step === 'voter-id') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-slate-900">{contest?.title}</h1>
            {contest?.description && (
              <p className="text-slate-600 mt-2">{contest.description}</p>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Enter Your Details</h2>
            <form onSubmit={handleVoterIdSubmit} className="space-y-4">
              <div>
                <label htmlFor="voterId" className="block text-sm font-medium text-slate-700 mb-1">
                  Voter ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="voterId"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  className="input"
                  placeholder="Enter your voter ID or email"
                  required
                />
              </div>
              <div>
                <label htmlFor="voterName" className="block text-sm font-medium text-slate-700 mb-1">
                  Name (optional)
                </label>
                <input
                  type="text"
                  id="voterName"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  className="input"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="voterEmail" className="block text-sm font-medium text-slate-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="voterEmail"
                  value={voterEmail}
                  onChange={(e) => setVoterEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              <button type="submit" className="btn-primary w-full">
                Continue to Vote
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Voting step
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-display font-bold text-slate-900">{contest?.title}</h1>
          {categories.length > 1 && (
            <div className="flex items-center gap-2 mt-2">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    idx < currentCategoryIndex ? 'bg-green-500' :
                    idx === currentCategoryIndex ? 'bg-brand-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Category title */}
        {currentCategory && currentCategory.title && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {categories.length > 1 && `${currentCategoryIndex + 1}. `}
              {currentCategory.title}
            </h2>
            {currentCategory.description && (
              <p className="text-slate-600 mt-1">{currentCategory.description}</p>
            )}
          </div>
        )}

        {/* Ballot */}
        {contest?.ballotStyle === 'GRID' ? (
          <GridBallot
            options={currentCategory?.options || []}
            onRankingChange={(ranking) => handleRankingChange(currentCategory?.id || 'default', ranking)}
            disabled={step === 'submitting'}
          />
        ) : (
          <DragBallot
            options={currentCategory?.options || []}
            onRankingChange={(ranking) => handleRankingChange(currentCategory?.id || 'default', ranking)}
            disabled={step === 'submitting'}
          />
        )}

        {/* Ranking summary */}
        {currentRanking.length > 0 && (
          <div className="mt-6 p-4 bg-brand-50 border border-brand-200 rounded-xl">
            <h3 className="text-sm font-medium text-brand-800 mb-2">Your Ranking</h3>
            <div className="flex flex-wrap gap-2">
              {currentRanking.map((id, idx) => {
                const option = currentCategory?.options.find(o => o.id === id);
                return (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-brand-200 rounded-full text-sm">
                    <span className="font-semibold text-brand-600">{idx + 1}.</span>
                    <span className="text-slate-700">{option?.name}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {currentCategoryIndex > 0 && (
            <button onClick={handlePrevious} className="btn-ghost flex-1">
              ← Previous
            </button>
          )}
          {!isLastCategory ? (
            <button onClick={handleNext} className="btn-primary flex-1" disabled={currentRanking.length === 0}>
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn-primary flex-1"
              disabled={step === 'submitting' || (currentRanking.length === 0 && !contest?.settings?.allowPartialRanking)}
            >
              {step === 'submitting' ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Submitting...
                </>
              ) : (
                'Submit Vote'
              )}
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-center text-slate-400">
          This is not a legally binding election. Your vote is recorded anonymously.
        </p>
      </main>
    </div>
  );
}
