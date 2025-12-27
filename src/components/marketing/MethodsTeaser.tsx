import Link from 'next/link';

export function MethodsTeaser() {
  const methods = [
    {
      name: 'Instant Runoff (IRV)',
      description: 'Single-winner with ranked choice elimination',
      best: 'Best for: Elections, single winners',
    },
    {
      name: 'Single Transferable Vote (STV)',
      description: 'Multi-winner proportional representation',
      best: 'Best for: Committees, boards',
    },
    {
      name: 'STAR Voting',
      description: 'Score then automatic runoff',
      best: 'Best for: Expressive preferences',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-3">
            Multiple Voting Methods
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the right voting system for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {methods.map((method, index) => (
            <div key={index} className="card p-6">
              <h3 className="font-display font-semibold text-lg mb-2 text-slate-900">
                {method.name}
              </h3>
              <p className="text-slate-600 text-sm mb-3">{method.description}</p>
              <p className="text-brand-600 text-sm font-medium">{method.best}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/methods" className="btn-secondary inline-flex items-center gap-2">
            Learn About All Methods
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
