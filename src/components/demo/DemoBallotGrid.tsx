'use client';

import { DemoCandidate, RANK_LABELS, NUM_RANKS } from './demoData';

interface DemoBallotGridProps {
  candidates: DemoCandidate[];
  ranks: (string | null)[];
  onRankChange: (candidateId: string, rankIndex: number) => void;
}

function getInitials(title: string): string {
  return title
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function DemoBallotGrid({ candidates, ranks, onRankChange }: DemoBallotGridProps) {
  const isSelected = (candidateId: string, rankIndex: number): boolean => {
    return ranks[rankIndex] === candidateId;
  };

  const getRankLabel = (rankIndex: number): string => {
    return RANK_LABELS[rankIndex];
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">
          Rank your vote
        </h2>
        <p className="text-sm text-slate-600">
          Rank up to five songs. Mark no more than one oval in each column.
        </p>
      </div>

      {/* Grid Container with scroll */}
      <div className="max-h-[500px] overflow-y-auto border border-slate-200 rounded-xl bg-white">
        <table className="w-full">
          <thead className="sticky top-0 bg-white border-b border-slate-200 z-10">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-900 min-w-[200px]">
                Best Beatles Song
              </th>
              {RANK_LABELS.map((label, idx) => (
                <th
                  key={idx}
                  className="text-center p-4 font-semibold text-slate-700 w-20"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                {/* Candidate Info */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-purple-700">
                        {getInitials(candidate.title)}
                      </span>
                    </div>
                    {/* Title and Meta */}
                    <div>
                      <div className="font-semibold text-slate-900">
                        {candidate.title}
                      </div>
                      {candidate.album && candidate.year && (
                        <div className="text-xs text-slate-500">
                          {candidate.album} • {candidate.year}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Rank Ovals */}
                {Array.from({ length: NUM_RANKS }).map((_, rankIndex) => {
                  const selected = isSelected(candidate.id, rankIndex);
                  const label = getRankLabel(rankIndex);

                  return (
                    <td key={rankIndex} className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => onRankChange(candidate.id, rankIndex)}
                        aria-pressed={selected}
                        aria-label={
                          selected
                            ? `Remove "${candidate.title}" from ${label}`
                            : `Set "${candidate.title}" as ${label}`
                        }
                        className={`
                          w-6 h-6 rounded-full border-2 transition-all
                          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                          ${
                            selected
                              ? 'bg-purple-600 border-purple-600 shadow-md'
                              : 'bg-white border-slate-300 hover:border-purple-400'
                          }
                        `}
                      >
                        {selected && (
                          <svg
                            className="w-full h-full text-white p-0.5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle cx="12" cy="12" r="5" />
                          </svg>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
