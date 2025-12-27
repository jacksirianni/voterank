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
    <section className="py-24 bg-gradient-to-br from-slate-50 to-white" id="product">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-full text-sm font-semibold uppercase tracking-wide">
              Product Tour
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
            See VoteRank in <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">action</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Beautiful voting experience from start to finish
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-white rounded-xl border-2 border-slate-200 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 font-semibold text-sm rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-gradient text-white shadow-lg shadow-brand-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Frame */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-200 shadow-2xl p-12 min-h-[450px]">
          {activeTab === 'create' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-brand-gradient text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-brand-500/30">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-3xl font-display font-bold text-slate-900">Contest Builder</h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Intuitive form to set up contests, add candidates, configure voting methods (IRV, STV, STAR),
                and set access controls like invite-only voting.
              </p>
              <div className="pt-6">
                <div className="inline-block px-6 py-3 bg-slate-100 border-2 border-slate-200 text-slate-700 rounded-xl text-sm font-medium">
                  📸 Screenshot placeholder: Contest creation form
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vote' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-brand-gradient text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-brand-500/30">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <h3 className="text-3xl font-display font-bold text-slate-900">Voting Experience</h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Clean, accessible ballot with drag-and-drop ranking or grid-based selection. Mobile-optimized
                for voters on any device.
              </p>
              <div className="pt-6">
                <div className="inline-block px-6 py-3 bg-slate-100 border-2 border-slate-200 text-slate-700 rounded-xl text-sm font-medium">
                  📸 Screenshot placeholder: Drag-and-drop ballot interface
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-brand-gradient text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-brand-500/30">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-display font-bold text-slate-900">Transparent Results</h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Round-by-round breakdown showing vote transfers, eliminations, and how the winner emerged.
                Export to CSV or PDF.
              </p>
              <div className="pt-6">
                <div className="inline-block px-6 py-3 bg-slate-100 border-2 border-slate-200 text-slate-700 rounded-xl text-sm font-medium">
                  📸 Screenshot placeholder: Results visualization with rounds
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
