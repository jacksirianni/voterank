import Link from 'next/link';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Simple Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VR</span>
            </div>
            <span className="font-display font-bold text-slate-900">VoteRank</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
            {title}
          </h1>
          <p className="text-lg text-slate-600 mb-8">{description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-secondary">
              ← Back to Home
            </Link>
            <Link href="/create" className="btn-primary">
              Create Contest
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
