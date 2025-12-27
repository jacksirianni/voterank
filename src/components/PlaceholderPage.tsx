import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

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

      <Footer />
    </div>
  );
}
