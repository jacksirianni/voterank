'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface TallyEntry {
  candidateId: string;
  votes: number;
  percentage: number;
}

interface Transfer {
  from: string;
  to: string | null;
  count: number;
}

interface Round {
  round: number;
  tallies: TallyEntry[];
  activeBallots: number;
  exhaustedBallots: number;
  exhaustedThisRound: number;
  eliminated: string[];
  transfers: Transfer[];
  winner: string | null;
  notes: string[];
}

interface ResultSummary {
  winner: string | null;
  winningVotes: number;
  winningPercentage: number;
  totalBallots: number;
  validBallots: number;
  exhaustedBallots: number;
  exhaustedPercentage: number;
  totalRounds: number;
  rankings: { candidateId: string; rank: number; eliminatedRound: number | null }[];
}

interface ResultData {
  contestId: string;
  categoryId?: string;
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
}

export default function ResultsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [results, setResults] = useState<Record<string, ResultData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

        // Determine categories
        const categories = contestData.categories.length > 0
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
          }
        }

        setResults(resultsMap);
        setSelectedCategory(categories[0].id);
        setLoading(false);
      } catch (err) {
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

  const getOptionName = (id: string) => {
    return contest?.options.find(o => o.id === id)?.name ||
           results[selectedCategory || 'default']?.options.find(o => o.id === id)?.name ||
           id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
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
    );
  }

  const currentResults = selectedCategory ? results[selectedCategory] : null;
  const categories = contest.categories.length > 0 ? contest.categories : [{ id: 'default', title: 'Results' }];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link href={`/vote/${slug}`} className="text-sm text-brand-600 hover:text-brand-700 mb-2 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to contest
          </Link>
          <h1 className="text-2xl font-display font-bold text-slate-900">{contest.title}</h1>
          <p className="text-slate-600 mt-1">
            {contest.votingMethod === 'IRV' ? 'Instant Runoff Voting' : contest.votingMethod} Results
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-brand-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-300'
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
              <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-6 text-white mb-8">
                <div className="text-sm font-medium text-brand-100 mb-1">Winner</div>
                <div className="text-3xl font-display font-bold mb-2">
                  {getOptionName(currentResults.summary.winner)}
                </div>
                <div className="text-brand-100">
                  {currentResults.summary.winningVotes.toLocaleString()} votes ({currentResults.summary.winningPercentage.toFixed(1)}%)
                </div>
              </div>
            )}

            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{currentResults.summary.validBallots.toLocaleString()}</div>
                <div className="text-sm text-slate-500">Total Votes</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{currentResults.summary.totalRounds}</div>
                <div className="text-sm text-slate-500">Rounds</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{currentResults.summary.exhaustedBallots.toLocaleString()}</div>
                <div className="text-sm text-slate-500">Exhausted</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{currentResults.summary.exhaustedPercentage.toFixed(1)}%</div>
                <div className="text-sm text-slate-500">Exhausted Rate</div>
              </div>
            </div>

            {/* Final rankings */}
            <div className="card p-6 mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Final Rankings</h2>
              <div className="space-y-3">
                {currentResults.summary.rankings.map((item, idx) => (
                  <div key={item.candidateId} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                      idx === 1 ? 'bg-slate-300 text-slate-700' :
                      idx === 2 ? 'bg-amber-600 text-white' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {item.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{getOptionName(item.candidateId)}</div>
                      <div className="text-sm text-slate-500">
                        {item.eliminatedRound ? `Eliminated round ${item.eliminatedRound}` : 'Winner'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Round-by-round breakdown */}
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Round-by-Round</h2>
                <p className="text-sm text-slate-500 mt-1">
                  See how votes transferred in each round
                </p>
              </div>
              
              <div className="divide-y divide-slate-200">
                {currentResults.rounds.map((round) => (
                  <div key={round.round}>
                    <button
                      onClick={() => toggleRound(round.round)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-medium text-slate-600">
                          {round.round}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-slate-900">
                            Round {round.round}
                            {round.winner && <span className="ml-2 text-green-600">• Winner declared</span>}
                          </div>
                          <div className="text-sm text-slate-500">
                            {round.eliminated.length > 0 && (
                              <>Eliminated: {round.eliminated.map(id => getOptionName(id)).join(', ')}</>
                            )}
                            {round.eliminated.length === 0 && !round.winner && 'Initial count'}
                          </div>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-slate-400 transition-transform ${expandedRounds.has(round.round) ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedRounds.has(round.round) && (
                      <div className="px-6 pb-6 space-y-4">
                        {/* Vote tallies */}
                        <div className="space-y-2">
                          {round.tallies.map(tally => {
                            const isEliminated = round.eliminated.includes(tally.candidateId);
                            const isWinner = round.winner === tally.candidateId;
                            
                            return (
                              <div key={tally.candidateId} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className={`font-medium ${isEliminated ? 'text-slate-400 line-through' : isWinner ? 'text-green-700' : 'text-slate-700'}`}>
                                    {getOptionName(tally.candidateId)}
                                    {isWinner && <span className="ml-2">🎉</span>}
                                  </span>
                                  <span className="text-slate-500">
                                    {tally.votes.toLocaleString()} ({tally.percentage.toFixed(1)}%)
                                  </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      isEliminated ? 'bg-slate-300' :
                                      isWinner ? 'bg-green-500' :
                                      'bg-brand-500'
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
                          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                            <div className="text-sm font-medium text-slate-700 mb-2">Vote Transfers</div>
                            <div className="space-y-1 text-sm text-slate-600">
                              {round.transfers.map((transfer, idx) => (
                                <div key={idx}>
                                  {transfer.count} votes from {getOptionName(transfer.from)} →{' '}
                                  {transfer.to ? getOptionName(transfer.to) : 'Exhausted'}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Exhausted ballots */}
                        {round.exhaustedThisRound > 0 && (
                          <div className="text-sm text-slate-500">
                            {round.exhaustedThisRound} ballots exhausted this round (total: {round.exhaustedBallots})
                          </div>
                        )}

                        {/* Notes */}
                        {round.notes.length > 0 && (
                          <div className="text-sm text-slate-500 italic">
                            {round.notes.join(' • ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="mt-8 card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">How Instant Runoff Voting Works</h2>
              <div className="prose prose-sm prose-slate">
                <p>
                  Instant Runoff Voting (IRV) finds a winner through rounds of counting. In each round,
                  if no candidate has more than 50% of the active votes, the candidate with the fewest
                  votes is eliminated. Their supporters&apos; votes then transfer to their next-ranked choice.
                </p>
                <p>
                  This continues until one candidate reaches a majority of the remaining active ballots.
                  Some ballots become &quot;exhausted&quot; when all their ranked candidates have been eliminated.
                </p>
              </div>
            </div>

            {/* Computed at */}
            <div className="mt-4 text-center text-xs text-slate-400">
              Results computed {new Date(currentResults.computedAt).toLocaleString()}
            </div>
          </>
        ) : (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">No Results Yet</h2>
            <p className="text-slate-600">
              Results will appear here once votes have been cast.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
