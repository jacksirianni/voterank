import Link from 'next/link';

const methods = [
  {
    slug: 'irv',
    name: 'Ranked Choice (IRV)',
    shortName: 'IRV',
    tagline: 'Best for: single-winner votes with 3+ options',
    description: 'Voters rank choices. Last place is eliminated each round. Votes transfer until a majority winner emerges.',
    icon: '🗳️',
  },
  {
    slug: 'stv',
    name: 'Single Transferable Vote (STV)',
    shortName: 'STV',
    tagline: 'Best for: multi-winner elections (boards, committees)',
    description: 'Ranked ballots elect multiple winners using a quota and transfers so results are more representative.',
    icon: '👥',
  },
  {
    slug: 'borda',
    name: 'Borda Count',
    shortName: 'Borda',
    tagline: 'Best for: consensus ranking and prioritization',
    description: 'Ranked ballots convert into points by position. Highest total points wins.',
    icon: '📊',
  },
  {
    slug: 'condorcet',
    name: 'Condorcet',
    shortName: 'Condorcet',
    tagline: 'Best for: head-to-head legitimacy',
    description: 'Uses ranked ballots to compare every pair of options. If a Condorcet winner exists, it wins.',
    icon: '⚖️',
  },
  {
    slug: 'approval',
    name: 'Approval',
    shortName: 'Approval',
    tagline: 'Best for: fast polls and broad support',
    description: 'Voters approve any number of options. Most approvals wins.',
    icon: '✓',
  },
  {
    slug: 'score',
    name: 'Score (Range Voting)',
    shortName: 'Score',
    tagline: 'Best for: capturing intensity and prioritizing',
    description: 'Voters score options on a numeric scale. Highest total or average wins.',
    icon: '⭐',
  },
  {
    slug: 'star',
    name: 'STAR',
    shortName: 'STAR',
    tagline: 'Best for: single-winner decisions with intensity + a final check',
    description: 'Score vote to find top two… then an automatic runoff decides the winner.',
    icon: '🌟',
  },
  {
    slug: 'plurality',
    name: 'Plurality',
    shortName: 'Plurality',
    tagline: 'Best for: simple, low-stakes, few options',
    description: 'One vote per person. Most votes wins.',
    icon: '1️⃣',
  },
];

const quickChoices = [
  { label: 'One winner, ranked ballot, transparent rounds', method: 'IRV (Ranked Choice)' },
  { label: 'Multiple winners with ranked ballots', method: 'STV' },
  { label: 'Consensus ranking and prioritization', method: 'Borda' },
  { label: 'Head-to-head "beats all others" principle', method: 'Condorcet' },
  { label: 'Fast "pick all acceptable" polling', method: 'Approval' },
  { label: 'Intensity-based prioritization', method: 'Score' },
  { label: 'Intensity + runoff check', method: 'STAR' },
  { label: 'Simplest single-choice polling', method: 'Plurality' },
];

export default function MethodsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-xl font-display font-bold bg-brand-gradient bg-clip-text text-transparent">
            VoteRank
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
            Voting Methods
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mb-6">
            Different decisions call for different voting systems. VoteRank supports multiple methods
            so you can pick what fits your group… whether you&apos;re choosing one winner, electing a committee,
            or prioritizing a roadmap.
          </p>
          <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Not for legally binding elections… built for decisions, polls, and informal voting.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Chooser */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Quick Chooser</h2>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {quickChoices.map((choice, idx) => (
            <div key={idx} className="px-6 py-4 flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-500 mt-2"></div>
              <div className="flex-1">
                <span className="text-slate-700">{choice.label}: </span>
                <span className="font-semibold text-slate-900">{choice.method}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Methods Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Methods We Support</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {methods.map((method) => (
            <div key={method.slug} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-brand-300 transition-colors">
              <div className="flex items-start gap-4 mb-3">
                <div className="text-4xl">{method.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-1">
                    {method.name}
                  </h3>
                  <p className="text-sm text-brand-600 font-medium mb-2">{method.tagline}</p>
                </div>
              </div>
              <p className="text-slate-600 mb-4">{method.description}</p>
              <Link
                href={`/methods/${method.slug}`}
                className="text-brand-600 hover:text-brand-700 font-medium text-sm inline-flex items-center gap-1"
              >
                Learn more
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency Section */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Transparency Matters</h2>
          <p className="text-slate-600 mb-6">
            VoteRank emphasizes explainable outcomes:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-slate-900">Round-by-round reporting</p>
                <p className="text-sm text-slate-600">See how votes transferred in elimination methods</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-slate-900">Clear tie rules</p>
                <p className="text-sm text-slate-600">Configurable and transparent tie-breaking</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-slate-900">Audit-friendly exports</p>
                <p className="text-sm text-slate-600">Where enabled for verification</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-slate-900">Honest disclaimers</p>
                <p className="text-sm text-slate-600">About appropriate use cases</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to run a vote?
          </h2>
          <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
            Create a contest, try our demo, or explore sample results to see how ranked choice voting works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="btn-primary bg-white text-brand-600 hover:bg-slate-50"
            >
              Create a Contest
            </Link>
            <Link
              href="/vote/demo-election/results"
              className="btn-secondary border-white text-white hover:bg-white/10"
            >
              View Sample Results
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-brand-600 hover:text-brand-700 font-medium">
              ← Back to Home
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/docs" className="text-slate-600 hover:text-slate-900">Docs</Link>
              <Link href="/privacy" className="text-slate-600 hover:text-slate-900">Privacy</Link>
              <Link href="/terms" className="text-slate-600 hover:text-slate-900">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
