import Link from 'next/link';

const methods = [
  {
    slug: 'irv',
    name: 'Instant Runoff (IRV)',
    category: 'Ranked Choice',
    tagline: 'The gold standard for single-winner elections',
    description: 'Voters rank choices. Last place eliminated each round. Votes transfer until someone wins a majority.',
    complexity: 'Medium',
    bestFor: 'One winner, 3+ options',
    color: 'blue',
    features: ['Eliminates spoilers', 'Majority winner', 'Round-by-round transparency'],
  },
  {
    slug: 'stv',
    name: 'STV',
    category: 'Ranked Choice',
    tagline: 'Proportional representation done right',
    description: 'Elect multiple winners fairly using quotas and ranked ballots. No faction sweeps all seats.',
    complexity: 'High',
    bestFor: 'Boards, committees, councils',
    color: 'blue',
    features: ['Multiple winners', 'Proportional outcomes', 'Fair representation'],
  },
  {
    slug: 'star',
    name: 'STAR',
    category: 'Score-Based',
    tagline: 'Score + automatic runoff',
    description: 'Score candidates, then top two face off. Combines expression with head-to-head legitimacy.',
    complexity: 'Medium',
    bestFor: 'High-stakes single winner',
    color: 'purple',
    features: ['Captures intensity', 'Runoff check', 'Strategic resistance'],
  },
  {
    slug: 'score',
    name: 'Score Voting',
    category: 'Score-Based',
    tagline: 'Express how much you care',
    description: 'Rate each option 0-5 or 0-10. Highest average wins. Perfect for prioritization.',
    complexity: 'Low',
    bestFor: 'Feature prioritization',
    color: 'purple',
    features: ['Captures intensity', 'Simple to count', 'Great for ranking lists'],
  },
  {
    slug: 'approval',
    name: 'Approval',
    category: 'Simple',
    tagline: 'Pick all you like',
    description: 'Approve as many options as you want. Most approvals wins. Fast and effective.',
    complexity: 'Very Low',
    bestFor: 'Quick polls',
    color: 'green',
    features: ['Dead simple', 'Reduces vote-splitting', 'Fast results'],
  },
  {
    slug: 'borda',
    name: 'Borda Count',
    category: 'Ranked Choice',
    tagline: 'Consensus through points',
    description: 'Rank choices, points by position. Rewards broad support over passionate minorities.',
    complexity: 'Low',
    bestFor: 'Consensus building',
    color: 'blue',
    features: ['Consensus winner', 'Simple points system', 'Good for prioritization'],
  },
  {
    slug: 'condorcet',
    name: 'Condorcet',
    category: 'Ranked Choice',
    tagline: 'Head-to-head champion',
    description: 'Find the candidate who beats all others one-on-one. Mathematically elegant.',
    complexity: 'Medium',
    bestFor: 'Academic legitimacy',
    color: 'blue',
    features: ['Pairwise comparison', 'Theoretically optimal', 'Handles cycles'],
  },
  {
    slug: 'plurality',
    name: 'Plurality',
    category: 'Simple',
    tagline: 'One person, one vote',
    description: 'Pick one. Most votes wins. The classic—and most flawed.',
    complexity: 'Very Low',
    bestFor: 'Simple yes/no polls',
    color: 'green',
    features: ['Familiar', 'Fast', 'Prone to spoilers'],
  },
];

const categoryColors = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    hover: 'hover:border-blue-400',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
    hover: 'hover:border-purple-400',
  },
  green: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    hover: 'hover:border-emerald-400',
  },
};

export default function MethodsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-xl font-display font-bold bg-brand-gradient bg-clip-text text-transparent">
            VoteRank
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="px-4 py-1.5 bg-brand-50 border border-brand-200 text-brand-700 rounded-full text-sm font-medium">
                8 voting methods supported
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-brand-600 to-slate-900 bg-clip-text text-transparent">
                Choose the Right
              </span>
              <br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Voting Method
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
              From ranked choice to approval voting, pick the method that fits your decision.
              <span className="block text-lg text-slate-500 mt-2">No election is legally binding.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Quick Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4 text-center">
            What are you trying to do?
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: 'Pick one winner', method: 'IRV' },
              { label: 'Elect a committee', method: 'STV' },
              { label: 'Prioritize features', method: 'Score' },
              { label: 'Quick poll', method: 'Approval' },
              { label: 'Build consensus', method: 'Borda' },
              { label: 'Simplest option', method: 'Plurality' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group px-4 py-2 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-full transition-all cursor-pointer"
              >
                <span className="text-sm text-slate-700 group-hover:text-brand-700 font-medium">
                  {item.label} → <span className="font-bold">{item.method}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methods Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4">
            Methods We Support
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Each method has different strengths. Here&apos;s how to pick the right one.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {methods.map((method) => {
            const colors = categoryColors[method.color as keyof typeof categoryColors];
            return (
              <div
                key={method.slug}
                className={`group relative bg-white rounded-2xl border-2 ${colors.border} ${colors.hover} p-6 transition-all hover:shadow-2xl hover:-translate-y-1`}
              >
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-semibold uppercase tracking-wide`}>
                    {method.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Complexity: {method.complexity}
                  </span>
                </div>

                {/* Method Name */}
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
                  {method.name}
                </h3>

                {/* Tagline */}
                <p className={`text-sm ${colors.text} font-medium mb-3`}>
                  {method.tagline}
                </p>

                {/* Description */}
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {method.description}
                </p>

                {/* Best For */}
                <div className="mb-4">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Best for:</span>
                  <p className="text-sm text-slate-700 font-medium mt-1">{method.bestFor}</p>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {method.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Learn More Link */}
                <Link
                  href={`/methods/${method.slug}`}
                  className={`inline-flex items-center gap-2 ${colors.text} hover:gap-3 font-semibold text-sm transition-all`}
                >
                  Learn more about {method.name}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Quick Comparison
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Compare complexity, use cases, and key features at a glance
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <table className="min-w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Complexity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Best For
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Key Benefit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {methods.map((method) => (
                      <tr key={method.slug} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-white">{method.name}</div>
                          <div className="text-sm text-slate-400">{method.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-white/10 text-slate-300 rounded text-xs font-medium">
                            {method.complexity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {method.bestFor}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {method.features[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4">
              Built for Transparency
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Every method includes clear reporting, audit trails, and honest disclaimers
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Round-by-Round',
                description: 'See exactly how votes transferred in elimination methods',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                title: 'Audit Exports',
                description: 'Download complete ballot data for verification',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                title: 'Clear Tie Rules',
                description: 'Configurable and transparent tie-breaking methods',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                ),
              },
              {
                title: 'Honest Limits',
                description: 'Clear about what each method can and cannot do',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-500 to-brand-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-6">
            Ready to try it out?
          </h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            See ranked choice voting in action with our interactive demo, or create your own contest in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vote/demo-election/results"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-600 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all hover:scale-105 shadow-xl"
            >
              View Live Demo
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-700 text-white rounded-xl font-semibold text-lg hover:bg-brand-800 transition-all hover:scale-105 border-2 border-white/20"
            >
              Create Your Contest
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="text-brand-600 hover:text-brand-700 font-medium">
              ← Back to Home
            </Link>
            <div className="flex gap-8 text-sm">
              <Link href="/docs" className="text-slate-600 hover:text-slate-900 transition-colors">Docs</Link>
              <Link href="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">Terms</Link>
              <Link href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
