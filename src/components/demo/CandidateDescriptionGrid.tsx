'use client';

import { DemoCandidate } from './demoData';

interface CandidateDescriptionGridProps {
  candidates: DemoCandidate[];
}

function getInitials(title: string): string {
  return title
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function CandidateDescriptionGrid({ candidates }: CandidateDescriptionGridProps) {
  return (
    <div className="mt-16">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-1 bg-slate-100 rounded-full mb-4">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Candidate Descriptions
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-purple-700">
                  {getInitials(candidate.title)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                  {candidate.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {candidate.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
