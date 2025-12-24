'use client';

import { useState, useCallback } from 'react';
import { clsx } from 'clsx';

interface Option {
  id: string;
  name: string;
  description?: string | null;
}

interface GridBallotProps {
  options: Option[];
  onRankingChange: (ranking: string[]) => void;
  disabled?: boolean;
}

export default function GridBallot({ options, onRankingChange, disabled }: GridBallotProps) {
  const [selections, setSelections] = useState<Record<string, number | null>>({});
  
  const maxRank = options.length;
  const ranks = Array.from({ length: maxRank }, (_, i) => i + 1);

  const handleCellClick = useCallback((optionId: string, rank: number) => {
    if (disabled) return;

    setSelections(prev => {
      const newSelections = { ...prev };
      
      // If this option already has this rank, remove it
      if (newSelections[optionId] === rank) {
        newSelections[optionId] = null;
      } else {
        // Clear this rank from any other option
        for (const id of Object.keys(newSelections)) {
          if (newSelections[id] === rank) {
            newSelections[id] = null;
          }
        }
        // Clear any previous rank from this option
        newSelections[optionId] = rank;
      }

      // Convert to ranking array and notify parent
      const ranking = options
        .filter(o => newSelections[o.id] != null)
        .sort((a, b) => (newSelections[a.id] || 0) - (newSelections[b.id] || 0))
        .map(o => o.id);
      
      onRankingChange(ranking);
      
      return newSelections;
    });
  }, [disabled, options, onRankingChange]);

  const clearAll = useCallback(() => {
    setSelections({});
    onRankingChange([]);
  }, [onRankingChange]);

  if (disabled) {
    return (
      <div className="opacity-50 pointer-events-none">
        <div className="text-center py-8 text-slate-500">
          Voting is disabled
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-brand-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-brand-800">
            <p className="font-medium">Click cells to assign ranks</p>
            <p className="text-brand-600 mt-1">
              1 is your top choice. You don&apos;t have to rank everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 bg-slate-100 border border-slate-200 font-medium text-slate-700 min-w-[200px]">
                Candidate
              </th>
              {ranks.map(rank => (
                <th
                  key={rank}
                  className="p-3 bg-slate-100 border border-slate-200 font-medium text-slate-700 text-center w-14"
                >
                  {rank === 1 ? '1st' : rank === 2 ? '2nd' : rank === 3 ? '3rd' : `${rank}th`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {options.map((option, rowIndex) => (
              <tr key={option.id} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-3 border border-slate-200">
                  <div className="font-medium text-slate-900">{option.name}</div>
                  {option.description && (
                    <div className="text-sm text-slate-500 mt-0.5">{option.description}</div>
                  )}
                </td>
                {ranks.map(rank => {
                  const isSelected = selections[option.id] === rank;
                  const isRankUsed = Object.values(selections).includes(rank);
                  
                  return (
                    <td
                      key={rank}
                      className="p-2 border border-slate-200 text-center"
                    >
                      <button
                        onClick={() => handleCellClick(option.id, rank)}
                        className={clsx(
                          'w-10 h-10 rounded-lg border-2 transition-all duration-150',
                          'flex items-center justify-center mx-auto',
                          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1',
                          isSelected
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : isRankUsed
                            ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                            : 'bg-white border-slate-300 hover:border-brand-400 hover:bg-brand-50'
                        )}
                        disabled={isRankUsed && !isSelected}
                        aria-label={`Rank ${option.name} as ${rank}`}
                      >
                        {isSelected && (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

      {/* Summary and clear */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {Object.values(selections).filter(v => v != null).length} of {options.length} ranked
        </div>
        <button
          onClick={clearAll}
          className="text-sm text-slate-500 hover:text-slate-700 underline"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
