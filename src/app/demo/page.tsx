'use client';

import { useState } from 'react';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { DemoBallotGrid } from '@/components/demo/DemoBallotGrid';
import { RankSummary } from '@/components/demo/RankSummary';
import { CandidateDescriptionGrid } from '@/components/demo/CandidateDescriptionGrid';
import { DEMO_CANDIDATES, NUM_RANKS } from '@/components/demo/demoData';

export default function DemoPage() {
  // State: array of 5 slots, each can be a candidate ID or null
  const [ranks, setRanks] = useState<(string | null)[]>(
    Array(NUM_RANKS).fill(null)
  );

  const handleRankChange = (candidateId: string, rankIndex: number) => {
    setRanks((prevRanks) => {
      const newRanks = [...prevRanks];

      // If this cell is already selected, toggle it off
      if (newRanks[rankIndex] === candidateId) {
        newRanks[rankIndex] = null;
      } else {
        // Remove candidate from any other rank
        for (let i = 0; i < newRanks.length; i++) {
          if (newRanks[i] === candidateId) {
            newRanks[i] = null;
          }
        }
        // Set the new rank
        newRanks[rankIndex] = candidateId;
      }

      return newRanks;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-1.5 bg-purple-100 text-purple-700 font-semibold text-sm rounded-full uppercase tracking-wide">
                Demo
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-4">
              Experience Ranked Choice Voting
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              See how easy ranked choice voting is for yourself. 👇
            </p>
          </div>

          {/* Main Ballot Card */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 mb-8">
            <DemoBallotGrid
              candidates={DEMO_CANDIDATES}
              ranks={ranks}
              onRankChange={handleRankChange}
            />
            <RankSummary ranks={ranks} candidates={DEMO_CANDIDATES} />
          </div>

          {/* Candidate Descriptions */}
          <CandidateDescriptionGrid candidates={DEMO_CANDIDATES} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
