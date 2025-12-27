'use client';

import { useState } from 'react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is ranked choice voting?',
      answer: 'Ranked choice voting lets voters rank candidates in order of preference. If no candidate wins a majority of first-choice votes, the candidate with the fewest votes is eliminated and their votes transfer to voters\' next choices. This continues until a candidate has a majority.',
    },
    {
      question: 'Is VoteRank secure?',
      answer: 'Yes. We use device fingerprinting and IP tracking to detect duplicates, encrypted data transmission, and provide full audit trails. However, VoteRank is designed for informal voting and should not be used for legally binding elections.',
    },
    {
      question: 'Can I control who votes in my contest?',
      answer: 'Absolutely. You can make contests public, invite-only with a specific list of voters, or require custom voter IDs. You also have options for duplicate detection and vote verification.',
    },
    {
      question: 'What voting methods do you support?',
      answer: 'We support Instant Runoff Voting (IRV) for single winners, Single Transferable Vote (STV) for multiple winners, and STAR Voting (score then automatic runoff). Each method is designed for different use cases.',
    },
    {
      question: 'How much does it cost?',
      answer: 'VoteRank is free for basic use with up to 100 voters per contest. Pro plans start at $29/month for larger contests and advanced features. Enterprise plans are available for organizations with custom needs.',
    },
    {
      question: 'Can I export the results?',
      answer: 'Yes! You can export full results, round-by-round breakdowns, and ballot data to CSV or PDF format. All data exports include timestamps and audit information.',
    },
    {
      question: 'Is VoteRank suitable for official elections?',
      answer: 'VoteRank is designed for informal voting, polls, and organizational decisions. It should not be used for legally binding elections, government voting, or situations requiring certified voting systems.',
    },
    {
      question: 'Do you offer support?',
      answer: 'Free users get email support. Pro users get priority email support. Team plans include dedicated support with SLA guarantees. We also have comprehensive documentation and guides.',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about VoteRank
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
