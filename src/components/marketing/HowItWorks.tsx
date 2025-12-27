export function HowItWorks() {
  const steps = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: '1. Create',
      description: 'Set up your contest with candidates or options. Choose voting method and access controls.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      ),
      title: '2. Vote',
      description: 'Voters rank choices in order of preference using intuitive drag-and-drop or grid ballots.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: '3. Results',
      description: 'Watch the winner emerge through transparent round-by-round elimination and vote transfers.',
    },
  ];

  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-1.5 bg-brand-50 border border-brand-200 text-brand-700 rounded-full text-sm font-semibold uppercase tracking-wide">
              How It Works
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
            Three simple steps to <span className="bg-brand-gradient bg-clip-text text-transparent">better decisions</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From setup to transparent results in minutes
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection Line */}
              {index < 2 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-brand-300 to-brand-100 -z-10" />
              )}

              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 hover:border-brand-300 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-brand-gradient text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-500/30 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-brand-500/50 transition-all">
                  {step.icon}
                </div>
                <h3 className="font-display font-bold text-2xl mb-3 text-slate-900">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
