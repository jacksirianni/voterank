'use client';

import { useState } from 'react';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { DemoBallotGrid } from '@/components/demo/DemoBallotGrid';
import { RankSummary } from '@/components/demo/RankSummary';
import { CandidateDescriptionGrid } from '@/components/demo/CandidateDescriptionGrid';
import { DEMO_CANDIDATES, NUM_RANKS } from '@/components/demo/demoData';

type DemoStep = 'voting' | 'submitted' | 'results';

export default function DemoPage() {
  const [step, setStep] = useState<DemoStep>('voting');
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

  const handleSubmit = () => {
    setStep('submitted');
  };

  const handleViewResults = () => {
    setStep('results');
  };

  const handleReset = () => {
    setRanks(Array(NUM_RANKS).fill(null));
    setStep('voting');
  };

  const hasAnyRanks = ranks.some(r => r !== null);

  // Voting Step
  if (step === 'voting') {
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

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!hasAnyRanks}
                  className={`
                    px-8 py-4 rounded-xl font-semibold text-lg transition-all
                    ${hasAnyRanks
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-xl hover:-translate-y-0.5 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  Submit Your Vote →
                </button>
              </div>

              <p className="text-center text-sm text-slate-500 mt-4">
                This is a demo - your vote is simulated and not recorded.
              </p>
            </div>

            {/* Candidate Descriptions */}
            <CandidateDescriptionGrid candidates={DEMO_CANDIDATES} />
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Submitted Confirmation Step
  if (step === 'submitted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
        <Header />

        <main className="flex-1 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Success Animation */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
                Vote Submitted!
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                Thank you for experiencing ranked choice voting. In a real election, your vote would now be securely recorded.
              </p>
            </div>

            {/* Your Ballot Summary */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-6 text-center">
                Your Ballot Summary
              </h2>

              <div className="space-y-4">
                {ranks.map((candidateId, idx) => {
                  if (!candidateId) return null;
                  const candidate = DEMO_CANDIDATES.find(c => c.id === candidateId);
                  if (!candidate) return null;

                  return (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold text-lg">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{candidate.title}</div>
                        <div className="text-sm text-slate-600">{candidate.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleViewResults}
                className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                View Demo Results →
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-4 rounded-xl font-semibold text-lg bg-white border-2 border-slate-300 text-slate-700 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                Vote Again
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Results Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-1.5 bg-purple-100 text-purple-700 font-semibold text-sm rounded-full uppercase tracking-wide">
                Demo Results
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
              Simulated Election Results
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Here&apos;s how ranked choice voting determines a winner through instant runoff rounds.
            </p>
          </div>

          {/* Winner Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-3xl shadow-xl p-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
                Hey Jude
              </h2>
              <p className="text-lg text-slate-700 font-semibold mb-4">
                Winner with 58% in Final Round
              </p>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                After 3 rounds of instant runoff voting, &quot;Hey Jude&quot; reached the majority threshold and won the election.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
              How Ranked Choice Voting Works
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Round 1: Count First Choices</h3>
                  <p className="text-slate-600">All first-choice votes are counted. If a song has over 50%, it wins immediately.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Eliminate Last Place</h3>
                  <p className="text-slate-600">If no majority, the song with the fewest votes is eliminated. Votes transfer to voters&apos; next choices.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Repeat Until Winner</h3>
                  <p className="text-slate-600">This process continues until one song reaches over 50% and wins.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleReset}
              className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Try Voting Again
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
