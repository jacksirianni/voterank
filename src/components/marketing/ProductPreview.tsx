'use client';

import { useState } from 'react';

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<'create' | 'vote' | 'results'>('create');

  const tabs = [
    { id: 'create' as const, label: 'Create' },
    { id: 'vote' as const, label: 'Vote' },
    { id: 'results' as const, label: 'Results' },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200" id="product">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-3">
            See VoteRank in Action
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore each step of the voting experience
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-white rounded-lg border border-slate-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 font-medium text-sm rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Frame */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 min-h-[400px]">
          {activeTab === 'create' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900">Contest Builder</h3>
              <p className="text-slate-600 max-w-lg mx-auto">
                Intuitive form to set up contests, add candidates, configure voting methods (IRV, STV, STAR),
                and set access controls like invite-only voting.
              </p>
              <div className="pt-4">
                <div className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm">
                  Screenshot placeholder: Contest creation form
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vote' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900">Voting Experience</h3>
              <p className="text-slate-600 max-w-lg mx-auto">
                Clean, accessible ballot with drag-and-drop ranking or grid-based selection. Mobile-optimized
                for voters on any device.
              </p>
              <div className="pt-4">
                <div className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm">
                  Screenshot placeholder: Drag-and-drop ballot interface
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900">Transparent Results</h3>
              <p className="text-slate-600 max-w-lg mx-auto">
                Round-by-round breakdown showing vote transfers, eliminations, and how the winner emerged.
                Export to CSV or PDF.
              </p>
              <div className="pt-4">
                <div className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm">
                  Screenshot placeholder: Results visualization with rounds
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
