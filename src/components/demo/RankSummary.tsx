'use client';

import { DemoCandidate, RANK_LABELS } from './demoData';

interface RankSummaryProps {
  ranks: (string | null)[];
  candidates: DemoCandidate[];
}

export function RankSummary({ ranks, candidates }: RankSummaryProps) {
  const getCandidateName = (candidateId: string | null): string => {
    if (!candidateId) return 'Not selected';
    const candidate = candidates.find(c => c.id === candidateId);
    return candidate ? candidate.title : 'Not selected';
  };

  return (
    <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-300 rounded-xl">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-purple-900">Your Ranked Ballot:</span>
        {ranks.map((candidateId, idx) => (
          <span key={idx} className="inline-flex items-baseline gap-1">
            <span className="font-semibold text-purple-700">{idx + 1})</span>
            <span className={candidateId ? 'text-slate-900' : 'text-slate-500 italic'}>
              {getCandidateName(candidateId)}
            </span>
            {idx < ranks.length - 1 && (
              <span className="text-slate-400 mx-1">•</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
