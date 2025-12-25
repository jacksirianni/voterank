import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src="/logo-primary.svg" alt="VoteRank" width={120} height={30} className="h-7 w-auto" />
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard" className="btn-secondary text-sm">
                Dashboard
              </Link>
              <Link href="/create" className="btn-primary text-sm">
                Create Contest
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-6">
              Better decisions through{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">ranked choice voting</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              Create polls and elections where every voice counts. Our transparent 
              round-by-round results show exactly how your winner emerged.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create" className="btn-primary text-lg px-8 py-3">
                Create Your First Contest
              </Link>
              <Link href="/vote/city-mascot-2024" className="btn-secondary text-lg px-8 py-3">
                Try Demo Vote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              title="1. Create"
              description="Set up your contest with candidates or options. Choose your voting method and access controls."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              }
              title="2. Vote"
              description="Voters rank choices in order of preference using our intuitive drag-and-drop or grid ballot."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="3. Results"
              description="Watch the winner emerge through transparent round-by-round elimination and vote transfers."
            />
          </div>
        </div>
      </section>

      {/* Why RCV */}
      <section className="py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">
                Why Ranked Choice Voting?
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  <strong className="text-slate-900">No more &quot;wasted&quot; votes.</strong>{' '}
                  If your first choice is eliminated, your vote transfers to your next choice.
                </p>
                <p>
                  <strong className="text-slate-900">Winners need broad support.</strong>{' '}
                  Candidates must appeal beyond their core supporters to win.
                </p>
                <p>
                  <strong className="text-slate-900">Vote your conscience.</strong>{' '}
                  Rank candidates honestly without worrying about &quot;spoiler&quot; effects.
                </p>
                <p>
                  <strong className="text-slate-900">Transparent results.</strong>{' '}
                  See exactly how votes transferred and how the winner emerged.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-display font-semibold text-lg mb-4">Example Round</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Ollie the Owl</span>
                      <span className="text-brand-600 font-semibold">42%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: '42%' }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Rocky the Raccoon</span>
                      <span className="text-slate-600">31%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill bg-slate-400" style={{ width: '31%' }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-400 line-through">Sunny the Sunflower</span>
                      <span className="text-red-500">Eliminated</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill bg-red-300" style={{ width: '27%' }} />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                Sunny&apos;s 27% of votes transfer to their voters&apos; second choices...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-gradient">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to make better decisions?
          </h2>
          <p className="text-indigo-100 mb-8">
            Create your first contest in minutes. Free for basic use, with premium features for teams.
          </p>
          <Link href="/create" className="btn bg-white text-brand-600 hover:bg-slate-50 text-lg px-8 py-3 font-semibold">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Image src="/icon-mark.svg" alt="VoteRank Icon" width={24} height={24} />
              <span className="font-medium">VoteRank</span>
            </div>
            <p className="text-sm text-slate-500">
              Not for legally binding elections. For decisions, polls, and informal voting.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
