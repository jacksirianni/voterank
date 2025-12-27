import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { TrustChips } from '@/components/marketing/TrustChips';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { ProductPreview } from '@/components/marketing/ProductPreview';
import { TemplatesGrid } from '@/components/marketing/TemplatesGrid';
import { TrustAndControls } from '@/components/marketing/TrustAndControls';
import { MethodsTeaser } from '@/components/marketing/MethodsTeaser';
import { PricingPreview } from '@/components/marketing/PricingPreview';
import { FAQ } from '@/components/marketing/FAQ';
import { Footer } from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
              Better decisions through{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                ranked choice voting
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Create polls and elections where every voice counts. Transparent round-by-round results
              show exactly how your winner emerged.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/create" className="btn-primary text-lg px-8 py-3.5 font-semibold">
                Create Free Contest
              </Link>
              <Link href="/vote/demo-election" className="btn-secondary text-lg px-8 py-3.5 font-semibold">
                Try Demo Vote
              </Link>
            </div>
            <Link
              href="/results/demo-election"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
            >
              View sample results
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <TrustChips />
      <HowItWorks />
      <ProductPreview />
      <TemplatesGrid />
      <TrustAndControls />
      <MethodsTeaser />
      <PricingPreview />
      <FAQ />

      {/* Final CTA */}
      <section className="py-20 bg-brand-gradient">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Ready to make better decisions?
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Create your first contest in minutes. Free for basic use.
          </p>
          <Link
            href="/create"
            className="btn bg-white text-brand-600 hover:bg-slate-50 text-lg px-8 py-3.5 font-semibold inline-flex items-center gap-2"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
