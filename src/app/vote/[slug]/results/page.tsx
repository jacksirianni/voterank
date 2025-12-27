'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

interface TallyEntry {
  optionId: string;
  optionName: string;
  votes: number;
  percentage: number;
  status: 'active' | 'eliminated' | 'elected';
}

interface Transfer {
  fromOptionId: string;
  fromOptionName: string;
  toOptionId: string | null;
  toOptionName: string | null;
  count: number;
}

interface Round {
  roundNumber: number;
  tallies: TallyEntry[];
  activeBallots: number;
  totalExhausted: number;
  exhaustedBallots: number;
  eliminated: { optionId: string; optionName: string; votes: number }[];
  elected: { optionId: string; optionName: string; votes: number }[] | null;
  transfers: Transfer[];
  notes: string[];
  majorityThreshold: number;
}

interface ResultSummary {
  winner: {
    optionId: string;
    optionName: string;
    finalVotes: number;
    finalPercentage: number;
  } | null;
  totalBallots: number;
  validBallots: number;
  exhaustedBallots: number;
  exhaustedPercentage: number;
  roundsCount: number;
  isTie: boolean;
  finalRankings: {
    optionId: string;
    optionName: string;
    rank: number;
    finalVotes: number;
    eliminatedInRound: number | null;
  }[];
}

interface ResultData {
  method: string;
  computedAt: string;
  rounds: Round[];
  summary: ResultSummary;
  options: { id: string; name: string }[];
}

interface Contest {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  votingMethod: string;
  categories: { id: string; title: string }[];
  options: { id: string; name: string }[];
  settings: {
    resultsVisibility?: 'PUBLIC' | 'ORGANIZER_ONLY' | 'HIDDEN';
    winnersCount?: number;
    tieBreakMethod?: 'eliminate-all' | 'random' | 'keep-all';
  };
}

export default function ResultsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [results, setResults] = useState<Record<string, ResultData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultsHidden, setResultsHidden] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedRounds, setExpandedRounds] = useState<Set<number>>(new Set([1]));

  // Fetch contest and results
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contest
        const contestRes = await fetch(`/api/contests/${slug}`);
        if (!contestRes.ok) throw new Error('Contest not found');
        const contestData = await contestRes.json();
        setContest(contestData);

        // Check if results are hidden
        const settings = contestData.settings || {};
        if (settings.resultsVisibility === 'HIDDEN') {
          setResultsHidden(true);
          setLoading(false);
          return;
        }

        // Determine categories
        const categories = contestData.categories?.length > 0
          ? contestData.categories
          : [{ id: 'default', title: 'Results' }];

        // Fetch results for each category
        const resultsMap: Record<string, ResultData> = {};
        for (const cat of categories) {
          const catParam = cat.id !== 'default' ? `?categoryId=${cat.id}` : '';
          const resultsRes = await fetch(`/api/contests/${contestData.id}/results${catParam}`);
          if (resultsRes.ok) {
            const resultData = await resultsRes.json();
            resultsMap[cat.id] = resultData;
          } else if (resultsRes.status === 403) {
            // Results are restricted
            setResultsHidden(true);
            setLoading(false);
            return;
          }
        }

        setResults(resultsMap);
        setSelectedCategory(categories[0].id);
        setLoading(false);
      } catch (err) {
        console.error('Error loading results:', err);
        setError(err instanceof Error ? err.message : 'Failed to load results');
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const toggleRound = (round: number) => {
    setExpandedRounds(prev => {
      const next = new Set(prev);
      if (next.has(round)) {
        next.delete(round);
      } else {
        next.add(round);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <Header />
        <div className="flex items-center justify-center p-4 py-24">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">Error</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link href="/" className="btn-primary">Go Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Hidden results state
  if (resultsHidden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <Header />
        <div className="flex items-center justify-center p-4 py-24">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">{contest.title}</h1>
            <p className="text-slate-600 mb-6">
              Results for this contest are private. Only the organizer can view them.
            </p>
            <Link href={`/vote/${slug}`} className="btn-secondary">
              Back to Contest
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const categories = contest?.categories?.length > 0 ? contest.categories : [{ id: 'default', title: 'Results' }];
  const currentResults = selectedCategory ? results[selectedCategory] : (results['default'] || null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Page header */}
        <div className="text-center mb-12">
          <Link href={`/vote/${slug}`} className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to contest
          </Link>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-2">{contest.title}</h1>
          <p className="text-lg text-slate-600">
            {contest.votingMethod === 'IRV' ? 'Instant Runoff Voting' : contest.votingMethod} Results
          </p>
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-brand-gradient text-white shadow-lg shadow-brand-500/30'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-brand-300'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        )}

        {currentResults ? (
          <>
            {/* Winner announcement */}
            {currentResults.summary.winner && (
              <div className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white mb-8 shadow-2xl">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl animate-blob" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl animate-blob animation-delay-2000" />
                </div>

                <div className="relative text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    Winner
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-display font-bold mb-3">
                    {currentResults.summary.winner.optionName}
                  </h2>
                  <p className="text-xl text-brand-100">
                    {currentResults.summary.winner.finalVotes.toLocaleString()} votes ({currentResults.summary.winner.finalPercentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
            )}

            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 text-center hover:border-brand-300 transition-colors">
                <div className="text-3xl font-bold text-slate-900 mb-1">{currentResults.summary.validBallots.toLocaleString()}</div>
                <div className="text-sm font-medium text-slate-500">Total Votes</div>
              </div>
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 text-center hover:border-brand-300 transition-colors">
                <div className="text-3xl font-bold text-slate-900 mb-1">{currentResults.summary.roundsCount}</div>
                <div className="text-sm font-medium text-slate-500">Rounds</div>
              </div>
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 text-center hover:border-brand-300 transition-colors">
                <div className="text-3xl font-bold text-slate-900 mb-1">{currentResults.summary.exhaustedBallots.toLocaleString()}</div>
                <div className="text-sm font-medium text-slate-500">Exhausted</div>
              </div>
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 text-center hover:border-brand-300 transition-colors">
                <div className="text-3xl font-bold text-slate-900 mb-1">{currentResults.summary.exhaustedPercentage.toFixed(1)}%</div>
                <div className="text-sm font-medium text-slate-500">Exhausted Rate</div>
              </div>
            </div>

            {/* Final rankings */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 mb-8 shadow-lg">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Final Rankings</h2>
              <div className="space-y-4">
                {currentResults.summary.finalRankings.map((item, idx) => (
                  <div key={item.optionId} className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md ${
                      idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900' :
                      idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700' :
                      idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-slate-900">{item.optionName}</div>
                      <div className="text-sm text-slate-500">
                        {item.finalVotes.toLocaleString()} votes •{' '}
                        {item.eliminatedInRound ? `Eliminated round ${item.eliminatedInRound}` : 'Winner'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Round-by-round breakdown */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-lg">
              <div className="p-6 sm:p-8 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Round-by-Round</h2>
                <p className="text-slate-600">
                  See how votes transferred in each round
                </p>
              </div>

              <div className="divide-y divide-slate-200">
                {currentResults.rounds.map((round) => {
                  const hasWinner = round.elected && round.elected.length > 0;

                  return (
                    <div key={round.roundNumber}>
                      <button
                        onClick={() => toggleRound(round.roundNumber)}
                        className="w-full px-6 sm:px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl flex items-center justify-center font-bold text-brand-700">
                            {round.roundNumber}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-slate-900">
                              Round {round.roundNumber}
                              {hasWinner && <span className="ml-2 text-green-600">• Winner declared</span>}
                            </div>
                            <div className="text-sm text-slate-500">
                              {round.eliminated.length > 0 && (
                                <>Eliminated: {round.eliminated.map(e => e.optionName).join(', ')}</>
                              )}
                              {round.eliminated.length === 0 && !hasWinner && 'Initial count'}
                            </div>
                          </div>
                        </div>
                        <svg
                          className={`w-5 h-5 text-slate-400 transition-transform ${expandedRounds.has(round.roundNumber) ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {expandedRounds.has(round.roundNumber) && (
                        <div className="px-6 sm:px-8 pb-6 space-y-6 bg-slate-50/50">
                          {/* Vote tallies */}
                          <div className="space-y-3">
                            {round.tallies.map(tally => {
                              const isEliminated = tally.status === 'eliminated';
                              const isWinner = tally.status === 'elected';

                              return (
                                <div key={tally.optionId} className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className={`font-semibold ${isEliminated ? 'text-slate-400 line-through' : isWinner ? 'text-green-700' : 'text-slate-700'}`}>
                                      {tally.optionName}
                                      {isWinner && <span className="ml-2">🎉</span>}
                                    </span>
                                    <span className="text-slate-600 font-medium">
                                      {tally.votes.toLocaleString()} ({tally.percentage.toFixed(1)}%)
                                    </span>
                                  </div>
                                  <div className="h-3 bg-white rounded-full overflow-hidden border border-slate-200">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        isEliminated ? 'bg-slate-300' :
                                        isWinner ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                        'bg-gradient-to-r from-brand-500 to-brand-600'
                                      }`}
                                      style={{ width: `${Math.min(tally.percentage, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Transfers */}
                          {round.transfers.length > 0 && (
                            <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
                              <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                Vote Transfers
                              </div>
                              <div className="space-y-2 text-sm text-slate-600">
                                {round.transfers.map((transfer, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <span className="font-medium text-slate-700">{transfer.count}</span>
                                    <span>votes from</span>
                                    <span className="font-medium text-slate-700">{transfer.fromOptionName}</span>
                                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span className="font-medium text-slate-700">{transfer.toOptionName || 'Exhausted'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Exhausted ballots */}
                          {round.exhaustedBallots > 0 && (
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {round.exhaustedBallots} ballots exhausted (total: {round.totalExhausted})
                            </div>
                          )}

                          {/* Notes */}
                          {round.notes.length > 0 && (
                            <div className="space-y-2">
                              {round.notes.map((note, idx) => {
                                const isTieNote = note.toLowerCase().includes('tie');
                                return (
                                  <div
                                    key={idx}
                                    className={`text-sm ${
                                      isTieNote
                                        ? 'p-3 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-800 font-medium'
                                        : 'text-slate-600 italic'
                                    }`}
                                  >
                                    {isTieNote && (
                                      <span className="inline-flex items-center gap-1.5 mr-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Tie Detected:
                                      </span>
                                    )}{' '}
                                    {note}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How it works */}
            <div className="mt-8 bg-gradient-to-br from-brand-50 to-purple-50 border-2 border-brand-200 rounded-3xl p-6 sm:p-8">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">
                How {contest.votingMethod === 'IRV' ? 'Instant Runoff Voting' : contest.votingMethod === 'STV' ? 'Single Transferable Vote' : contest.votingMethod} Works
              </h2>
              <div className="prose prose-slate max-w-none">
                {contest.votingMethod === 'IRV' ? (
                  <>
                    <p className="text-slate-600 leading-relaxed">
                      Instant Runoff Voting (IRV) finds a winner through rounds of counting. In each round,
                      if no candidate has more than 50% of the active votes, the candidate with the fewest
                      votes is eliminated. Their supporters' votes then transfer to their next-ranked choice.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-3">
                      This continues until one candidate reaches a majority of the remaining active ballots.
                      Some ballots become "exhausted" when all their ranked candidates have been eliminated.
                    </p>
                  </>
                ) : contest.votingMethod === 'STV' ? (
                  <>
                    <p className="text-slate-600 leading-relaxed">
                      Single Transferable Vote (STV) elects multiple winners proportionally. It uses a "quota"
                      (calculated as: total votes ÷ (winners + 1) + 1) that candidates must reach to be elected.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-3">
                      In each round, candidates reaching the quota are elected. Any votes beyond the quota
                      (surplus votes) transfer to voters' next preferences. If no candidate reaches the quota,
                      the candidate with the fewest votes is eliminated and their votes transfer.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-3">
                      This continues until all {contest.settings?.winnersCount || 'available'} seats are filled.
                      Ballots become "exhausted" when all their ranked candidates have been either elected or eliminated.
                    </p>
                  </>
                ) : (
                  <p className="text-slate-600 leading-relaxed">Results are calculated using the {contest.votingMethod} method.</p>
                )}
              </div>
            </div>

            {/* Computed at */}
            <div className="mt-6 text-center text-sm text-slate-400">
              Results computed {new Date(currentResults.computedAt).toLocaleString()}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">No Results Yet</h2>
            <p className="text-slate-600">
              Results will appear here once votes have been cast.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
